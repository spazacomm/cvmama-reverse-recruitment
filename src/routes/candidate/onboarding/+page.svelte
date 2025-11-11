<!-- +page.svelte -->
<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';
    
    let currentStep = 1;
    const totalSteps = 5;
    let userId = null;
    let candidateId = null;
    let loading = false;
    let error = '';
    let successMessage = '';
    
    // Form data matching schema
    let formData = {
      // Personal Details
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      avatar_url: '',
      location: '',
      country: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      
      // Career Details
      career_stage: '',
      employment_status: '',
      current_title: '',
      linkedin_url: '',
      portfolio_url: '',
      resume_url: '',
      
      // Job Preferences
      target_roles: [],
      target_industries: [],
      target_skills: [],
      remote_preference: '',
      salary_min: null,
      salary_max: null,
      salary_currency: 'USD',
      salary_frequency: 'annually',
      
      // Settings
      communication_preference: '',
      visibility_level: 'agents',
      github_url: '',
      bio: '',
      notes: ''
    };
    
    // Consents
    let consents = {
      terms_and_conditions: false,
      privacy_policy: false,
      data_processing: false,
      job_alerts: false,
      profile_search: true
    };
    
    let avatarFile = null;
    let resumeFile = null;
    let avatarPreview = 'https://ui-avatars.com/api/?name=User&background=667eea&color=fff&size=200';
    let resumeFileName = '';
    let tempInput = '';
    
    const countries = [
      'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
      'France', 'Kenya', 'Nigeria', 'South Africa', 'India', 'Singapore'
    ];
    
    const timezones = [
      'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'America/Denver',
      'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Africa/Nairobi', 
      'Africa/Lagos', 'Africa/Johannesburg', 'Asia/Singapore', 'Asia/Kolkata',
      'Australia/Sydney', 'Pacific/Auckland'
    ];
    
    onMount(async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          goto('/login');
          return;
        }
        
        userId = user.id;
        formData.email = user.email || '';
        
        // Check for existing candidate profile
        const { data: candidate, error: fetchError } = await supabase
          .from('candidates')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (candidate) {
          candidateId = candidate.id;
          
          if (candidate.onboarding_completed) {
            goto('/candidate/dashboard');
            return;
          }
          
          // Load existing data
          currentStep = candidate.onboarding_step || 1;
          Object.keys(formData).forEach(key => {
            if (candidate[key] !== null && candidate[key] !== undefined) {
              formData[key] = candidate[key];
            }
          });
          
          if (candidate.avatar_url) {
            avatarPreview = candidate.avatar_url;
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
        error = 'Failed to load profile data';
      }
    });
    
    function handleAvatarChange(event) {
      const file = event.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          error = 'Avatar must be less than 5MB';
          return;
        }
        
        avatarFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          avatarPreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
    
    function handleResumeChange(event) {
      const file = event.target.files?.[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          error = 'Resume must be less than 10MB';
          return;
        }
        
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
          error = 'Resume must be PDF or Word document';
          return;
        }
        
        resumeFile = file;
        resumeFileName = file.name;
      }
    }
    
    async function uploadAvatar() {
      if (!avatarFile || !userId) return null;
      
      try {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${userId}_${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('candidate-files')
          .upload(filePath, avatarFile, { upsert: true });
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('candidate-files')
          .getPublicUrl(filePath);
        
        return publicUrl;
      } catch (err) {
        console.error('Avatar upload error:', err);
        return null;
      }
    }
    
    async function uploadResume() {
      if (!resumeFile || !userId) return null;
      
      try {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${userId}_resume_${Date.now()}.${fileExt}`;
        const filePath = `resumes/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, resumeFile, { upsert: true });
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(filePath);
        
        return publicUrl;
      } catch (err) {
        console.error('Resume upload error:', err);
        return null;
      }
    }
    
    function addToArray(field) {
      if (tempInput.trim()) {
        formData[field] = [...formData[field], tempInput.trim()];
        tempInput = '';
      }
    }
    
    function removeFromArray(field, index) {
      formData[field] = formData[field].filter((_, i) => i !== index);
    }
    
    function validateStep(step) {
      error = '';
      
      switch(step) {
        case 1: // Personal Details
          if (!formData.first_name?.trim()) {
            error = 'First name is required';
            return false;
          }
          if (!formData.last_name?.trim()) {
            error = 'Last name is required';
            return false;
          }
          if (!formData.email?.trim()) {
            error = 'Email is required';
            return false;
          }
          if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            error = 'Please enter a valid email address';
            return false;
          }
          break;
          
        case 2: // Career Details
          if (!formData.career_stage) {
            error = 'Please select your career stage';
            return false;
          }
          if (!formData.employment_status) {
            error = 'Please select your employment status';
            return false;
          }
          break;
          
        case 3: // Job Preferences
          if (formData.target_roles.length === 0) {
            error = 'Please add at least one target role';
            return false;
          }
          if (!formData.remote_preference) {
            error = 'Please select your remote work preference';
            return false;
          }
          break;
      }
      
      return true;
    }
    
    async function saveProgress() {
      try {
        const fullName = `${formData.first_name} ${formData.last_name}`.trim();
        
        const updateData = {
          ...formData,
          full_name: fullName,
          user_id: userId,
          onboarding_step: currentStep,
          updated_at: new Date().toISOString()
        };
        
        if (candidateId) {
          const { error: updateError } = await supabase
            .from('candidates')
            .update(updateData)
            .eq('id', candidateId);
          
          if (updateError) throw updateError;
        } else {
          const { data, error: insertError } = await supabase
            .from('candidates')
            .insert(updateData)
            .select()
            .single();
          
          if (insertError) throw insertError;
          candidateId = data.id;
        }
        
        successMessage = 'Progress saved';
        setTimeout(() => successMessage = '', 2000);
      } catch (err) {
        console.error('Save progress error:', err);
        throw err;
      }
    }
    
    async function nextStep() {
      if (!validateStep(currentStep)) return;
      
      loading = true;
      error = '';
      
      try {
        await saveProgress();
        
        if (currentStep < totalSteps) {
          currentStep++;
        }
      } catch (err) {
        error = 'Failed to save progress. Please try again.';
      } finally {
        loading = false;
      }
    }
    
    async function prevStep() {
      if (currentStep > 1) {
        currentStep--;
        error = '';
      }
    }
    
    function goToStep(step) {
      if (step >= 1 && step <= currentStep) {
        currentStep = step;
        error = '';
      }
    }
    
    async function completeOnboarding() {
      if (!consents.terms_and_conditions) {
        error = 'You must accept the Terms and Conditions';
        return;
      }
      
      if (!consents.privacy_policy) {
        error = 'You must accept the Privacy Policy';
        return;
      }
      
      if (!consents.data_processing) {
        error = 'You must consent to data processing';
        return;
      }
      
      loading = true;
      error = '';
      
      try {
        // Upload files if present
        if (avatarFile) {
          const avatarUrl = await uploadAvatar();
          if (avatarUrl) formData.avatar_url = avatarUrl;
        }
        
        if (resumeFile) {
          const resumeUrl = await uploadResume();
          if (resumeUrl) {
            formData.resume_url = resumeUrl;
            formData.resume_updated_at = new Date().toISOString();
          }
        }
        
        const fullName = `${formData.first_name} ${formData.last_name}`.trim();
        
        // Final update with completion status
        const { error: updateError } = await supabase
          .from('candidates')
          .update({
            ...formData,
            full_name: fullName,
            onboarding_completed: true,
            onboarding_step: totalSteps,
            updated_at: new Date().toISOString()
          })
          .eq('id', candidateId);
        
        if (updateError) throw updateError;
        
        // Optionally store consents in separate table
        await supabase.from('candidate_consents').insert({
          candidate_id: candidateId,
          ...consents,
          consented_at: new Date().toISOString()
        });
        
        // Redirect to dashboard
        goto('/candidate/dashboard');
      } catch (err) {
        console.error('Onboarding completion error:', err);
        error = 'Failed to complete onboarding. Please try again.';
      } finally {
        loading = false;
      }
    }
  </script>
  
  <div class="container-xxl">
    <div class="row py-4">
      <div class="col-12">
        <div class="card">
          <!-- Header -->
          <div class="card-header primary-bg text-white">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h4 class="mb-1 text-white">Complete Your Profile</h4>
                <p class="mb-0 text-white-50 small">Step {currentStep} of {totalSteps}</p>
              </div>
              <div class="text-end">
                <small class="text-white-50">
                  {#if successMessage}
                    <i class="bx bx-check-circle"></i> {successMessage}
                  {/if}
                </small>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="progress mt-3" style="height: 6px;">
              <div 
                class="progress-bar bg-success" 
                role="progressbar" 
                style="width: {(currentStep / totalSteps) * 100}%"
                aria-valuenow={currentStep} 
                aria-valuemin="0" 
                aria-valuemax={totalSteps}
              ></div>
            </div>
          </div>
          
          <div class="card-body">
            <form on:submit|preventDefault={nextStep}>
              <div class="row">
                <!-- Sidebar Navigation -->
                <!-- <div class="col-lg-3 col-md-4 mb-4 mb-lg-0">
                  <div class="nav flex-column nav-pills bg-light rounded-3 p-3" role="tablist">
                    <button
                      type="button"
                      class="nav-link {currentStep === 1 ? 'active' : ''} {currentStep > 1 ? 'text-success' : ''} text-start mb-2"
                      on:click={() => goToStep(1)}
                      disabled={currentStep < 1}
                    >
                      <i class="bx bx-user fs-18 me-2"></i>
                      <span class="d-none d-md-inline">Personal Details</span>
                      {#if currentStep > 1}
                        <i class="bx bx-check-circle float-end text-success"></i>
                      {/if}
                    </button>
                    
                    <button
                      type="button"
                      class="nav-link {currentStep === 2 ? 'active' : ''} {currentStep > 2 ? 'text-success' : ''} text-start mb-2"
                      on:click={() => goToStep(2)}
                      disabled={currentStep < 2}
                    >
                      <i class="bx bx-briefcase fs-18 me-2"></i>
                      <span class="d-none d-md-inline">Career Details</span>
                      {#if currentStep > 2}
                        <i class="bx bx-check-circle float-end text-success"></i>
                      {/if}
                    </button>
                    
                    <button
                      type="button"
                      class="nav-link {currentStep === 3 ? 'active' : ''} {currentStep > 3 ? 'text-success' : ''} text-start mb-2"
                      on:click={() => goToStep(3)}
                      disabled={currentStep < 3}
                    >
                      <i class="bx bx-target-lock fs-18 me-2"></i>
                      <span class="d-none d-md-inline">Job Preferences</span>
                      {#if currentStep > 3}
                        <i class="bx bx-check-circle float-end text-success"></i>
                      {/if}
                    </button>
                    
                    <button
                      type="button"
                      class="nav-link {currentStep === 4 ? 'active' : ''} {currentStep > 4 ? 'text-success' : ''} text-start mb-2"
                      on:click={() => goToStep(4)}
                      disabled={currentStep < 4}
                    >
                      <i class="bx bx-cog fs-18 me-2"></i>
                      <span class="d-none d-md-inline">Settings</span>
                      {#if currentStep > 4}
                        <i class="bx bx-check-circle float-end text-success"></i>
                      {/if}
                    </button>
                    
                    <button
                      type="button"
                      class="nav-link {currentStep === 5 ? 'active' : ''} text-start"
                      on:click={() => goToStep(5)}
                      disabled={currentStep < 5}
                    >
                      <i class="bx bx-check-circle fs-18 me-2"></i>
                      <span class="d-none d-md-inline">Review & Complete</span>
                    </button>
                  </div>
                </div> -->
                
                <!-- Content Area -->
                <div class="col-lg-9 col-md-8">
                  {#if error}
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                      <i class="bx bx-error-circle me-2"></i>
                      {error}
                      <button type="button" class="btn-close" on:click={() => error = ''}></button>
                    </div>
                  {/if}
                  
                  <!-- Step 1: Personal Details -->
                  {#if currentStep === 1}
                    <div class="step-content">
                      <div class="mb-4">
                        <h5 class="fw-bold text-primary mb-1">
                          <i class="bx bx-user-circle me-2"></i>Personal Information
                        </h5>
                        <p class="text-muted small mb-0">Tell us about yourself</p>
                      </div>
                      
                      <!-- Avatar Upload -->
                      <div class="text-center mb-4">
                        <div class="position-relative d-inline-block">
                          <img 
                            src={avatarPreview} 
                            alt="Avatar" 
                            class="rounded-circle border border-3 border-light shadow-sm"
                            style="width: 120px; height: 120px; object-fit: cover;"
                          />
                          <label 
                            for="avatarInput" 
                            class="position-absolute bottom-0 end-0 btn btn-sm btn-primary rounded-circle shadow"
                            style="width: 36px; height: 36px; padding: 0; cursor: pointer;"
                          >
                            <i class="bx bx-camera"></i>
                          </label>
                          <input 
                            type="file" 
                            id="avatarInput" 
                            class="d-none" 
                            accept="image/*"
                            on:change={handleAvatarChange}
                          />
                        </div>
                        <p class="text-muted small mt-2 mb-0">Click camera to upload photo (Max 5MB)</p>
                      </div>
                      
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label for="first_name" class="form-label fw-semibold">
                            First Name <span class="text-danger">*</span>
                          </label>
                          <input 
                            type="text" 
                            id="first_name" 
                            class="form-control" 
                            bind:value={formData.first_name}
                            placeholder="John"
                            required
                          />
                        </div>
                        
                        <div class="col-md-6">
                          <label for="last_name" class="form-label fw-semibold">
                            Last Name <span class="text-danger">*</span>
                          </label>
                          <input 
                            type="text" 
                            id="last_name" 
                            class="form-control" 
                            bind:value={formData.last_name}
                            placeholder="Doe"
                            required
                          />
                        </div>
                        
                        <div class="col-md-6">
                          <label for="email" class="form-label fw-semibold">
                            Email Address <span class="text-danger">*</span>
                          </label>
                          <input 
                            type="email" 
                            id="email" 
                            class="form-control" 
                            bind:value={formData.email}
                            placeholder="john.doe@example.com"
                            required
                          />
                        </div>
                        
                        <div class="col-md-6">
                          <label for="phone" class="form-label fw-semibold">
                            Phone Number
                          </label>
                          <input 
                            type="tel" 
                            id="phone" 
                            class="form-control" 
                            bind:value={formData.phone}
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        
                        <div class="col-md-6">
                          <label for="location" class="form-label fw-semibold">
                            City/Location
                          </label>
                          <input 
                            type="text" 
                            id="location" 
                            class="form-control" 
                            bind:value={formData.location}
                            placeholder="San Francisco, CA"
                          />
                        </div>
                        
                        <div class="col-md-6">
                          <label for="country" class="form-label fw-semibold">
                            Country
                          </label>
                          <select 
                            id="country" 
                            class="form-select" 
                            bind:value={formData.country}
                          >
                            <option value="">Select Country</option>
                            {#each countries as country}
                              <option value={country}>{country}</option>
                            {/each}
                          </select>
                        </div>
                        
                        <div class="col-12">
                          <label for="timezone" class="form-label fw-semibold">
                            Timezone
                          </label>
                          <select 
                            id="timezone" 
                            class="form-select" 
                            bind:value={formData.timezone}
                          >
                            <option value="">Select Timezone</option>
                            {#each timezones as tz}
                              <option value={tz}>{tz}</option>
                            {/each}
                          </select>
                          <div class="form-text">
                            <i class="bx bx-info-circle"></i> 
                            We've detected your timezone as: {formData.timezone}
                          </div>
                        </div>
                      </div>
                    </div>
                  {/if}
                  
                  <!-- Step 2: Career Details -->
                  {#if currentStep === 2}
                    <div class="step-content">
                      <div class="mb-4">
                        <h5 class="fw-bold text-primary mb-1">
                          <i class="bx bx-briefcase-alt-2 me-2"></i>Career Information
                        </h5>
                        <p class="text-muted small mb-0">Share your professional background</p>
                      </div>
                      
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label for="career_stage" class="form-label fw-semibold">
                            Career Stage <span class="text-danger">*</span>
                          </label>
                          <select 
                            id="career_stage" 
                            class="form-select" 
                            bind:value={formData.career_stage}
                            required
                          >
                            <option value="">Select Career Stage</option>
                            <option value="entry">Entry Level (0-2 years)</option>
                            <option value="mid">Mid Level (3-5 years)</option>
                            <option value="senior">Senior Level (6-10 years)</option>
                            <option value="executive">Executive (10+ years)</option>
                          </select>
                        </div>
                        
                        <div class="col-md-6">
                          <label for="employment_status" class="form-label fw-semibold">
                            Employment Status <span class="text-danger">*</span>
                          </label>
                          <select 
                            id="employment_status" 
                            class="form-select" 
                            bind:value={formData.employment_status}
                            required
                          >
                            <option value="">Select Status</option>
                            <option value="employed">Currently Employed</option>
                            <option value="unemployed">Actively Looking</option>
                            <option value="freelance">Freelancer</option>
                            <option value="self-employed">Self-Employed</option>
                            <option value="student">Student</option>
                          </select>
                        </div>
                        
                        <div class="col-12">
                          <label for="current_title" class="form-label fw-semibold">
                            Current/Most Recent Job Title
                          </label>
                          <input 
                            type="text" 
                            id="current_title" 
                            class="form-control" 
                            bind:value={formData.current_title}
                            placeholder="e.g., Senior Software Engineer"
                          />
                        </div>
                        
                        <div class="col-12">
                          <label for="bio" class="form-label fw-semibold">
                            Professional Bio
                          </label>
                          <textarea 
                            id="bio" 
                            class="form-control" 
                            rows="4"
                            bind:value={formData.bio}
                            placeholder="Tell us about your professional background, key achievements, and what makes you unique..."
                          ></textarea>
                          <div class="form-text">
                            <i class="bx bx-info-circle"></i> 
                            This will be visible to potential employers
                          </div>
                        </div>
                        
                        <div class="col-md-6">
                          <label for="linkedin_url" class="form-label fw-semibold">
                            <i class="bx bxl-linkedin-square text-primary"></i> LinkedIn Profile
                          </label>
                          <input 
                            type="url" 
                            id="linkedin_url" 
                            class="form-control" 
                            bind:value={formData.linkedin_url}
                            placeholder="https://linkedin.com/in/johndoe"
                          />
                        </div>
                        
                        <div class="col-md-6">
                          <label for="portfolio_url" class="form-label fw-semibold">
                            <i class="bx bx-world text-info"></i> Portfolio Website
                          </label>
                          <input 
                            type="url" 
                            id="portfolio_url" 
                            class="form-control" 
                            bind:value={formData.portfolio_url}
                            placeholder="https://yourportfolio.com"
                          />
                        </div>
                        
                        <div class="col-12">
                          <label for="resumeInput" class="form-label fw-semibold">
                            <i class="bx bx-file text-danger"></i> Resume/CV
                          </label>
                          <div class="input-group">
                            <input 
                              type="file" 
                              id="resumeInput" 
                              class="form-control" 
                              accept=".pdf,.doc,.docx"
                              on:change={handleResumeChange}
                            />
                            {#if resumeFileName}
                              <button 
                                class="btn btn-outline-secondary" 
                                type="button"
                                on:click={() => {resumeFile = null; resumeFileName = '';}}
                              >
                                <i class="bx bx-x"></i>
                              </button>
                            {/if}
                          </div>
                          <div class="form-text">
                            <i class="bx bx-info-circle"></i> 
                            Upload PDF or Word document (Max 10MB)
                            {#if resumeFileName}
                              <br><strong class="text-success">Selected: {resumeFileName}</strong>
                            {/if}
                          </div>
                        </div>
                      </div>
                    </div>
                  {/if}
                  
                  <!-- Step 3: Job Preferences -->
                  {#if currentStep === 3}
                    <div class="step-content">
                      <div class="mb-4">
                        <h5 class="fw-bold text-primary mb-1">
                          <i class="bx bx-target-lock me-2"></i>Job Preferences
                        </h5>
                        <p class="text-muted small mb-0">What are you looking for in your next role?</p>
                      </div>
                      
                      <div class="row g-3">
                        <!-- Target Roles -->
                        <div class="col-12">
                          <label class="form-label fw-semibold">
                            Target Roles <span class="text-danger">*</span>
                          </label>
                          <div class="input-group mb-2">
                            <input 
                              type="text" 
                              class="form-control" 
                              bind:value={tempInput}
                              placeholder="e.g., Software Engineer, Product Manager"
                              on:keypress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('target_roles'))}
                            />
                            <button 
                              class="btn btn-primary" 
                              type="button"
                              on:click={() => addToArray('target_roles')}
                            >
                              <i class="bx bx-plus"></i> Add
                            </button>
                          </div>
                          <div class="d-flex flex-wrap gap-2 mb-3">
                            {#each formData.target_roles as role, i}
                              <span class="badge bg-primary-subtle text-primary border border-primary px-3 py-2">
                                {role}
                                <button 
                                  type="button"
                                  class="btn-close btn-close-sm ms-2"
                                  on:click={() => removeFromArray('target_roles', i)}
                                ></button>
                              </span>
                            {/each}
                          </div>
                          {#if formData.target_roles.length === 0}
                            <div class="alert alert-info small">
                              <i class="bx bx-info-circle"></i> Add at least one target role
                            </div>
                          {/if}
                        </div>
                        
                        <!-- Target Industries -->
                        <div class="col-12">
                          <label class="form-label fw-semibold">
                            Target Industries
                          </label>
                          <div class="input-group mb-2">
                            <input 
                              type="text" 
                              class="form-control" 
                              bind:value={tempInput}
                              placeholder="e.g., Technology, Healthcare, Finance"
                              on:keypress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('target_industries'))}
                            />
                            <button 
                              class="btn btn-primary" 
                              type="button"
                              on:click={() => addToArray('target_industries')}
                            >
                              <i class="bx bx-plus"></i> Add
                            </button>
                          </div>
                          <div class="d-flex flex-wrap gap-2">
                            {#each formData.target_industries as industry, i}
                              <span class="badge bg-info-subtle text-info border border-info px-3 py-2">
                                {industry}
                                <button 
                                  type="button"
                                  class="btn-close btn-close-sm ms-2"
                                  on:click={() => removeFromArray('target_industries', i)}
                                ></button>
                              </span>
                            {/each}
                          </div>
                        </div>
                        
                        <!-- Target Skills -->
                        <div class="col-12">
                          <label class="form-label fw-semibold">
                            Key Skills
                          </label>
                          <div class="input-group mb-2">
                            <input 
                              type="text" 
                              class="form-control" 
                              bind:value={tempInput}
                              placeholder="e.g., JavaScript, Project Management, Design"
                              on:keypress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('target_skills'))}
                            />
                            <button 
                              class="btn btn-primary" 
                              type="button"
                              on:click={() => addToArray('target_skills')}
                            >
                              <i class="bx bx-plus"></i> Add
                            </button>
                          </div>
                          <div class="d-flex flex-wrap gap-2">
                            {#each formData.target_skills as skill, i}
                              <span class="badge bg-success-subtle text-success border border-success px-3 py-2">
                                {skill}
                                <button 
                                  type="button"
                                  class="btn-close btn-close-sm ms-2"
                                  on:click={() => removeFromArray('target_skills', i)}
                                ></button>
                              </span>
                            {/each}
                          </div>
                        </div>
                        
                        <div class="col-12"><hr></div>
                        
                        <!-- Remote Preference -->
                        <div class="col-md-6">
                          <label for="remote_preference" class="form-label fw-semibold">
                            Work Location Preference <span class="text-danger">*</span>
                          </label>
                          <select 
                            id="remote_preference" 
                            class="form-select" 
                            bind:value={formData.remote_preference}
                            required
                          >
                            <option value="">Select Preference</option>
                            <option value="remote">Remote Only</option>
                            <option value="hybrid">Hybrid (2-3 days office)</option>
                            <option value="onsite">On-site</option>
                            <option value="flexible">Flexible/Open to All</option>
                          </select>
                        </div>
                        
                        <div class="col-12"><hr></div>
                        
                        <!-- Salary Expectations -->
                        <div class="col-12">
                          <h6 class="fw-semibold text-secondary mb-3">
                            <i class="bx bx-dollar-circle me-2"></i>Salary Expectations
                          </h6>
                        </div>
                        
                        <div class="col-md-6">
                          <label for="salary_min" class="form-label fw-semibold">
                            Minimum Salary
                          </label>
                          <input 
                            type="number" 
                            id="salary_min" 
                            class="form-control" 
                            bind:value={formData.salary_min}
                            placeholder="50000"
                            min="0"
                          />
                        </div>
                        
                        <div class="col-md-6">
                          <label for="salary_max" class="form-label fw-semibold">
                            Maximum Salary
                          </label>
                          <input 
                            type="number" 
                            id="salary_max" 
                            class="form-control" 
                            bind:value={formData.salary_max}
                            placeholder="80000"
                            min="0"
                          />
                        </div>
                        
                        <div class="col-md-6">
                          <label for="salary_currency" class="form-label fw-semibold">
                            Currency
                          </label>
                          <select 
                            id="salary_currency" 
                            class="form-select" 
                            bind:value={formData.salary_currency}
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="CAD">CAD (C$)</option>
                            <option value="KES">KES (KSh)</option>
                            <option value="NGN">NGN (₦)</option>
                            <option value="ZAR">ZAR (R)</option>
                          </select>
                        </div>
                        
                        <div class="col-md-6">
                          <label for="salary_frequency" class="form-label fw-semibold">
                            Frequency
                          </label>
                          <select 
                            id="salary_frequency" 
                            class="form-select" 
                            bind:value={formData.salary_frequency}
                          >
                            <option value="hourly">Hourly</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="annually">Annually</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  {/if}
                  
                  <!-- Step 4: Settings -->
                  {#if currentStep === 4}
                    <div class="step-content">
                      <div class="mb-4">
                        <h5 class="fw-bold text-primary mb-1">
                          <i class="bx bx-cog me-2"></i>Account Settings
                        </h5>
                        <p class="text-muted small mb-0">Customize your communication and privacy preferences</p>
                      </div>
                      
                      <div class="row g-3">
                        <!-- Communication Preferences -->
                        <div class="col-12">
                          <h6 class="fw-semibold text-secondary mb-3">
                            <i class="bx bx-envelope me-2"></i>Communication Preferences
                          </h6>
                        </div>
                        
                        <div class="col-md-6">
                          <label for="communication_preference" class="form-label fw-semibold">
                            How often would you like updates?
                          </label>
                          <select 
                            id="communication_preference" 
                            class="form-select" 
                            bind:value={formData.communication_preference}
                          >
                            <option value="">Select Frequency</option>
                            <option value="frequent">Daily Updates</option>
                            <option value="weekly">Weekly Digest</option>
                            <option value="biweekly">Bi-weekly Updates</option>
                            <option value="monthly">Monthly Summary</option>
                          </select>
                          <div class="form-text">
                            <i class="bx bx-info-circle"></i> 
                            Frequency of job alerts and updates
                          </div>
                        </div>
                        
                        <div class="col-md-6">
                          <label for="visibility_level" class="form-label fw-semibold">
                            Profile Visibility
                          </label>
                          <select 
                            id="visibility_level" 
                            class="form-select" 
                            bind:value={formData.visibility_level}
                          >
                            <option value="agents">Agents Only</option>
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                          </select>
                          <div class="form-text">
                            <i class="bx bx-info-circle"></i> 
                            Control who can view your profile
                          </div>
                        </div>
                        
                        <div class="col-12"><hr></div>
                        
                        <!-- Additional Links -->
                        <div class="col-12">
                          <h6 class="fw-semibold text-secondary mb-3">
                            <i class="bx bx-link me-2"></i>Additional Information
                          </h6>
                        </div>
                        
                        <div class="col-md-6">
                          <label for="github_url" class="form-label fw-semibold">
                            <i class="bx bxl-github text-dark"></i> GitHub Profile
                          </label>
                          <input 
                            type="url" 
                            id="github_url" 
                            class="form-control" 
                            bind:value={formData.github_url}
                            placeholder="https://github.com/johndoe"
                          />
                        </div>
                        
                        <div class="col-12">
                          <label for="notes" class="form-label fw-semibold">
                            Additional Notes
                          </label>
                          <textarea 
                            id="notes" 
                            class="form-control" 
                            rows="3"
                            bind:value={formData.notes}
                            placeholder="Any additional information you'd like to share with potential employers..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  {/if}
                  
                  <!-- Step 5: Review & Complete -->
                  {#if currentStep === 5}
                    <div class="step-content">
                      <div class="text-center mb-4">
                        <div class="avatar-md mx-auto mb-3">
                          <div class="avatar-title bg-success bg-opacity-10 text-success rounded-circle">
                            <i class="bx bx-check-circle fs-1"></i>
                          </div>
                        </div>
                        <h5 class="fw-bold text-primary mb-1">
                          Review & Complete Your Profile
                        </h5>
                        <p class="text-muted small mb-0">
                          Please review your information and accept our terms to complete registration
                        </p>
                      </div>
                      
                      <!-- Profile Summary -->
                      <div class="card bg-light border-0 mb-4">
                        <div class="card-body">
                          <h6 class="fw-bold mb-3">
                            <i class="bx bx-user-circle me-2"></i>Profile Summary
                          </h6>
                          <div class="row g-2 small">
                            <div class="col-md-6">
                              <strong>Name:</strong> {formData.first_name} {formData.last_name}
                            </div>
                            <div class="col-md-6">
                              <strong>Email:</strong> {formData.email}
                            </div>
                            <div class="col-md-6">
                              <strong>Career Stage:</strong> 
                              {formData.career_stage ? formData.career_stage.charAt(0).toUpperCase() + formData.career_stage.slice(1) : 'Not set'}
                            </div>
                            <div class="col-md-6">
                              <strong>Remote Preference:</strong> 
                              {formData.remote_preference ? formData.remote_preference.charAt(0).toUpperCase() + formData.remote_preference.slice(1) : 'Not set'}
                            </div>
                            <div class="col-12">
                              <strong>Target Roles:</strong> 
                              {formData.target_roles.length > 0 ? formData.target_roles.join(', ') : 'None added'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Consents -->
                      <div class="card border border-warning bg-warning bg-opacity-10 mb-3">
                        <div class="card-body">
                          <h6 class="fw-bold text-warning mb-3">
                            <i class="bx bx-shield-quarter me-2"></i>Required Consents
                          </h6>
                          
                          <div class="form-check mb-3 p-3 bg-white rounded border">
                            <input 
                              type="checkbox" 
                              class="form-check-input" 
                              id="terms_conditions"
                              bind:checked={consents.terms_and_conditions}
                            />
                            <label class="form-check-label" for="terms_conditions">
                              <strong>Terms and Conditions</strong>
                              <small class="d-block text-muted mt-1">
                                I have read and agree to the <a href="/terms" target="_blank" class="text-primary">Terms and Conditions</a>
                              </small>
                            </label>
                          </div>
                          
                          <div class="form-check mb-3 p-3 bg-white rounded border">
                            <input 
                              type="checkbox" 
                              class="form-check-input" 
                              id="privacy_policy"
                              bind:checked={consents.privacy_policy}
                            />
                            <label class="form-check-label" for="privacy_policy">
                              <strong>Privacy Policy</strong>
                              <small class="d-block text-muted mt-1">
                                I acknowledge and accept the <a href="/privacy" target="_blank" class="text-primary">Privacy Policy</a>
                              </small>
                            </label>
                          </div>
                          
                          <div class="form-check mb-0 p-3 bg-white rounded border">
                            <input 
                              type="checkbox" 
                              class="form-check-input" 
                              id="data_processing"
                              bind:checked={consents.data_processing}
                            />
                            <label class="form-check-label" for="data_processing">
                              <strong>Data Processing</strong>
                              <small class="d-block text-muted mt-1">
                                I consent to the processing of my personal data for job matching purposes
                              </small>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Optional Preferences -->
                      <div class="card border-0 bg-light">
                        <div class="card-body">
                          <h6 class="fw-bold text-secondary mb-3">
                            <i class="bx bx-bell me-2"></i>Optional Preferences
                          </h6>
                          
                          <div class="form-check mb-3 p-3 bg-white rounded">
                            <input 
                              type="checkbox" 
                              class="form-check-input" 
                              id="job_alerts"
                              bind:checked={consents.job_alerts}
                            />
                            <label class="form-check-label" for="job_alerts">
                              <strong>Job Alerts & Updates</strong>
                              <small class="d-block text-muted mt-1">
                                Receive notifications about relevant job opportunities
                              </small>
                            </label>
                          </div>
                          
                          <div class="form-check mb-0 p-3 bg-white rounded">
                            <input 
                              type="checkbox" 
                              class="form-check-input" 
                              id="profile_search"
                              bind:checked={consents.profile_search}
                            />
                            <label class="form-check-label" for="profile_search">
                              <strong>Recruiter Search</strong>
                              <small class="d-block text-muted mt-1">
                                Allow verified recruiters to find and contact you
                              </small>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  {/if}
                  
                  <!-- Navigation Buttons -->
                  <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                    <div>
                      {#if currentStep > 1}
                        <button 
                          type="button"
                          class="btn btn-outline-secondary"
                          on:click={prevStep}
                          disabled={loading}
                        >
                          <i class="bx bx-chevron-left"></i>
                          Previous
                        </button>
                      {/if}
                    </div>
                    
                    <div class="d-flex gap-2">
                      {#if currentStep < totalSteps}
                        <button 
                          type="button"
                          class="btn btn-primary"
                          on:click={nextStep}
                          disabled={loading}
                        >
                          {#if loading}
                            <span class="spinner-border spinner-border-sm me-2"></span>
                            Saving...
                          {:else}
                            Next Step
                            <i class="bx bx-chevron-right"></i>
                          {/if}
                        </button>
                      {:else}
                        <button 
                          type="button"
                          class="btn btn-success px-4"
                          on:click={completeOnboarding}
                          disabled={loading || !consents.terms_and_conditions || !consents.privacy_policy || !consents.data_processing}
                        >
                          {#if loading}
                            <span class="spinner-border spinner-border-sm me-2"></span>
                            Completing...
                          {:else}
                            <i class="bx bx-check-circle me-2"></i>
                            Complete Registration
                          {/if}
                        </button>
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <style>
    :global(body) {
      background-color: #f5f6fa;
    }
    
    .card {
      box-shadow: 0 0 35px rgba(154, 161, 171, 0.15);
      border: none;
      border-radius: 0.75rem;
      overflow: hidden;
    }
    
    .card-header {
      background: #6BB4C9;
      border-bottom: none;
    }
    
    .nav-pills .nav-link {
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    
    .nav-pills .nav-link:hover:not(.active):not(:disabled) {
      background-color: #f8f9fa;
      border-color: #e9ecef;
    }
    
    .nav-pills .nav-link.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .nav-pills .nav-link:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .form-label {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    
    .form-control, .form-select {
      border-radius: 0.5rem;
      border: 1px solid #e2e8f0;
      padding: 0.625rem 0.875rem;
      font-size: 0.9375rem;
      transition: all 0.2s;
    }
    
    .form-control:focus, .form-select:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
    }
    
    .badge {
      font-weight: 500;
      font-size: 0.875rem;
    }
    
    .btn-close-sm {
      font-size: 0.7rem;
      opacity: 0.7;
    }
    
    .btn-close-sm:hover {
      opacity: 1;
    }
    
    .alert {
      border-radius: 0.5rem;
      border: none;
    }
    
    .avatar-md {
      width: 4rem;
      height: 4rem;
    }
    
    .avatar-title {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .progress {
      border-radius: 0.25rem;
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .step-content {
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
    
    @media (max-width: 991px) {
      .nav-pills {
        flex-direction: row !important;
        overflow-x: auto;
        white-space: nowrap;
      }
      
      .nav-pills .nav-link {
        flex: 0 0 auto;
      }
      
      .nav-pills .nav-link span {
        display: inline !important;
      }
    }
  </style>