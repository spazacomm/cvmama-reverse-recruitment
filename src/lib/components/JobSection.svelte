<!-- JobsSection.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import type { AuthSession } from '@supabase/supabase-js';
	import JobCreation from './JobCreation.svelte';
  
    export let candidateId: string;
    export let session: AuthSession;
  
    let activeTab = 'saved';
    let jobs = [];
    let loading = true;
    let selectedJob = null;
    let showOffcanvas = false;
    let jobActivities = [];
    let jobDocuments = [];
    let jobMessages = [];
    let loadingDetails = false;
  
    // Pagination
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalItems = 0;
  
    let tabs = [
      { id: 'saved', label: 'Saved', icon: 'bx-bookmark', count: 0 },
      { id: 'delegated', label: 'Delegated', icon: 'bx-user-check', count: 0 },
      { id: 'applied', label: 'Applied', icon: 'bx-send', count: 0 },
      { id: 'interviewing', label: 'Interviewing', icon: 'bx-calendar', count: 0 }
    ];
  
    const statusColors = {
      saved: 'secondary',
      delegated: 'info',
      applied: 'primary',
      interviewing: 'warning',
      offered: 'success',
      rejected: 'danger',
      accepted: 'success',
      withdrawn: 'dark'
    };
  
    const priorityColors = {
      low: 'secondary',
      medium: 'warning',
      high: 'danger'
    };
  
    onMount(() => {
      loadJobs();
      loadJobCounts();
    });
  
    async function loadJobCounts() {
      try {
        for (const tab of tabs) {
          const { count } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('candidate_id', candidateId)
            .eq('status', tab.id);
          
          tab.count = count || 0;
        }
        tabs = [...tabs];
      } catch (error) {
        console.error('Error loading job counts:', error);
      }
    }
  
    async function loadJobs() {
      loading = true;
      try {
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
  
        const { data, error, count } = await supabase
          .from('jobs')
          .select('*', { count: 'exact' })
          .eq('candidate_id', candidateId)
          .eq('status', activeTab)
          .order('updated_at', { ascending: false })
          .range(from, to);
  
        if (error) throw error;
  
        jobs = data || [];
        totalItems = count || 0;
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        loading = false;
      }
    }
  
    async function loadJobDetails(jobId: string) {
      loadingDetails = true;
      try {
        // Load activities
        const { data: activities } = await supabase
          .from('job_activities')
          .select('*, performed_by_user:performed_by(full_name, avatar_url)')
          .eq('job_id', jobId)
          .order('created_at', { ascending: false })
          .limit(10);
        
        jobActivities = activities || [];
  
        // Load documents
        const { data: docs } = await supabase
          .from('documents')
          .select('*')
          .eq('context', 'job')
          .eq('context_id', jobId)
          .order('created_at', { ascending: false });
        
        jobDocuments = docs || [];
  
        // Load messages
        const { data: msgs } = await supabase
          .from('messages')
          .select('*, sender:sender_id(full_name, avatar_url)')
          .eq('related_job_id', jobId)
          .order('created_at', { ascending: false })
          .limit(10);
        
        jobMessages = msgs || [];
  
      } catch (error) {
        console.error('Error loading job details:', error);
      } finally {
        loadingDetails = false;
      }
    }
  
    function openJobDetails(job) {
      selectedJob = job;
      showOffcanvas = true;
      loadJobDetails(job.id);
    }
  
    function closeOffcanvas() {
      showOffcanvas = false;
      selectedJob = null;
      jobActivities = [];
      jobDocuments = [];
      jobMessages = [];
    }
  
    function changeTab(tabId: string) {
      activeTab = tabId;
      currentPage = 1;
      loadJobs();
    }
  
    function changePage(page: number) {
      currentPage = page;
      loadJobs();
    }
  
    function formatDate(dateString: string) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  
    function formatDateTime(dateString: string) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit' 
      });
    }
  
    function formatSalary(min: number, max: number, currency: string) {
      if (!min && !max) return 'Not specified';
      const formatter = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: currency || 'USD',
        maximumFractionDigits: 0
      });
      if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
      if (min) return `${formatter.format(min)}+`;
      return formatter.format(max);
    }
  
    function getWorkModeIcon(mode: string) {
      const icons = {
        remote: 'bx-home',
        hybrid: 'bx-buildings',
        onsite: 'bx-building'
      };
      return icons[mode] || 'bx-briefcase';
    }
  
    async function updateJobStatus(jobId: string, newStatus: string) {
      try {
        const updateData: any = { 
          status: newStatus,
          updated_at: new Date().toISOString()
        };
  
        // Set timestamp for status
        const statusTimestamps = {
          delegated: 'delegated_at',
          applied: 'applied_at',
          interviewing: 'first_interview_at',
          offered: 'offer_received_at',
          rejected: 'rejected_at',
          accepted: 'accepted_at'
        };
  
        if (statusTimestamps[newStatus]) {
          updateData[statusTimestamps[newStatus]] = new Date().toISOString();
        }
  
        const { error } = await supabase
          .from('jobs')
          .update(updateData)
          .eq('id', jobId);
  
        if (error) throw error;
  
        // Log activity
        await supabase.from('job_activities').insert({
          job_id: jobId,
          activity_type: 'status_change',
          description: `Status changed to ${newStatus}`,
          performed_by: session.user.id,
          performed_by_role: 'candidate'
        });
  
        // Reload jobs and update selected job
        await loadJobs();
        await loadJobCounts();
        if (selectedJob?.id === jobId) {
          const { data } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single();
          selectedJob = data;
          await loadJobDetails(jobId);
        }
      } catch (error) {
        console.error('Error updating job status:', error);
      }
    }
  
    async function deleteJob(jobId: string) {
      if (!confirm('Are you sure you want to delete this job?')) return;
  
      try {
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', jobId);
  
        if (error) throw error;
  
        closeOffcanvas();
        await loadJobs();
        await loadJobCounts();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }

    async function handleJobCreated(event) {
    const newJob = event.detail;
    console.log('Job created:', newJob);
    // Refresh job list, show notification, etc.
  }
  
    $: totalPages = Math.ceil(totalItems / itemsPerPage);
    $: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  </script>
  
  <div class="jobs-section">
    <div class="card">
      <div class="card-header bg-white">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i class="bx bx-briefcase text-primary me-2"></i>Your Jobs
          </h5>
         
          <JobCreation {candidateId} on:jobCreated={handleJobCreated} />
        </div>
      </div>
  
      <div class="card-body p-0">
        <!-- Tabs -->
        <ul class="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
          {#each tabs as tab}
            <li class="nav-item" role="presentation">
              <button
                class="nav-link {activeTab === tab.id ? 'active' : ''}"
                on:click={() => changeTab(tab.id)}
                type="button"
              >
                <span class="d-block d-sm-none">
                  <i class="bx {tab.icon}"></i>
                </span>
                <span class="d-none d-sm-flex align-items-center justify-content-center gap-2">
                  <i class="bx {tab.icon}"></i>
                  {tab.label}
                  {#if tab.count > 0}
                    <span class="badge bg-soft-primary text-primary rounded-pill">
                      {tab.count}
                    </span>
                  {/if}
                </span>
              </button>
            </li>
          {/each}
        </ul>
  
        <!-- Tab Content -->
        <div class="tab-content p-3">
          {#if loading}
            <div class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          {:else if jobs.length === 0}
            <div class="text-center py-5">
              <i class="bx bx-briefcase-alt" style="font-size: 4rem; color: #ccc;"></i>
              <h5 class="mt-3 text-muted">No {activeTab} jobs yet</h5>
              <p class="text-muted">Start tracking your job applications</p>
              
              
            </div>
            
          {:else}
            <!-- Jobs List -->
            <div class="jobs-list">
              {#each jobs as job}
                <div 
                  class="job-item" 
                  on:click={() => openJobDetails(job)}
                  role="button"
                  tabindex="0"
                  on:keypress={(e) => e.key === 'Enter' && openJobDetails(job)}
                >
                  <div class="job-item-header">
                    <div class="job-info">
                      <h6 class="job-title mb-1">{job.job_title}</h6>
                      <div class="job-company">
                        <span class="text-muted">{job.company_name}</span>
                        {#if job.location}
                          <span class="text-muted mx-2">•</span>
                          <span class="text-muted">
                            <i class="bx bx-map me-1"></i>{job.location}
                          </span>
                        {/if}
                      </div>
                    </div>
                    <div class="job-meta">
                      <span class="badge bg-soft-{statusColors[job.status]} text-{statusColors[job.status]} text-capitalize">
                        {job.status}
                      </span>
                    </div>
                  </div>
  
                  <div class="job-item-body">
                    <div class="job-details">
                      {#if job.work_mode}
                        <span class="detail-item">
                          <i class="bx {getWorkModeIcon(job.work_mode)} text-muted"></i>
                          <span class="text-capitalize">{job.work_mode}</span>
                        </span>
                      {/if}
                      {#if job.employment_type}
                        <span class="detail-item">
                          <i class="bx bx-time text-muted"></i>
                          <span class="text-capitalize">{job.employment_type}</span>
                        </span>
                      {/if}
                      {#if job.salary_min || job.salary_max}
                        <span class="detail-item">
                          <i class="bx bx-dollar text-muted"></i>
                          <span>{formatSalary(job.salary_min, job.salary_max, job.salary_currency)}</span>
                        </span>
                      {/if}
                    </div>
  
                    {#if job.tags && job.tags.length > 0}
                      <div class="job-tags mt-2">
                        {#each job.tags.slice(0, 3) as tag}
                          <span class="badge bg-light text-dark">{tag}</span>
                        {/each}
                        {#if job.tags.length > 3}
                          <span class="badge bg-light text-dark">+{job.tags.length - 3}</span>
                        {/if}
                      </div>
                    {/if}
                  </div>
  
                  <div class="job-item-footer">
                    <div class="job-dates">
                      {#if job.applied_at}
                        <small class="text-muted">
                          <i class="bx bx-send me-1"></i>Applied {formatDate(job.applied_at)}
                        </small>
                      {:else if job.delegated_at}
                        <small class="text-muted">
                          <i class="bx bx-user-check me-1"></i>Delegated {formatDate(job.delegated_at)}
                        </small>
                      {:else}
                        <small class="text-muted">
                          <i class="bx bx-bookmark me-1"></i>Saved {formatDate(job.saved_at)}
                        </small>
                      {/if}
                    </div>
                    {#if job.priority}
                      <span class="badge bg-soft-{priorityColors[job.priority]} text-{priorityColors[job.priority]} text-capitalize">
                        {job.priority} priority
                      </span>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
  
            <!-- Pagination -->
            {#if totalPages > 1}
              <div class="pagination-wrapper">
                <nav>
                  <ul class="pagination pagination-sm justify-content-center mb-0">
                    <li class="page-item {currentPage === 1 ? 'disabled' : ''}">
                      <button 
                        class="page-link" 
                        on:click={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i class="bx bx-chevron-left"></i>
                      </button>
                    </li>
                    
                    {#each pageNumbers as page}
                      {#if page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)}
                        <li class="page-item {currentPage === page ? 'active' : ''}">
                          <button 
                            class="page-link" 
                            on:click={() => changePage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      {:else if page === currentPage - 2 || page === currentPage + 2}
                        <li class="page-item disabled">
                          <span class="page-link">...</span>
                        </li>
                      {/if}
                    {/each}
  
                    <li class="page-item {currentPage === totalPages ? 'disabled' : ''}">
                      <button 
                        class="page-link" 
                        on:click={() => changePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <i class="bx bx-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
                <p class="text-muted text-center small mt-2">
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} jobs
                </p>
              </div>
            {/if}
          {/if}
        </div>
      </div>
    </div>
  </div>
  
  <!-- ========================= -->
<!--   ENHANCED JOB OFFCANVAS  -->
<!-- ========================= -->

{#if showOffcanvas && selectedJob}
<div class="offcanvas-backdrop fade show" on:click={closeOffcanvas}></div>

<div class="offcanvas offcanvas-end show improved-offcanvas" tabindex="-1">
  <!-- HEADER -->
  <div class="offcanvas-header border-bottom pb-3">
    <div>
      <h4 class="fw-bold mb-1">{selectedJob.job_title}</h4>

      <div class="d-flex align-items-center gap-2 text-muted small">
        <i class='bx bx-buildings'></i>
        {selectedJob.company_name}
      </div>
    </div>

    <button type="button" class="btn-close" on:click={closeOffcanvas}></button>
  </div>

  <div class="offcanvas-body">
    {#if loadingDetails}
      <div class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>
    {:else}

      <!-- ============================= -->
      <!--     TOP ACTION BUTTONS       -->
      <!-- ============================= -->
      <div class="d-flex flex-column gap-2 mb-4">
        <button 
          class="btn btn-primary w-100 delegate-button"
          on:click={() => updateJobStatus(selectedJob.id, 'delegated')}
        >
          <i class="bx bx-share-alt me-2"></i>Delegate to Agent
        </button>

        {#if selectedJob.application_url}
          <a href={selectedJob.application_url} target="_blank" class="btn btn-outline-success w-100">
            <i class="bx bx-send me-2"></i>Apply Now
          </a>
        {/if}
      </div>


      <!-- ========================= -->
      <!--     OVERVIEW SECTION      -->
      <!-- ========================= -->
      <div class="detail-card mb-4">
        <h6 class="section-title"><i class="bx bx-info-circle me-1"></i> Overview</h6>

        <div class="overview-grid">
          <div>
            <small class="text-muted">Status</small>
            <div class="dropdown">
              <button class="btn btn-sm btn-{statusColors[selectedJob.status]} dropdown-toggle text-capitalize" data-bs-toggle="dropdown">
                {selectedJob.status}
              </button>
              <ul class="dropdown-menu">
                <li><button class="dropdown-item" on:click={() => updateJobStatus(selectedJob.id, 'saved')}>Saved</button></li>
                <li><button class="dropdown-item" on:click={() => updateJobStatus(selectedJob.id, 'delegated')}>Delegated</button></li>
                <li><button class="dropdown-item" on:click={() => updateJobStatus(selectedJob.id, 'applied')}>Applied</button></li>
                <li><button class="dropdown-item" on:click={() => updateJobStatus(selectedJob.id, 'interviewing')}>Interviewing</button></li>
                <li><hr class="dropdown-divider" /></li>
                <li><button class="dropdown-item" on:click={() => updateJobStatus(selectedJob.id, 'offered')}>Offered</button></li>
                <li><button class="dropdown-item" on:click={() => updateJobStatus(selectedJob.id, 'accepted')}>Accepted</button></li>
                <li><button class="dropdown-item text-danger" on:click={() => updateJobStatus(selectedJob.id, 'rejected')}>Rejected</button></li>
              </ul>
            </div>
          </div>

          {#if selectedJob.location}
            <div>
              <small class="text-muted">Location</small>
              <div class="fw-semibold">
                <i class="bx bx-map me-1"></i> {selectedJob.location}
              </div>
            </div>
          {/if}

          {#if selectedJob.work_mode}
            <div>
              <small class="text-muted">Work Mode</small>
              <div class="fw-semibold text-capitalize">
                <i class="bx {getWorkModeIcon(selectedJob.work_mode)} me-1"></i>
                {selectedJob.work_mode}
              </div>
            </div>
          {/if}

          {#if selectedJob.salary_min || selectedJob.salary_max}
            <div>
              <small class="text-muted">Salary</small>
              <div class="fw-semibold">{formatSalary(selectedJob.salary_min, selectedJob.salary_max, selectedJob.salary_currency)}</div>
            </div>
          {/if}

          {#if selectedJob.employment_type}
            <div>
              <small class="text-muted">Employment Type</small>
              <div class="fw-semibold text-capitalize">{selectedJob.employment_type}</div>
            </div>
          {/if}
        </div>
      </div>


      <!-- NOTES -->
      {#if selectedJob.candidate_notes || selectedJob.agent_notes}
        <div class="detail-card mb-4">
          <h6 class="section-title"><i class="bx bx-notepad me-1"></i> Notes</h6>

          {#if selectedJob.candidate_notes}
            <div class="note-block">
              <div class="note-title text-primary"><i class="bx bx-user me-1"></i> Your Notes</div>
              <p class="note-text">{selectedJob.candidate_notes}</p>
            </div>
          {/if}

          {#if selectedJob.agent_notes}
            <div class="note-block">
              <div class="note-title text-info"><i class="bx bx-bot me-1"></i> Agent Notes</div>
              <p class="note-text">{selectedJob.agent_notes}</p>
            </div>
          {/if}
        </div>
      {/if}


      <!-- DOCUMENTS -->
      <div class="detail-card mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="section-title"><i class="bx bx-file me-1"></i> Documents</h6>
          <button class="btn btn-sm btn-outline-primary"><i class="bx bx-plus"></i></button>
        </div>

        {#if jobDocuments.length > 0}
          {#each jobDocuments as doc}
            <div class="doc-item">
              <i class="bx bx-file text-primary fs-4"></i>

              <div>
                <div class="fw-semibold">{doc.file_name}</div>
                <small class="text-muted">{(doc.file_size / 1024).toFixed(1)} KB • {formatDate(doc.created_at)}</small>
              </div>

              <a href={doc.file_path} target="_blank" class="ms-auto btn btn-sm btn-light">
                <i class="bx bx-download"></i>
              </a>
            </div>
          {/each}
        {:else}
          <p class="text-muted small text-center py-3">No documents uploaded</p>
        {/if}
      </div>


      <!-- MESSAGES -->
      <div class="detail-card mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="section-title"><i class="bx bx-message-square-dots me-1"></i> Messages</h6>
          <button class="btn btn-sm btn-outline-primary"><i class="bx bx-message-add"></i></button>
        </div>

        {#if jobMessages.length > 0}
          {#each jobMessages as msg}
            <div class="msg-item">
              <img 
                class="msg-avatar"
                src={msg.sender?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender?.full_name || 'User')}&size=32`}
              />

              <div class="msg-content">
                <div class="d-flex justify-content-between">
                  <strong>{msg.sender?.full_name}</strong>
                  <small class="text-muted">{formatDateTime(msg.created_at)}</small>
                </div>
                <p class="msg-text">{msg.content}</p>
              </div>
            </div>
          {/each}
        {:else}
          <p class="text-muted small text-center py-3">No messages yet</p>
        {/if}
      </div>


      <!-- TIMELINE -->
      <div class="detail-card mb-4">
        <h6 class="section-title"><i class="bx bx-time-five me-1"></i> Activity Timeline</h6>

        {#if jobActivities.length > 0}
          {#each jobActivities as act}
            <div class="timeline-line">
              <div class="timeline-dot"></div>
              <div class="timeline-info">
                <div class="fw-semibold">{act.description}</div>
                <small class="text-muted">{formatDateTime(act.created_at)}</small>
              </div>
            </div>
          {/each}
        {:else}
          <p class="text-muted small text-center py-3">No activity recorded</p>
        {/if}
      </div>


      <!-- DELETE -->
      <div class="d-grid">
        <button class="btn btn-danger" on:click={() => deleteJob(selectedJob.id)}>
          <i class="bx bx-trash me-1"></i>Delete Job
        </button>
      </div>

    {/if}
  </div>
</div>
{/if}

  <style>
    @import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');
  
    .jobs-section {
      margin-bottom: 24px;
    }
  
    .nav-tabs-custom {
      border-bottom: 2px solid #e9ecef;
    }
  
    .nav-tabs-custom .nav-link {
      border: none;
      color: #6c757d;
      font-weight: 500;
      padding: 12px 20px;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
    }
  
    .nav-tabs-custom .nav-link:hover {
      color: #495057;
      border-bottom-color: #dee2e6;
    }
  
    .nav-tabs-custom .nav-link.active {
      color: #667eea;
      border-bottom-color: #667eea;
      background: transparent;
    }
  
    .jobs-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  
    .job-item {
      padding: 16px;
      border: 1px solid #e9ecef;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
    }
  
    .job-item:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
    }
  
    .job-item-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 12px;
    }
  
    .job-title {
      font-size: 16px;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
    }
  
    .job-company {
      font-size: 14px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
  
    .job-meta {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  
    .job-item-body {
      margin-bottom: 12px;
    }
  
    .job-details {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 14px;
    }
  
    .detail-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  
    .job-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
  
    .job-tags .badge {
      font-size: 11px;
      font-weight: 500;
      padding: 4px 8px;
    }
  
    .job-item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #f1f3f5;
    }
  
    .pagination-wrapper {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e9ecef;
    }
  
    /* Offcanvas Styles */
    .offcanvas-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1040;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s;
    }
  
    .offcanvas-backdrop.show {
      opacity: 1;
    }
  
    .offcanvas {
      position: fixed;
      bottom: 0;
      z-index: 1045;
      display: flex;
      flex-direction: column;
      max-width: 100%;
      visibility: hidden;
      background-color: #fff;
      background-clip: padding-box;
      outline: 0;
      transition: transform 0.3s ease-in-out;
    }
  
    .offcanvas-end {
      top: 0;
      right: 0;
      width: 90%;
      max-width: 500px;
      border-left: 1px solid rgba(0, 0, 0, 0.2);
      transform: translateX(100%);
    }
  
    .offcanvas.show {
      transform: none;
      visibility: visible;
    }
  
    .offcanvas-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid #e9ecef;
    }
  
    .offcanvas-title {
      margin-bottom: 0;
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
    }
  
    .btn-close {
      box-sizing: content-box;
      width: 1em;
      height: 1em;
      padding: 0.25em;
      color: #000;
      background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;
      border: 0;
      border-radius: 0.25rem;
      opacity: 0.5;
      cursor: pointer;
    }
  
    .btn-close:hover {
      opacity: 0.75;
    }
  
    .offcanvas-body {
      flex-grow: 1;
      padding: 24px;
      overflow-y: auto;
    }
  
    /* Detail Sections */
    .detail-section {
      margin-bottom: 32px;
    }
  
    .detail-section:last-child {
      margin-bottom: 0;
    }
  
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #2d3748;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  
    .section-title::before {
      content: '';
      width: 3px;
      height: 16px;
      background: #667eea;
      border-radius: 2px;
    }
  
    .detail-grid {
      display: grid;
      gap: 16px;
    }
  
    .detail-item-full {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  
    .detail-label {
      font-size: 12px;
      font-weight: 600;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  
    .detail-value {
      font-size: 14px;
      color: #2d3748;
      font-weight: 500;
    }
  
    /* Note Cards */
    .note-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 12px;
    }
  
    .note-card:last-child {
      margin-bottom: 0;
    }
  
    .note-header {
      font-size: 13px;
      font-weight: 600;
      color: #495057;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }
  
    .note-content {
      font-size: 14px;
      color: #6c757d;
      margin: 0;
      line-height: 1.6;
    }
  
    /* Document List */
    .document-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  
    .document-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      transition: background 0.2s;
    }
  
    .document-item:hover {
      background: #e9ecef;
    }
  
    .document-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 8px;
      font-size: 20px;
    }
  
    .document-info {
      flex: 1;
      min-width: 0;
    }
  
    .document-name {
      font-size: 14px;
      font-weight: 500;
      color: #2d3748;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  
    /* Message List */
    .message-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  
    .message-item {
      display: flex;
      gap: 12px;
    }
  
    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      flex-shrink: 0;
    }
  
    .message-content {
      flex: 1;
      min-width: 0;
    }
  
    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
  
    .message-header strong {
      font-size: 14px;
      color: #2d3748;
    }
  
    .message-text {
      font-size: 13px;
      color: #4a5568;
      margin: 0;
      line-height: 1.5;
    }
  
    /* Timeline */
    .timeline {
      position: relative;
      padding-left: 32px;
    }
  
    .timeline::before {
      content: '';
      position: absolute;
      left: 7px;
      top: 8px;
      bottom: 8px;
      width: 2px;
      background: #e9ecef;
    }
  
    .timeline-item {
      position: relative;
      margin-bottom: 24px;
    }
  
    .timeline-item:last-child {
      margin-bottom: 0;
    }
  
    .timeline-marker {
      position: absolute;
      left: -28px;
      top: 4px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #667eea;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #e9ecef;
    }
  
    .timeline-content {
      padding-bottom: 8px;
    }
  
    .timeline-description {
      font-size: 14px;
      color: #2d3748;
      margin-bottom: 4px;
    }
  
    /* Badge Soft Variants */
    .bg-soft-primary {
      background-color: rgba(102, 126, 234, 0.1);
    }
  
    .bg-soft-secondary {
      background-color: rgba(108, 117, 125, 0.1);
    }
  
    .bg-soft-success {
      background-color: rgba(40, 199, 111, 0.1);
    }
  
    .bg-soft-danger {
      background-color: rgba(239, 68, 68, 0.1);
    }
  
    .bg-soft-warning {
      background-color: rgba(251, 191, 36, 0.1);
    }
  
    .bg-soft-info {
      background-color: rgba(59, 130, 246, 0.1);
    }
  
    .text-primary {
      color: #667eea !important;
    }
  
    .text-secondary {
      color: #6c757d !important;
    }
  
    .text-success {
      color: #28c76f !important;
    }
  
    .text-danger {
      color: #ef4444 !important;
    }
  
    .text-warning {
      color: #fbbf24 !important;
    }
  
    .text-info {
      color: #3b82f6 !important;
    }
  
    .text-dark {
      color: #2d3748 !important;
    }
  
    .btn-ghost-primary {
      color: #667eea;
      background: transparent;
      border: none;
    }
  
    .btn-ghost-primary:hover {
      background: rgba(102, 126, 234, 0.1);
    }
  
    /* Dropdown */
    .dropdown {
      position: relative;
      display: inline-block;
    }
  
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1000;
      display: none;
      min-width: 160px;
      padding: 8px 0;
      margin: 4px 0 0;
      font-size: 14px;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid rgba(0, 0, 0, 0.15);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  
    .dropdown:focus-within .dropdown-menu {
      display: block;
    }
  
    .dropdown-item {
      display: block;
      width: 100%;
      padding: 8px 16px;
      clear: both;
      font-weight: 400;
      color: #2d3748;
      text-align: inherit;
      white-space: nowrap;
      background-color: transparent;
      border: 0;
      cursor: pointer;
      transition: background 0.2s;
    }
  
    .dropdown-item:hover {
      background-color: #f8f9fa;
    }
  
    .dropdown-divider {
      height: 0;
      margin: 8px 0;
      overflow: hidden;
      border-top: 1px solid #e9ecef;
    }
  
    /* Responsive */
    @media (max-width: 767px) {
      .offcanvas-end {
        width: 100%;
        max-width: 100%;
      }
  
      .job-item-header {
        flex-direction: column;
        gap: 12px;
      }
  
      .job-meta {
        align-self: flex-start;
      }
  
      .job-details {
        flex-direction: column;
        gap: 8px;
      }
  
      .job-item-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  
    @media (min-width: 768px) {
      .job-item {
        padding: 20px;
      }
  
      .offcanvas-body {
        padding: 32px;
      }
  
      .detail-grid {
        grid-template-columns: repeat(2, 1fr);
      }
  
      .detail-item-full {
        grid-column: 1 / -1;
      }
    }

    .improved-offcanvas {
  width: 420px !important;
  background: #f9fafb;
  border-left: 1px solid #e5e7eb;
}

/* Card style sections */
.detail-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

/* Section headers */
.section-title {
  font-weight: 600;
  margin-bottom: 12px;
}

/* Overview grid */
.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Notes */
.note-block {
  background: #f8f9fc;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
}

/* Documents */
.doc-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px dashed #e5e7eb;
}

/* Messages */
.msg-item {
  display: flex;
  align-items: start;
  gap: 12px;
  padding: 10px 0;
}

.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.msg-text {
  margin-bottom: 0;
}

/* Timeline */
.timeline-line {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  background: #6366f1;
  border-radius: 50%;
  margin-top: 6px;
}

.timeline-info small {
  font-size: 12px;
  color: #6b7280;
}

/* Delegate button highlight */
.delegate-button {
  background: linear-gradient(45deg, #6366f1, #818cf8);
  border: none;
  font-weight: 600;
}

  </style>