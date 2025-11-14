<script lang="ts">
  import { supabase } from '../../supabaseClient';
  import { onMount, createEventDispatcher } from 'svelte';
  
  export let session;

  const dispatch = createEventDispatcher();

  let candidate = {
    first_name: '',
    last_name: '',
    phone: '',
    country: ''
  };

  let candidateId = null;
  let loading = false;
  let initializing = true;
  let message = '';
  let messageType: 'success' | 'error' = 'success';
  let existingCandidate = false;

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'PL', name: 'Poland' },
    { code: 'IE', name: 'Ireland' },
    { code: 'BE', name: 'Belgium' },
    { code: 'AT', name: 'Austria' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'GR', name: 'Greece' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'RO', name: 'Romania' },
    { code: 'HU', name: 'Hungary' },
    { code: 'IN', name: 'India' },
    { code: 'CN', name: 'China' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'SG', name: 'Singapore' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'TH', name: 'Thailand' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'PH', name: 'Philippines' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'AR', name: 'Argentina' },
    { code: 'CL', name: 'Chile' },
    { code: 'CO', name: 'Colombia' },
    { code: 'PE', name: 'Peru' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'KE', name: 'Kenya' },
    { code: 'EG', name: 'Egypt' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'IL', name: 'Israel' },
    { code: 'TR', name: 'Turkey' },
    { code: 'NZ', name: 'New Zealand' }
  ].sort((a, b) => a.name.localeCompare(b.name));

  onMount(async () => {
    await loadCandidate();
  });

  async function loadCandidate() {
    if (!session?.user?.id) {
      initializing = false;
      return;
    }

    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        existingCandidate = true;
        candidateId = data.id;
        const nameParts = (data.full_name || '').trim().split(' ');
        candidate = {
          first_name: nameParts[0] || '',
          last_name: nameParts.slice(1).join(' ') || '',
          phone: data.phone || '',
          country: data.country || ''
        };
      }
    } catch (err) {
      console.error('Error loading candidate:', err);
      message = 'Error loading existing data';
      messageType = 'error';
    } finally {
      initializing = false;
    }
  }

  async function updateOnboardingStep() {
    if (!candidateId) return;

    try {
      const { error } = await supabase
        .from('candidate_onboarding_steps')
        .upsert({
          candidate_id: candidateId,
          step_name: 'step1_basic_info',
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
      if (!candidate.first_name.trim() || !candidate.last_name.trim()) {
        throw new Error('Please fill in all required fields');
      }

      if (!candidate.phone.trim()) {
        throw new Error('Phone number is required');
      }

      if (!candidate.country) {
        throw new Error('Please select your country');
      }

      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(candidate.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      const candidateData = {
        user_id: session?.user?.id,
        full_name: `${candidate.first_name.trim()} ${candidate.last_name.trim()}`,
        phone: candidate.phone.trim(),
        country: candidate.country
      };

      const { data, error } = await supabase
        .from('candidates')
        .upsert(candidateData, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        candidateId = data.id;
        await updateOnboardingStep();
      }

      message = existingCandidate 
        ? 'Your information has been updated successfully!' 
        : 'Welcome! Your basic information has been saved.';
      messageType = 'success';
      existingCandidate = true;

      // Dispatch event to parent component to move to next step
      setTimeout(() => {
        dispatch('stepComplete', {
          stepName: 'step1_basic_info',
          candidateId: candidateId
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
</script>

<div class="container-xxl">
  <div class="row justify-content-center text-center mt-4">
    <div class="col-lg-8">
      <div class="mb-3">
        <!-- <span class="badge bg-primary-subtle text-primary px-3 py-2">Step 1 of 4</span> -->
      </div>
      <h3 class="fw-semibold mb-3">Welcome! Let's Get Started</h3>
      <p class="text-muted">
        We're excited to have you here! Please provide your basic information so we can 
        personalize your experience and keep in touch with you throughout your journey.
      </p>
    </div>
  </div>

  <div class="row justify-content-center mt-4">
    <div class="col-xxl-10">
      <div class="card">
        <div class="card-body">
          <div class="row justify-content-center">
            <div class="col-xxl-7">
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
                      <div class="row mb-3">
                        <div class="col-lg-6 mb-3">
                          <label class="form-label fw-semibold" for="first-name">
                            First Name <span class="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="first-name"
                            class="form-control"
                            placeholder="Enter your first name"
                            bind:value={candidate.first_name}
                            disabled={loading}
                            required
                          />
                          <small class="form-text text-muted">Your given name as it appears on official documents</small>
                        </div>
                        <div class="col-lg-6 mb-3">
                          <label class="form-label fw-semibold" for="last-name">
                            Last Name <span class="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="last-name"
                            class="form-control"
                            placeholder="Enter your last name"
                            bind:value={candidate.last_name}
                            disabled={loading}
                            required
                          />
                          <small class="form-text text-muted">Your family name or surname</small>
                        </div>
                      </div>

                      <div class="mb-3">
                        <label class="form-label fw-semibold" for="phone">
                          Phone Number <span class="text-danger">*</span>
                        </label>
                        <div class="input-group">
                          <span class="input-group-text">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                            </svg>
                          </span>
                          <input
                            type="tel"
                            id="phone"
                            class="form-control"
                            placeholder="e.g., +1 (555) 123-4567"
                            bind:value={candidate.phone}
                            disabled={loading}
                            required
                          />
                        </div>
                        <small class="form-text text-muted">Include country code for international numbers</small>
                      </div>

                      <div class="mb-4">
                        <label class="form-label fw-semibold" for="country">
                          Country <span class="text-danger">*</span>
                        </label>
                        <select
                          id="country"
                          class="form-select"
                          bind:value={candidate.country}
                          disabled={loading}
                          required
                        >
                          <option value="">Select your country</option>
                          {#each countries as country}
                            <option value={country.code}>{country.name}</option>
                          {/each}
                        </select>
                        <small class="form-text text-muted">Your current country of residence</small>
                      </div>

                      <div class="d-grid">
                        <button class="btn btn-primary btn-lg" type="submit" disabled={loading}>
                          {#if loading}
                            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {existingCandidate ? 'Updating...' : 'Saving...'}
                          {:else}
                            {existingCandidate ? 'Update & Continue' : 'Continue'}
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
  .input-group-text {
    background-color: #f8f9fa;
    border-right: none;
  }
  
  .input-group .form-control {
    border-left: none;
  }
  
  .input-group:focus-within .input-group-text {
    border-color: #86b7fe;
  }
  
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
</style>