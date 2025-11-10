<script>
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';

	let step = 1;
	let loading = false;
	let message = null;
	let messageType = 'success';

	// Form data
	let formData = {
		first_name: '',
		last_name: '',
		location: '',
		timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
		experience_level: '',
		employment_status: '',
		resume_file: null,
		resume_url: '',
		linkedin_url: '',
		job_preferences: {
			desired_roles: [],
			desired_industries: [],
			job_types: [],
			salary_min: '',
			salary_max: '',
			remote_preference: ''
		},
		skills: [],
		visibility: 'agents_only'
	};

	let skillInput = '';
	let resumeFileName = '';

	const experienceLevels = ['Entry Level', 'Mid Level', 'Senior', 'Executive', 'Lead'];
	const employmentStatuses = ['Employed', 'Unemployed', 'Freelance', 'Contract', 'Student', 'Career Break'];
	const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
	const remotePreferences = ['Remote', 'Hybrid', 'On-site', 'Flexible'];

	const steps = [
		{ num: 1, label: 'Personal Info', icon: 'user' },
		{ num: 2, label: 'Experience', icon: 'briefcase' },
		{ num: 3, label: 'Resume & Skills', icon: 'file-text' },
		{ num: 4, label: 'Preferences', icon: 'settings' }
	];

	function addSkill() {
		if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
			formData.skills = [...formData.skills, skillInput.trim()];
			skillInput = '';
		}
	}

	function removeSkill(skill) {
		formData.skills = formData.skills.filter(s => s !== skill);
	}

	function handleFileUpload(event) {
		const file = event.target.files[0];
		if (file) {
			if (file.type === 'application/pdf') {
				formData.resume_file = file;
				resumeFileName = file.name;
				message = null;
			} else {
				message = 'Please upload a PDF file';
				messageType = 'danger';
			}
		}
	}

	function toggleJobType(type) {
		const current = formData.job_preferences.job_types || [];
		if (current.includes(type)) {
			formData.job_preferences.job_types = current.filter(t => t !== type);
		} else {
			formData.job_preferences.job_types = [...current, type];
		}
	}

	function validateStep() {
		if (step === 1) {
			if (!formData.first_name || !formData.last_name || !formData.location) {
				message = 'Please fill in all required fields';
				messageType = 'danger';
				return false;
			}
		}
		if (step === 2) {
			if (!formData.experience_level || !formData.employment_status) {
				message = 'Please select your experience level and employment status';
				messageType = 'danger';
				return false;
			}
		}
		return true;
	}

	function nextStep() {
		if (validateStep()) {
			step = Math.min(step + 1, 4);
			message = null;
		}
	}

	function prevStep() {
		step = Math.max(step - 1, 1);
		message = null;
	}

	async function uploadResume(userId) {
		if (!formData.resume_file) return null;

		const fileExt = 'pdf';
		const fileName = `${userId}-${Date.now()}.${fileExt}`;
		const filePath = `resumes/${fileName}`;

		const { data, error } = await supabase.storage
			.from('candidate-resumes')
			.upload(filePath, formData.resume_file);

		if (error) {
			console.error('Resume upload error:', error);
			return null;
		}

		const { data: urlData } = supabase.storage
			.from('candidate-resumes')
			.getPublicUrl(filePath);

		return urlData.publicUrl;
	}

	async function completeOnboarding() {
		loading = true;
		message = 'Saving your profile...';
		messageType = 'info';

		const {
			data: { session }
		} = await supabase.auth.getSession();

		if (!session) {
			goto('/login');
			return;
		}

		// Upload resume if provided
		let resumeUrl = formData.resume_url;
		if (formData.resume_file) {
			const uploadedUrl = await uploadResume(session.user.id);
			if (uploadedUrl) {
				resumeUrl = uploadedUrl;
			}
		}

		// Prepare candidate data
		const candidateData = {
			user_id: session.user.id,
			first_name: formData.first_name,
			last_name: formData.last_name,
			location: formData.location,
			timezone: formData.timezone,
			experience_level: formData.experience_level,
			employment_status: formData.employment_status,
			resume_url: resumeUrl,
			linkedin_url: formData.linkedin_url,
			job_preferences: formData.job_preferences,
			skills: formData.skills,
			visibility: formData.visibility,
			onboarding_status: 'completed',
			profile_completeness: calculateCompleteness()
		};

		// Insert or update candidate record
		const { error } = await supabase
			.from('candidates')
			.upsert(candidateData, { onConflict: 'user_id' });

		if (error) {
			message = error.message;
			messageType = 'danger';
			loading = false;
			return;
		}

		message = 'Onboarding complete! Redirecting...';
		messageType = 'success';
		loading = false;

		setTimeout(() => goto('/candidate/dashboard'), 1200);
	}

	function calculateCompleteness() {
		let score = 0;
		if (formData.first_name) score += 10;
		if (formData.last_name) score += 10;
		if (formData.location) score += 10;
		if (formData.experience_level) score += 15;
		if (formData.employment_status) score += 15;
		if (formData.resume_file || formData.resume_url) score += 20;
		if (formData.skills.length > 0) score += 10;
		if (formData.job_preferences.job_types.length > 0) score += 10;
		return score;
	}

	$: progress = (step / 4) * 100;
</script>

<svelte:head>
	<title>Complete Your Profile - CVMama</title>
</svelte:head>

<div class="min-vh-100 bg-gradient py-4 px-3">
	<div class="container" style="max-width: 900px;">
		
		<!-- Header -->
		<div class="text-center mb-4">
			
			<h1 class="h2 fw-bold mb-2">Complete Your Profile</h1>
			<p class="text-muted">Before we begin, help us understand you better.</p>
		</div>

		<!-- Progress Steps -->
		<div class="mb-4">
			<div class="steps-container">
				{#each steps as s, idx}
					<div class="step-item">
						<div class="step-content">
							<div class="step-circle {step >= s.num ? 'active' : ''}">
								{#if s.icon === 'user'}
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
								{:else if s.icon === 'briefcase'}
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
								{:else if s.icon === 'file-text'}
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
								{:else if s.icon === 'settings'}
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m5.2-13.8 4.2 4.2m-5-5-4.2 4.2m13.8 5.2-6-0m-6 0-6 0m13.8 5.2-4.2-4.2m5 5-4.2-4.2M1 12h6m6 0h6"></path></svg>
								{/if}
							</div>
							<span class="step-label {step >= s.num ? 'active' : ''}">{s.label}</span>
						</div>
						{#if idx < steps.length - 1}
							<div class="step-line {step > s.num ? 'active' : ''}"></div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Card -->
		<div class="card shadow-lg border-0 rounded-3 mb-4">
			<div class="card-body p-4 p-md-5">
				
				<!-- Message Alert -->
				{#if message}
					<div class="alert alert-{messageType} mb-4" role="alert">
						{message}
					</div>
				{/if}

				<!-- Step 1: Personal Information -->
				{#if step === 1}
					<div class="step-content-area">
						<div class="mb-4">
							<h2 class="h3 fw-bold mb-1">Personal Information</h2>
							<p class="text-muted small">Tell us about yourself</p>
						</div>

						<div class="row g-3 mb-3">
							<div class="col-md-6">
								<label class="form-label fw-medium">
									First Name <span class="text-danger">*</span>
								</label>
								<input
									type="text"
									class="form-control form-control-lg"
									placeholder="John"
									bind:value={formData.first_name}
									required
								/>
							</div>
							<div class="col-md-6">
								<label class="form-label fw-medium">
									Last Name <span class="text-danger">*</span>
								</label>
								<input
									type="text"
									class="form-control form-control-lg"
									placeholder="Doe"
									bind:value={formData.last_name}
									required
								/>
							</div>
						</div>

						<div class="mb-3">
							<label class="form-label fw-medium">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
								Location <span class="text-danger">*</span>
							</label>
							<input
								type="text"
								class="form-control form-control-lg"
								placeholder="e.g. Nairobi, Kenya"
								bind:value={formData.location}
								required
							/>
						</div>

						<div class="mb-3">
							<label class="form-label fw-medium">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
								Timezone
							</label>
							<input
								type="text"
								class="form-control form-control-lg bg-light"
								bind:value={formData.timezone}
								placeholder="Africa/Nairobi"
							/>
						</div>

						<div class="mb-3">
							<label class="form-label fw-medium">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
								LinkedIn Profile
							</label>
							<input
								type="url"
								class="form-control form-control-lg"
								placeholder="https://linkedin.com/in/yourprofile"
								bind:value={formData.linkedin_url}
							/>
						</div>
					</div>
				{/if}

				<!-- Step 2: Professional Experience -->
				{#if step === 2}
					<div class="step-content-area">
						<div class="mb-4">
							<h2 class="h3 fw-bold mb-1">Professional Background</h2>
							<p class="text-muted small">Help us understand your experience</p>
						</div>

						<div class="mb-4">
							<label class="form-label fw-medium">
								Experience Level <span class="text-danger">*</span>
							</label>
							<div class="btn-group-grid">
								{#each experienceLevels as level}
									<button
										type="button"
										class="btn-option {formData.experience_level === level.toLowerCase().replace(' ', '_') ? 'active' : ''}"
										on:click={() => formData.experience_level = level.toLowerCase().replace(' ', '_')}
									>
										{level}
									</button>
								{/each}
							</div>
						</div>

						<div class="mb-3">
							<label class="form-label fw-medium">
								Current Employment Status <span class="text-danger">*</span>
							</label>
							<div class="btn-group-grid">
								{#each employmentStatuses as status}
									<button
										type="button"
										class="btn-option {formData.employment_status === status.toLowerCase().replace(' ', '_') ? 'active' : ''}"
										on:click={() => formData.employment_status = status.toLowerCase().replace(' ', '_')}
									>
										{status}
									</button>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- Step 3: Resume & Skills -->
				{#if step === 3}
					<div class="step-content-area">
						<div class="mb-4">
							<h2 class="h3 fw-bold mb-1">Resume & Skills</h2>
							<p class="text-muted small">Upload your resume and add your key skills</p>
						</div>

						<div class="mb-4">
							<label class="form-label fw-medium">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
								Upload Resume (PDF)
							</label>
							<div class="upload-area">
								<input
									type="file"
									accept=".pdf"
									on:change={handleFileUpload}
									class="d-none"
									id="resume-upload"
								/>
								<label for="resume-upload" class="upload-label">
									<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-3 text-muted"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
									{#if resumeFileName}
										<p class="text-success fw-medium mb-1">{resumeFileName}</p>
										<p class="text-muted small mb-0">Click to change</p>
									{:else}
										<p class="fw-medium mb-1">Click to upload or drag and drop</p>
										<p class="text-muted small mb-0">PDF only (max 5MB)</p>
									{/if}
								</label>
							</div>
						</div>

						<div class="mb-3">
							<label class="form-label fw-medium">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-1"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
								Skills
							</label>
							<div class="input-group mb-3">
								<input
									type="text"
									class="form-control form-control-lg"
									placeholder="e.g. JavaScript, Project Management"
									bind:value={skillInput}
									on:keypress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
								/>
								<button class="btn btn-primary px-4" type="button" on:click={addSkill}>
									Add
								</button>
							</div>
							<div class="skills-container">
								{#each formData.skills as skill}
									<span class="skill-badge">
										{skill}
										<button
											type="button"
											class="skill-remove"
											on:click={() => removeSkill(skill)}
										>
											×
										</button>
									</span>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- Step 4: Job Preferences -->
				{#if step === 4}
					<div class="step-content-area">
						<div class="mb-4">
							<h2 class="h3 fw-bold mb-1">Job Preferences</h2>
							<p class="text-muted small">What are you looking for in your next role?</p>
						</div>

						<div class="mb-4">
							<label class="form-label fw-medium">Desired Job Types</label>
							<div class="btn-group-grid">
								{#each jobTypes as type}
									<button
										type="button"
										class="btn-option {(formData.job_preferences.job_types || []).includes(type) ? 'active' : ''}"
										on:click={() => toggleJobType(type)}
									>
										{type}
									</button>
								{/each}
							</div>
						</div>

						<div class="mb-4">
							<label class="form-label fw-medium">Remote Work Preference</label>
							<div class="btn-group-grid grid-4">
								{#each remotePreferences as pref}
									<button
										type="button"
										class="btn-option {formData.job_preferences.remote_preference === pref.toLowerCase() ? 'active' : ''}"
										on:click={() => formData.job_preferences.remote_preference = pref.toLowerCase()}
									>
										{pref}
									</button>
								{/each}
							</div>
						</div>

						<div class="row g-3 mb-4">
							<div class="col-md-6">
								<label class="form-label fw-medium">Minimum Salary (USD)</label>
								<input
									type="number"
									class="form-control form-control-lg"
									placeholder="50,000"
									bind:value={formData.job_preferences.salary_min}
								/>
							</div>
							<div class="col-md-6">
								<label class="form-label fw-medium">Maximum Salary (USD)</label>
								<input
									type="number"
									class="form-control form-control-lg"
									placeholder="100,000"
									bind:value={formData.job_preferences.salary_max}
								/>
							</div>
						</div>

						<div class="mb-3">
							<label class="form-label fw-medium">Profile Visibility</label>
							<select
								class="form-select form-select-lg"
								bind:value={formData.visibility}
							>
								<option value="agents_only">Agents Only (Recommended)</option>
								<option value="public">Public - Visible to everyone</option>
								<option value="private">Private - Hidden from search</option>
							</select>
							<p class="text-muted small mt-2">
								{#if formData.visibility === 'agents_only'}
									Your profile will only be visible to our AI agents for job matching
								{:else if formData.visibility === 'public'}
									Your profile will be visible to all recruiters and companies
								{:else}
									Your profile will be hidden from all searches
								{/if}
							</p>
						</div>
					</div>
				{/if}

				<!-- Navigation Buttons -->
				<div class="d-flex justify-content-between mt-4 pt-4 border-top">
					{#if step > 1}
						<button
							type="button"
							class="btn btn-outline-secondary btn-lg px-4"
							on:click={prevStep}
						>
							Previous
						</button>
					{:else}
						<div></div>
					{/if}

					{#if step < 4}
						<button
							type="button"
							class="btn btn-primary btn-lg px-4"
							on:click={nextStep}
						>
							Next Step
						</button>
					{:else}
						<button
							type="button"
							class="btn btn-gradient btn-lg px-5"
							on:click={completeOnboarding}
							disabled={loading}
						>
							{loading ? 'Completing...' : 'Complete Onboarding'}
						</button>
					{/if}
				</div>

			</div>
		</div>

		<!-- Footer -->
		<p class="text-center text-muted">
			Need help? <a href="#" class="text-primary fw-semibold">Contact Support</a>
		</p>
	</div>
</div>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
	}

	.bg-gradient {
		background: linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #fae8ff 100%);
		min-height: 100vh;
	}

	.icon-circle {
		width: 64px;
		height: 64px;
		background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
		border-radius: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}

	.steps-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 2rem;
		padding: 0 1rem;
	}

	.step-item {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.step-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	.step-circle {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 2px solid #d1d5db;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #9ca3af;
		transition: all 0.3s ease;
	}

	.step-circle.active {
		background: #2563eb;
		border-color: #2563eb;
		color: white;
	}

	.step-label {
		font-size: 0.75rem;
		margin-top: 0.5rem;
		font-weight: 500;
		color: #9ca3af;
		transition: all 0.3s ease;
		text-align: center;
	}

	.step-label.active {
		color: #2563eb;
	}

	.step-line {
		height: 2px;
		flex: 1;
		background: #d1d5db;
		margin: 0 0.5rem;
		transition: all 0.3s ease;
	}

	.step-line.active {
		background: #2563eb;
	}

	.card {
		border-radius: 1rem !important;
	}

	.form-control-lg,
	.form-select-lg {
		padding: 0.75rem 1rem;
		font-size: 1rem;
		border-radius: 0.5rem;
		border: 1px solid #d1d5db;
		transition: all 0.2s ease;
	}

	.form-control-lg:focus,
	.form-select-lg:focus {
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.btn-group-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 0.75rem;
	}

	.btn-group-grid.grid-4 {
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	}

	.btn-option {
		padding: 0.75rem 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.5rem;
		background: white;
		font-weight: 500;
		color: #374151;
		transition: all 0.2s ease;
		cursor: pointer;
		font-size: 0.9rem;
	}

	.btn-option:hover {
		border-color: #d1d5db;
		background: #f9fafb;
	}

	.btn-option.active {
		border-color: #2563eb;
		background: #eff6ff;
		color: #1e40af;
	}

	.upload-area {
		border: 2px dashed #d1d5db;
		border-radius: 0.75rem;
		padding: 3rem 2rem;
		text-align: center;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.upload-area:hover {
		border-color: #60a5fa;
		background: #f9fafb;
	}

	.upload-label {
		cursor: pointer;
		margin: 0;
		width: 100%;
	}

	.skills-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.skill-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: #dbeafe;
		color: #1e40af;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.skill-remove {
		background: none;
		border: none;
		color: #1e40af;
		font-size: 1.25rem;
		line-height: 1;
		padding: 0;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.skill-remove:hover {
		color: #1e3a8a;
		transform: scale(1.2);
	}

	.btn-gradient {
		background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
		border: none;
		color: white;
		font-weight: 600;
		transition: all 0.3s ease;
	}

	.btn-gradient:hover {
		background: linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%);
		transform: translateY(-2px);
		box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
	}

	.btn-gradient:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.step-content-area {
		animation: fadeIn 0.3s ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.steps-container {
			padding: 0;
		}

		.step-circle {
			width: 40px;
			height: 40px;
		}

		.step-label {
			font-size: 0.65rem;
		}

		.step-line {
			margin: 0 0.25rem;
		}

		.btn-group-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.btn-group-grid.grid-4 {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 576px) {
		.card-body {
			padding: 1.5rem !important;
		}

		.step-label {
			display: none;
		}

		.upload-area {
			padding: 2rem 1rem;
		}
	}
</style>