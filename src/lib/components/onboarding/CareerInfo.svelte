<script lang="ts">
    import { supabase } from '../../supabaseClient';
    import { onMount, createEventDispatcher } from 'svelte';
  
    export let session;
  
    const dispatch = createEventDispatcher();
  
    let career = {
      career_stage: '',
      employment_status: '',
      current_title: ''
    };
  
    let candidateId = null;
    let loading = false;
    let initializing = true;
    let message = '';
    let messageType: 'success' | 'error' = 'success';
    let existingData = false;
  
    const stages = [
      { value: 'entry', label: 'Entry Level' },
      { value: 'mid', label: 'Mid Level' },
      { value: 'senior', label: 'Senior Level' },
      { value: 'executive', label: 'Executive' }
    ];
  
    const statuses = [
      { value: 'employed', label: 'Employed' },
      { value: 'unemployed', label: 'Unemployed' },
      { value: 'freelance', label: 'Freelance' },
      { value: 'self-employed', label: 'Self-Employed' },
      { value: 'student', label: 'Student' }
    ];
  
    onMount(async () => {
      await loadCareerInfo();
    });
  
    async function loadCareerInfo() {
      if (!session?.user?.id) {
        initializing = false;
        return;
      }
  
      try {
        const { data, error } = await supabase
          .from('candidates')
          .select('id, career_stage, employment_status, current_title')
          .eq('user_id', session.user.id)
          .single();
  
        if (error && error.code !== 'PGRST116') throw error;
  
        if (data) {
          existingData = true;
          candidateId = data.id;
          career = {
            career_stage: data.career_stage || '',
            employment_status: data.employment_status || '',
            current_title: data.current_title || ''
          };
        }
      } catch (err) {
        console.error('Error loading career info:', err);
        message = 'Error loading your career information.';
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
          .upsert(
            {
              candidate_id: candidateId,
              step_name: 'step2_career_info',
              status: 'completed',
              completed_at: new Date().toISOString()
            },
            { onConflict: 'candidate_id,step_name' }
          );
  
        if (error) throw error;
      } catch (err) {
        console.error('Failed to update onboarding step:', err);
      }
    }
  
    async function save() {
  loading = true;
  message = '';

  try {
    if (!career.career_stage || !career.employment_status) {
      throw new Error('Please select your career stage and employment status.');
    }

    // 🔍 Check if candidate exists first
    const { data: existingCandidate, error: fetchError } = await supabase
      .from('candidates')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (!existingCandidate) {
      throw new Error('Candidate profile not found. Please complete the previous step first.');
    }

    // ✅ Update existing candidate only
    const { error: updateError } = await supabase
      .from('candidates')
      .update({
        career_stage: career.career_stage,
        employment_status: career.employment_status,
        current_title: career.current_title
      })
      .eq('id', existingCandidate.id);

    if (updateError) throw updateError;

    candidateId = existingCandidate.id;
    await updateOnboardingStep();

    message = 'Career information updated successfully!';
    messageType = 'success';
    existingData = true;

    setTimeout(() => {
      dispatch('stepComplete', {
        stepName: 'step2_career_info',
        candidateId
      });
    }, 1000);
  } catch (err) {
    messageType = 'error';
    message = err.message || 'An error occurred while saving.';
    console.error('Save error:', err);
  } finally {
    loading = false;
  }
}

  </script>
  
  <div class="container-xxl">
    <div class="row justify-content-center text-center mt-4">
      <div class="col-lg-8">
        <div class="mb-3">
          <!-- <span class="badge bg-primary-subtle text-primary px-3 py-2">Step 2 of 4</span> -->
        </div>
        <h3 class="fw-semibold mb-3">Tell Us About Your Career</h3>
        <p class="text-muted">
          Understanding your career stage and current situation helps us match you 
          with the right opportunities and support.
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
                        <div class="mb-3">
                          <label class="form-label fw-semibold" for="career-stage">
                            Career Stage <span class="text-danger">*</span>
                          </label>
                          <select
                            id="career-stage"
                            class="form-select"
                            bind:value={career.career_stage}
                            disabled={loading}
                            required
                          >
                            <option value="">Select your career stage</option>
                            {#each stages as s}
                              <option value={s.value}>{s.label}</option>
                            {/each}
                          </select>
                          <small class="form-text text-muted">
                            Choose the level that best describes your experience.
                          </small>
                        </div>
  
                        <div class="mb-3">
                          <label class="form-label fw-semibold" for="employment-status">
                            Employment Status <span class="text-danger">*</span>
                          </label>
                          <select
                            id="employment-status"
                            class="form-select"
                            bind:value={career.employment_status}
                            disabled={loading}
                            required
                          >
                            <option value="">Select your current status</option>
                            {#each statuses as s}
                              <option value={s.value}>{s.label}</option>
                            {/each}
                          </select>
                          <small class="form-text text-muted">
                            Let us know your current employment situation.
                          </small>
                        </div>
  
                        <div class="mb-4">
                          <label class="form-label fw-semibold" for="current-title">
                            Current Job Title
                          </label>
                          <input
                            type="text"
                            id="current-title"
                            class="form-control"
                            placeholder="e.g., Software Engineer"
                            bind:value={career.current_title}
                            disabled={loading}
                          />
                          <small class="form-text text-muted">
                            This helps us tailor your experience to your role.
                          </small>
                        </div>
  
                        <div class="d-grid">
                          <button class="btn btn-primary btn-lg" type="submit" disabled={loading}>
                            {#if loading}
                              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              {existingData ? 'Updating...' : 'Saving...'}
                            {:else}
                              {existingData ? 'Update & Continue' : 'Continue'}
                            {/if}
                          </button>
                        </div>
  
                        {#if message}
                          <div
                            class="alert alert-{messageType === 'success' ? 'success' : 'danger'} mt-3 d-flex align-items-center"
                            role="alert"
                          >
                            {#if messageType === 'success'}
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                              </svg>
                            {:else}
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-exclamation-triangle-fill me-2" viewBox="0 0 16 16">
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
  </style>
  