<script lang="ts">
    import { supabase } from '../../supabaseClient';
    import { onMount, createEventDispatcher } from 'svelte';
    
    export let session;
   
  
    const dispatch = createEventDispatcher();
  
    let preferences = {
      career_stage: '',
      employment_status: '',
      current_title: '',
      target_roles: [],
      target_industries: [],
      remote_preference: '',
      salary_min: '',
      salary_max: '',
      salary_currency: 'USD',
      salary_frequency: 'annually',
      communication_preference: ''
    };

    let candidateId = null;
  
    let newRole = '';
    let newIndustry = '';
    let loading = false;
    let initializing = true;
    let message = '';
    let messageType: 'success' | 'error' = 'success';
    let existingData = false;
  
    const careerStages = [
      { value: 'entry', label: 'Entry Level', description: '0-2 years of experience' },
      { value: 'mid', label: 'Mid-Level', description: '3-5 years of experience' },
      { value: 'senior', label: 'Senior Level', description: '6-10 years of experience' },
      { value: 'executive', label: 'Executive', description: '10+ years of experience' }
    ];
  
    const employmentStatuses = [
      { value: 'employed', label: 'Employed', icon: '💼' },
      { value: 'unemployed', label: 'Actively Seeking', icon: '🔍' },
      { value: 'freelance', label: 'Freelance', icon: '💻' },
      { value: 'self-employed', label: 'Self-Employed', icon: '🚀' },
      { value: 'student', label: 'Student', icon: '🎓' }
    ];
  
    const remotePreferences = [
      { value: 'remote', label: 'Fully Remote', description: 'Work from anywhere' },
      { value: 'hybrid', label: 'Hybrid', description: 'Mix of remote and office' },
      { value: 'onsite', label: 'On-site', description: 'Office-based work' },
      { value: 'flexible', label: 'Flexible', description: 'Open to all options' }
    ];
  
    const currencies = [
      { code: 'USD', symbol: '$', name: 'US Dollar' },
      { code: 'EUR', symbol: '€', name: 'Euro' },
      { code: 'GBP', symbol: '£', name: 'British Pound' },
      { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
      { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
      { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
      { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
      { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
      { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
      { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' }
    ];
  
    const salaryFrequencies = [
      { value: 'hourly', label: 'Per Hour' },
      { value: 'weekly', label: 'Per Week' },
      { value: 'monthly', label: 'Per Month' },
      { value: 'annually', label: 'Per Year' }
    ];
  
    const communicationPreferences = [
      { value: 'frequent', label: 'Frequent Updates', description: 'Multiple times per week' },
      { value: 'weekly', label: 'Weekly', description: 'Once per week' },
      { value: 'biweekly', label: 'Bi-weekly', description: 'Every two weeks' },
      { value: 'monthly', label: 'Monthly', description: 'Once per month' }
    ];
  
    const popularRoles = [
      'Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer',
      'Marketing Manager', 'Sales Representative', 'Business Analyst', 'DevOps Engineer'
    ];
  
    const popularIndustries = [
      'Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce',
      'Manufacturing', 'Consulting', 'Media & Entertainment', 'Retail', 'Real Estate'
    ];
  
    onMount(async () => {
      await loadPreferences();
    });
  
    async function loadPreferences() {
      if (!session?.user?.id) {
        initializing = false;
        return;
      }
  
      try {
        const { data, error } = await supabase
          .from('candidates')
          .select('id,career_stage, employment_status, current_title, target_roles, target_industries, remote_preference, salary_min, salary_max, salary_currency, salary_frequency, communication_preference')
          .eq('user_id', session.user.id)
          .single();
  
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
  
        if (data) {
          existingData = true;
          preferences = {
            career_stage: data.career_stage || '',
            employment_status: data.employment_status || '',
            current_title: data.current_title || '',
            target_roles: data.target_roles || [],
            target_industries: data.target_industries || [],
            remote_preference: data.remote_preference || '',
            salary_min: data.salary_min || '',
            salary_max: data.salary_max || '',
            salary_currency: data.salary_currency || 'USD',
            salary_frequency: data.salary_frequency || 'annually',
            communication_preference: data.communication_preference || ''
          };
          candidateId = data.id;
        }
      } catch (err) {
        console.error('Error loading preferences:', err);
        message = 'Error loading existing data';
        messageType = 'error';
      } finally {
        initializing = false;
      }
    }
  
    function addRole() {
      if (newRole.trim() && !preferences.target_roles.includes(newRole.trim())) {
        preferences.target_roles = [...preferences.target_roles, newRole.trim()];
        newRole = '';
      }
    }
  
    function removeRole(role: string) {
      preferences.target_roles = preferences.target_roles.filter(r => r !== role);
    }
  
    function addPopularRole(role: string) {
      if (!preferences.target_roles.includes(role)) {
        preferences.target_roles = [...preferences.target_roles, role];
      }
    }
  
    function addIndustry() {
      if (newIndustry.trim() && !preferences.target_industries.includes(newIndustry.trim())) {
        preferences.target_industries = [...preferences.target_industries, newIndustry.trim()];
        newIndustry = '';
      }
    }
  
    function removeIndustry(industry: string) {
      preferences.target_industries = preferences.target_industries.filter(i => i !== industry);
    }
  
    function addPopularIndustry(industry: string) {
      if (!preferences.target_industries.includes(industry)) {
        preferences.target_industries = [...preferences.target_industries, industry];
      }
    }
  
    async function updateOnboardingStep() {
      if (!candidateId) return;
  
      try {
        const { error } = await supabase
          .from('candidate_onboarding_steps')
          .upsert({
            candidate_id: candidateId,
            step_name: 'step_preference',
            status: 'completed',
            completed_at: new Date().toISOString()
          }, {
            onConflict: 'candidate_id,step_name'
          });
  
        if (error) {
          console.error('Error updating onboarding step:', error);
          throw error;
        }
      } catch (err) {
        console.error('Onboarding step update failed:', err);
        throw err;
      }
    }
  
    async function save() {
      loading = true;
      message = '';
      
      try {
        if (!preferences.career_stage) {
          throw new Error('Please select your career stage');
        }
  
        if (!preferences.employment_status) {
          throw new Error('Please select your employment status');
        }
  
        if (!preferences.remote_preference) {
          throw new Error('Please select your remote work preference');
        }
  
        if (preferences.salary_min && preferences.salary_max) {
          if (parseInt(preferences.salary_min) > parseInt(preferences.salary_max)) {
            throw new Error('Minimum salary cannot be greater than maximum salary');
          }
        }
  
        const updateData = {
          career_stage: preferences.career_stage,
          employment_status: preferences.employment_status,
          current_title: preferences.current_title.trim() || null,
          target_roles: preferences.target_roles,
          target_industries: preferences.target_industries,
          remote_preference: preferences.remote_preference,
          salary_min: preferences.salary_min ? parseInt(preferences.salary_min) : null,
          salary_max: preferences.salary_max ? parseInt(preferences.salary_max) : null,
          salary_currency: preferences.salary_currency,
          salary_frequency: preferences.salary_frequency,
          communication_preference: preferences.communication_preference || null
        };
  
        const { error } = await supabase
          .from('candidates')
          .update(updateData)
          .eq('user_id', session.user.id);
  
        if (error) throw error;
  
        await updateOnboardingStep();
  
        message = 'Your job preferences have been saved successfully!';
        messageType = 'success';
  
        setTimeout(() => {
          dispatch('stepComplete', {
            stepName: 'step_preference'
          });
        }, 1000);
  
      } catch (err) {
        messageType = 'error';
        message = err.message || 'An error occurred. Please try again.';
        console.error('Form submission error:', err);
      } finally {
        loading = false;
      }
    }
  
    function goBack() {
      dispatch('goBack');
    }
  </script>
  
  <div class="container-xxl">
    <div class="row justify-content-center text-center mt-4">
      <div class="col-lg-8">
        <div class="mb-3">
          <span class="badge bg-primary-subtle text-primary px-3 py-2">Step 2 of 4</span>
        </div>
        <h3 class="fw-semibold mb-3">Job Preferences</h3>
        <p class="text-muted">
          Help us understand what you're looking for in your next opportunity. This information 
          will help us match you with the most relevant positions.
        </p>
      </div>
    </div>
  
    <div class="row justify-content-center mt-4">
      <div class="col-xxl-10">
        <div class="card">
          <div class="card-body">
            <div class="row justify-content-center">
              <div class="col-xxl-9">
                <div class="card mb-0 shadow-none border-0">
                  <div class="card-body px-4">
                    {#if initializing}
                      <div class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-3 text-muted">Loading your information...</p>
                      </div>
                    {:else}
                      <form on:submit|preventDefault={save} class="authentication-form">
                        
                        <!-- Career Stage -->
                        <div class="mb-4">
                          <label class="form-label fw-semibold">
                            Career Stage <span class="text-danger">*</span>
                          </label>
                          <div class="row g-3">
                            {#each careerStages as stage}
                              <div class="col-md-6">
                                <div class="form-check card-radio">
                                  <input
                                    type="radio"
                                    id="stage-{stage.value}"
                                    name="career_stage"
                                    class="form-check-input"
                                    value={stage.value}
                                    bind:group={preferences.career_stage}
                                    disabled={loading}
                                  />
                                  <label class="form-check-label" for="stage-{stage.value}">
                                    <div class="fw-semibold">{stage.label}</div>
                                    <small class="text-muted">{stage.description}</small>
                                  </label>
                                </div>
                              </div>
                            {/each}
                          </div>
                        </div>
  
                        <!-- Employment Status -->
                        <div class="mb-4">
                          <label class="form-label fw-semibold">
                            Current Employment Status <span class="text-danger">*</span>
                          </label>
                          <div class="row g-3">
                            {#each employmentStatuses as status}
                              <div class="col-md-4">
                                <div class="form-check card-radio text-center">
                                  <input
                                    type="radio"
                                    id="status-{status.value}"
                                    name="employment_status"
                                    class="form-check-input"
                                    value={status.value}
                                    bind:group={preferences.employment_status}
                                    disabled={loading}
                                  />
                                  <label class="form-check-label" for="status-{status.value}">
                                    <div class="fs-3 mb-1">{status.icon}</div>
                                    <div class="fw-semibold">{status.label}</div>
                                  </label>
                                </div>
                              </div>
                            {/each}
                          </div>
                        </div>
  
                        <!-- Current Title -->
                        <div class="mb-4">
                          <label class="form-label fw-semibold" for="current-title">
                            Current or Most Recent Job Title
                          </label>
                          <input
                            type="text"
                            id="current-title"
                            class="form-control"
                            placeholder="e.g., Senior Software Engineer"
                            bind:value={preferences.current_title}
                            disabled={loading}
                          />
                          <small class="form-text text-muted">This helps us understand your experience level</small>
                        </div>
  
                        <!-- Target Roles -->
                        <div class="mb-4">
                          <label class="form-label fw-semibold">
                            Target Roles
                          </label>
                          <div class="input-group mb-2">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Add a role you're interested in"
                              bind:value={newRole}
                              on:keypress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                              disabled={loading}
                            />
                            <button
                              class="btn btn-outline-primary"
                              type="button"
                              on:click={addRole}
                              disabled={loading || !newRole.trim()}
                            >
                              Add
                            </button>
                          </div>
                          
                          {#if preferences.target_roles.length > 0}
                            <div class="mb-3">
                              {#each preferences.target_roles as role}
                                <span class="badge bg-primary-subtle text-primary me-2 mb-2 p-2">
                                  {role}
                                  <button
                                    type="button"
                                    class="btn-close btn-close-sm ms-2"
                                    style="font-size: 0.6rem; vertical-align: middle;"
                                    on:click={() => removeRole(role)}
                                    disabled={loading}
                                  ></button>
                                </span>
                              {/each}
                            </div>
                          {/if}
  
                          <div>
                            <small class="text-muted d-block mb-2">Popular roles:</small>
                            <div class="d-flex flex-wrap gap-2">
                              {#each popularRoles as role}
                                <button
                                  type="button"
                                  class="btn btn-sm btn-outline-secondary"
                                  on:click={() => addPopularRole(role)}
                                  disabled={loading || preferences.target_roles.includes(role)}
                                >
                                  {role}
                                </button>
                              {/each}
                            </div>
                          </div>
                        </div>
  
                        <!-- Target Industries -->
                        <div class="mb-4">
                          <label class="form-label fw-semibold">
                            Target Industries
                          </label>
                          <div class="input-group mb-2">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Add an industry you're interested in"
                              bind:value={newIndustry}
                              on:keypress={(e) => e.key === 'Enter' && (e.preventDefault(), addIndustry())}
                              disabled={loading}
                            />
                            <button
                              class="btn btn-outline-primary"
                              type="button"
                              on:click={addIndustry}
                              disabled={loading || !newIndustry.trim()}
                            >
                              Add
                            </button>
                          </div>
                          
                          {#if preferences.target_industries.length > 0}
                            <div class="mb-3">
                              {#each preferences.target_industries as industry}
                                <span class="badge bg-success-subtle text-success me-2 mb-2 p-2">
                                  {industry}
                                  <button
                                    type="button"
                                    class="btn-close btn-close-sm ms-2"
                                    style="font-size: 0.6rem; vertical-align: middle;"
                                    on:click={() => removeIndustry(industry)}
                                    disabled={loading}
                                  ></button>
                                </span>
                              {/each}
                            </div>
                          {/if}
  
                          <div>
                            <small class="text-muted d-block mb-2">Popular industries:</small>
                            <div class="d-flex flex-wrap gap-2">
                              {#each popularIndustries as industry}
                                <button
                                  type="button"
                                  class="btn btn-sm btn-outline-secondary"
                                  on:click={() => addPopularIndustry(industry)}
                                  disabled={loading || preferences.target_industries.includes(industry)}
                                >
                                  {industry}
                                </button>
                              {/each}
                            </div>
                          </div>
                        </div>
  
                        <!-- Remote Preference -->
                        <div class="mb-4">
                          <label class="form-label fw-semibold">
                            Work Location Preference <span class="text-danger">*</span>
                          </label>
                          <div class="row g-3">
                            {#each remotePreferences as pref}
                              <div class="col-md-6">
                                <div class="form-check card-radio">
                                  <input
                                    type="radio"
                                    id="remote-{pref.value}"
                                    name="remote_preference"
                                    class="form-check-input"
                                    value={pref.value}
                                    bind:group={preferences.remote_preference}
                                    disabled={loading}
                                  />
                                  <label class="form-check-label" for="remote-{pref.value}">
                                    <div class="fw-semibold">{pref.label}</div>
                                    <small class="text-muted">{pref.description}</small>
                                  </label>
                                </div>
                              </div>
                            {/each}
                          </div>
                        </div>
  
                        <!-- Salary Expectations -->
                        <div class="mb-4">
                          <label class="form-label fw-semibold">
                            Salary Expectations
                          </label>
                          <div class="row g-3 mb-3">
                            <div class="col-md-5">
                              <label class="form-label" for="salary-min">Minimum</label>
                              <input
                                type="number"
                                id="salary-min"
                                class="form-control"
                                placeholder="e.g., 50000"
                                bind:value={preferences.salary_min}
                                disabled={loading}
                                min="0"
                              />
                            </div>
                            <div class="col-md-5">
                              <label class="form-label" for="salary-max">Maximum</label>
                              <input
                                type="number"
                                id="salary-max"
                                class="form-control"
                                placeholder="e.g., 80000"
                                bind:value={preferences.salary_max}
                                disabled={loading}
                                min="0"
                              />
                            </div>
                            <div class="col-md-2">
                              <label class="form-label" for="salary-currency">Currency</label>
                              <select
                                id="salary-currency"
                                class="form-select"
                                bind:value={preferences.salary_currency}
                                disabled={loading}
                              >
                                {#each currencies as currency}
                                  <option value={currency.code}>{currency.code}</option>
                                {/each}
                              </select>
                            </div>
                          </div>
                          <div class="row g-3">
                            <div class="col-md-6">
                              <label class="form-label" for="salary-frequency">Frequency</label>
                              <select
                                id="salary-frequency"
                                class="form-select"
                                bind:value={preferences.salary_frequency}
                                disabled={loading}
                              >
                                {#each salaryFrequencies as freq}
                                  <option value={freq.value}>{freq.label}</option>
                                {/each}
                              </select>
                            </div>
                          </div>
                          <small class="form-text text-muted">This information helps us show you relevant opportunities</small>
                        </div>
  
                        <!-- Communication Preference -->
                        <div class="mb-4">
                          <label class="form-label fw-semibold">
                            Communication Preference
                          </label>
                          <div class="row g-3">
                            {#each communicationPreferences as comm}
                              <div class="col-md-6">
                                <div class="form-check card-radio">
                                  <input
                                    type="radio"
                                    id="comm-{comm.value}"
                                    name="communication_preference"
                                    class="form-check-input"
                                    value={comm.value}
                                    bind:group={preferences.communication_preference}
                                    disabled={loading}
                                  />
                                  <label class="form-check-label" for="comm-{comm.value}">
                                    <div class="fw-semibold">{comm.label}</div>
                                    <small class="text-muted">{comm.description}</small>
                                  </label>
                                </div>
                              </div>
                            {/each}
                          </div>
                          <small class="form-text text-muted">How often would you like to hear from us about new opportunities?</small>
                        </div>
  
                        <div class="d-flex gap-2">
                          <button
                            class="btn btn-outline-secondary"
                            type="button"
                            on:click={goBack}
                            disabled={loading}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left me-1" viewBox="0 0 16 16">
                              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                            </svg>
                            Back
                          </button>
                          <button class="btn btn-primary flex-grow-1" type="submit" disabled={loading}>
                            {#if loading}
                              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Saving...
                            {:else}
                              Continue
                            {/if}
                          </button>
                        </div>
  
                        {#if message}
                          <div class="alert alert-{messageType === 'success' ? 'success' : 'danger'} mt-3 d-flex align-items-center" role="alert">
                            {#if messageType === 'success'}
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill me-2 flex-shrink-0" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                              </svg>
                            {:else}
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-exclamation-triangle-fill me-2 flex-shrink-0" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                              </svg>
                            {/if}
                            <div>{message}</div>
                          </div>
                        {/if}
                      </form>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <style>
    .form-label.fw-semibold {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    
    .form-text {
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }
  
    .badge {
      font-size: 0.875rem;
      font-weight: 500;
    }
  
    .card-radio {
      padding: 1rem;
      border: 2px solid #e9ecef;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      height: 100%;
    }
  
    .card-radio:hover {
      border-color: #0d6efd;
      background-color: #f8f9fa;
    }
  
    .card-radio .form-check-input {
      float: none;
      margin: 0;
      position: absolute;
      opacity: 0;
    }
  
    .card-radio .form-check-input:checked ~ .form-check-label {
      color: #0d6efd;
    }
  
    .card-radio .form-check-input:checked ~ .form-check-label::before {
      content: '✓';
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background-color: #0d6efd;
      color: white;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: bold;
    }
  
    .card-radio .form-check-input:checked ~ label {
      border-color: #0d6efd;
    }
  
    .card-radio .form-check-label {
      cursor: pointer;
      width: 100%;
      position: relative;
      padding-right: 2rem;
    }
  
    .btn-close-sm {
      width: 0.5em;
      height: 0.5em;
    }
  </style>