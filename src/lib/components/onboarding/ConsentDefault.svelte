<script lang="ts">
    import { supabase } from '../../supabaseClient';
    import { onMount, createEventDispatcher } from 'svelte';
  
    export let session;
  
    const dispatch = createEventDispatcher();
  
    let consents = {
      terms_and_conditions: false,
      privacy_policy: false,
      data_processing: false,
      marketing_emails: false,
      profile_visibility: false
    };
  
    let candidateId = null;
    let loading = false;
    let initializing = true;
    let message = '';
    let messageType: 'success' | 'error' = 'success';
    let existingData = false;
  
    onMount(async () => {
      await loadConsentInfo();
    });
  
    async function loadConsentInfo() {
      if (!session?.user?.id) {
        initializing = false;
        return;
      }
  
      try {
        // Fetch candidate ID
        const { data: candidate, error: candidateError } = await supabase
          .from('candidates')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
  
        if (candidateError && candidateError.code !== 'PGRST116') throw candidateError;
        if (!candidate) throw new Error('Candidate not found.');
  
        candidateId = candidate.id;
  
        // Load existing consents
        const { data, error } = await supabase
          .from('candidate_consents')
          .select('*')
          .eq('candidate_id', candidateId)
          .single();
  
        if (error && error.code !== 'PGRST116') throw error;
  
        if (data) {
          existingData = true;
          consents = {
            terms_and_conditions: !!data.terms_and_conditions,
            privacy_policy: !!data.privacy_policy,
            data_processing: !!data.data_processing,
            marketing_emails: !!data.marketing_emails,
            profile_visibility: !!data.profile_visibility
          };
        }
      } catch (err) {
        console.error('Error loading consent info:', err);
        message = 'Error loading consent information.';
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
              step_name: 'step4_consents',
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
        // Required consents
        if (!consents.terms_and_conditions || !consents.privacy_policy || !consents.data_processing) {
          throw new Error('You must agree to the Terms, Privacy Policy, and Data Processing.');
        }
  
        if (!candidateId) {
          throw new Error('Candidate not found. Please complete previous steps first.');
        }
  
        const { error } = await supabase.from('candidate_consents').upsert(
          {
            candidate_id: candidateId,
            terms_and_conditions: consents.terms_and_conditions,
            privacy_policy: consents.privacy_policy,
            data_processing: consents.data_processing,
            marketing_emails: consents.marketing_emails,
            profile_visibility: consents.profile_visibility,
            consented_at: new Date().toISOString()
          },
          { onConflict: 'candidate_id' }
        );
  
        if (error) throw error;
  
        await updateOnboardingStep();
  
        message = 'Consents saved successfully!';
        messageType = 'success';
  
        setTimeout(() => {
          dispatch('stepComplete', {
            stepName: 'step4_consents',
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
          <!-- <span class="badge bg-primary-subtle text-primary px-3 py-2">Step 4 of 4</span> -->
        </div>
        <h3 class="fw-semibold mb-3">Consent and Data Preferences</h3>
        <p class="text-muted">
          Please review and confirm your consent preferences. These help us comply with data protection regulations and respect your choices.
        </p>
      </div>
    </div>
  
    <div class="row justify-content-center mt-4">
      <div class="col-xxl-8">
        <div class="card">
          <div class="card-body">
            {#if initializing}
              <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading your consent data...</p>
              </div>
            {:else}
              <form on:submit|preventDefault={save} class="authentication-form text-start">
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" id="terms" bind:checked={consents.terms_and_conditions} required disabled={loading} />
                  <label class="form-check-label" for="terms">
                    I agree to the <a href="/terms" target="_blank">Terms and Conditions</a>.
                  </label>
                </div>
  
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" id="privacy" bind:checked={consents.privacy_policy} required disabled={loading} />
                  <label class="form-check-label" for="privacy">
                    I have read and accept the <a href="/privacy" target="_blank">Privacy Policy</a>.
                  </label>
                </div>
  
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" id="data" bind:checked={consents.data_processing} required disabled={loading} />
                  <label class="form-check-label" for="data">
                    I consent to the processing of my personal data for recruitment purposes.
                  </label>
                </div>
  
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" id="marketing" bind:checked={consents.marketing_emails} disabled={loading} />
                  <label class="form-check-label" for="marketing">
                    I agree to receive occasional marketing and product update emails.
                  </label>
                </div>
  
                <div class="form-check mb-4">
                  <input class="form-check-input" type="checkbox" id="visibility" bind:checked={consents.profile_visibility} disabled={loading} />
                  <label class="form-check-label" for="visibility">
                    I allow my profile to be visible to verified recruiters on the platform.
                  </label>
                </div>
  
                <div class="d-grid">
                  <button class="btn btn-primary btn-lg" type="submit" disabled={loading}>
                    {#if loading}
                      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    {:else}
                      {existingData ? 'Update & Finish' : 'Save & Finish'}
                    {/if}
                  </button>
                </div>
  
                {#if message}
                  <div class="alert alert-{messageType === 'success' ? 'success' : 'danger'} mt-3 d-flex align-items-center" role="alert">
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
  
  <style>
    .form-check-label {
      font-size: 0.9rem;
    }
    a {
      text-decoration: underline;
    }
    .badge {
      font-size: 0.875rem;
      font-weight: 500;
    }
  </style>
  