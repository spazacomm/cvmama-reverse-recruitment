<script>
    import { createEventDispatcher } from 'svelte';
    import { supabase } from '$lib/supabaseClient'; // Adjust import path as needed
    
    const dispatch = createEventDispatcher();
    
    let showOffcanvas = false;
    let isSubmitting = false;
    
    // Form data
    let formData = {
      candidate_id: '', // Should be passed as prop or from auth context
      job_title: '',
      company_name: '',
      company_url: '',
      location: '',
      work_mode: '',
      employment_type: '',
      salary_min: null,
      salary_max: null,
      salary_currency: 'USD',
      job_url: '',
      application_url: '',
      source: '',
      external_job_id: '',
      status: 'saved',
      candidate_notes: '',
      tags: [],
      priority: 'medium'
    };
    
    let tagInput = '';
    
    export let candidateId = ''; // Pass this as prop
    
    $: if (candidateId) formData.candidate_id = candidateId;
    
    function openOffcanvas() {
      showOffcanvas = true;
    }
    
    function closeOffcanvas() {
      showOffcanvas = false;
    }
    
    function addTag() {
      if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
        formData.tags = [...formData.tags, tagInput.trim()];
        tagInput = '';
      }
    }
    
    function removeTag(tag) {
      formData.tags = formData.tags.filter(t => t !== tag);
    }
    
    async function handleSubmit() {
      if (!formData.job_title || !formData.company_name || !formData.candidate_id) {
        alert('Please fill in required fields: Job Title, Company Name');
        return;
      }
      
      isSubmitting = true;
      
      try {
        const { data, error } = await supabase
          .from('jobs')
          .insert([{
            candidate_id: formData.candidate_id,
            job_title: formData.job_title,
            company_name: formData.company_name,
            company_url: formData.company_url || null,
            location: formData.location || null,
            work_mode: formData.work_mode || null,
            employment_type: formData.employment_type || null,
            salary_min: formData.salary_min || null,
            salary_max: formData.salary_max || null,
            salary_currency: formData.salary_currency,
            job_url: formData.job_url || null,
            application_url: formData.application_url || null,
            source: formData.source || null,
            external_job_id: formData.external_job_id || null,
            status: formData.status,
            candidate_notes: formData.candidate_notes || null,
            tags: formData.tags.length > 0 ? formData.tags : [],
            priority: formData.priority
          }])
          .select();
        
        if (error) throw error;
        
        dispatch('jobCreated', data[0]);
        resetForm();
        closeOffcanvas();
      } catch (error) {
        console.error('Error creating job:', error);
        alert('Failed to create job. Please try again.');
      } finally {
        isSubmitting = false;
      }
    }
    
    function resetForm() {
      formData = {
        candidate_id: candidateId,
        job_title: '',
        company_name: '',
        company_url: '',
        location: '',
        work_mode: '',
        employment_type: '',
        salary_min: null,
        salary_max: null,
        salary_currency: 'USD',
        job_url: '',
        application_url: '',
        source: '',
        external_job_id: '',
        status: 'saved',
        candidate_notes: '',
        tags: [],
        priority: 'medium'
      };
      tagInput = '';
    }
  </script>
  
  <svelte:head>
    <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"> -->
  </svelte:head>
  
  <button class="btn btn-primary" on:click={openOffcanvas}>
    <i class="bx bx-plus me-1"></i>
    Add Job
  </button>
  
  {#if showOffcanvas}
    <div class="offcanvas offcanvas-end show" tabindex="-1" style="visibility: visible;">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Create New Job</h5>
        <button type="button" class="btn-close" on:click={closeOffcanvas}></button>
      </div>
      <div class="offcanvas-body">
        <form on:submit|preventDefault={handleSubmit}>
          
          <!-- Job Details Section -->
          <div class="mb-4">
            <h6 class="text-muted mb-3">Job Details</h6>
            
            <div class="mb-3">
              <label for="jobTitle" class="form-label">Job Title <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="jobTitle" bind:value={formData.job_title} required>
            </div>
            
            <div class="mb-3">
              <label for="companyName" class="form-label">Company Name <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="companyName" bind:value={formData.company_name} required>
            </div>
            
            <div class="mb-3">
              <label for="companyUrl" class="form-label">Company URL</label>
              <input type="url" class="form-control" id="companyUrl" bind:value={formData.company_url}>
            </div>
            
            <div class="mb-3">
              <label for="location" class="form-label">Location</label>
              <input type="text" class="form-control" id="location" bind:value={formData.location}>
            </div>
            
            <div class="row mb-3">
              <div class="col-6">
                <label for="workMode" class="form-label">Work Mode</label>
                <select class="form-select" id="workMode" bind:value={formData.work_mode}>
                  <option value="">Select...</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>
              <div class="col-6">
                <label for="employmentType" class="form-label">Employment Type</label>
                <select class="form-select" id="employmentType" bind:value={formData.employment_type}>
                  <option value="">Select...</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Compensation Section -->
          <div class="mb-4">
            <h6 class="text-muted mb-3">Compensation</h6>
            
            <div class="row mb-3">
              <div class="col-5">
                <label for="salaryMin" class="form-label">Min Salary</label>
                <input type="number" class="form-control" id="salaryMin" bind:value={formData.salary_min}>
              </div>
              <div class="col-5">
                <label for="salaryMax" class="form-label">Max Salary</label>
                <input type="number" class="form-control" id="salaryMax" bind:value={formData.salary_max}>
              </div>
              <div class="col-2">
                <label for="currency" class="form-label">Currency</label>
                <input type="text" class="form-control" id="currency" bind:value={formData.salary_currency} maxlength="3">
              </div>
            </div>
          </div>
          
          <!-- Links Section -->
          <div class="mb-4">
            <h6 class="text-muted mb-3">Links & Source</h6>
            
            <div class="mb-3">
              <label for="jobUrl" class="form-label">Job URL</label>
              <input type="url" class="form-control" id="jobUrl" bind:value={formData.job_url}>
            </div>
            
            <div class="mb-3">
              <label for="applicationUrl" class="form-label">Application URL</label>
              <input type="url" class="form-control" id="applicationUrl" bind:value={formData.application_url}>
            </div>
            
            <div class="row mb-3">
              <div class="col-6">
                <label for="source" class="form-label">Source</label>
                <input type="text" class="form-control" id="source" bind:value={formData.source} placeholder="e.g., LinkedIn, Indeed">
              </div>
              <div class="col-6">
                <label for="externalId" class="form-label">External Job ID</label>
                <input type="text" class="form-control" id="externalId" bind:value={formData.external_job_id}>
              </div>
            </div>
          </div>
          
          <!-- Status & Priority Section -->
          <div class="mb-4">
            <h6 class="text-muted mb-3">Status & Priority</h6>
            
            <div class="row mb-3">
              <div class="col-6">
                <label for="status" class="form-label">Status</label>
                <select class="form-select" id="status" bind:value={formData.status}>
                  <option value="saved">Saved</option>
                  <option value="delegated">Delegated</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                  <option value="accepted">Accepted</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
              <div class="col-6">
                <label for="priority" class="form-label">Priority</label>
                <select class="form-select" id="priority" bind:value={formData.priority}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Notes Section -->
          <div class="mb-4">
            <h6 class="text-muted mb-3">Notes</h6>
            
            <div class="mb-3">
              <label for="notes" class="form-label">Candidate Notes</label>
              <textarea class="form-control" id="notes" rows="3" bind:value={formData.candidate_notes}></textarea>
            </div>
          </div>
          
          <!-- Tags Section -->
          <div class="mb-4">
            <h6 class="text-muted mb-3">Tags</h6>
            
            <div class="input-group mb-2">
              <input type="text" class="form-control" placeholder="Add tag" bind:value={tagInput} on:keypress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}>
              <button class="btn btn-outline-secondary" type="button" on:click={addTag}>Add</button>
            </div>
            
            {#if formData.tags.length > 0}
              <div class="d-flex flex-wrap gap-2">
                {#each formData.tags as tag}
                  <span class="badge bg-secondary">
                    {tag}
                    <button type="button" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;" on:click={() => removeTag(tag)}></button>
                  </span>
                {/each}
              </div>
            {/if}
          </div>
          
          <!-- Action Buttons -->
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Job'}
            </button>
            <button type="button" class="btn btn-outline-secondary" on:click={closeOffcanvas} disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="offcanvas-backdrop fade show" on:click={closeOffcanvas}></div>
  {/if}
  
  <style>
    .offcanvas {
      width: 500px !important;
    }
    
    .offcanvas-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1040;
      width: 100vw;
      height: 100vh;
      background-color: #000;
      opacity: 0.5;
    }
    
    .badge .btn-close {
      padding: 0;
      margin: 0;
      vertical-align: middle;
    }
    
    h6.text-muted {
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
    }
  </style>