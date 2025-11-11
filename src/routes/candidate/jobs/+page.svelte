<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    
    // Assuming you have a supabase client setup
     import { supabase } from '$lib/supabaseClient';
    
    let loading = true;
    let dashboardData = null;
    let jobs = [];
    let filteredJobs = [];
    let activeTab = 'all';
    
    // Filter states
    let searchQuery = '';
    let statusFilter = 'all';
    let dateFilter = 'last_30_days';
    let sortBy = 'most_recent';
    
    // Pagination
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalPages = 1;
    let onboarding_completed = false;

    onMount(async () => {
        await checkOnboardingStatus();
        await loadData();
    });

    async function checkOnboardingStatus(){
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

         // Check if onboarding is completed
         const { data: candidate, error: candidateError } = await supabase
                .from('candidates')
                .select('onboarding_completed')
                .eq('user_id', user.id)
                .single();
            
            if (candidateError) throw candidateError;
            
            onboarding_completed = candidate.onboarding_completed;
    }
    
    async function loadData() {
        loading = true;
        try {
            // Get user session
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            
            // Load dashboard data (includes onboarding status)
            const { data: dashboard, error: dashError } = await supabase
                .from('candidate_dashboard_view')
                .select('*')
                .eq('user_id', user.id)
                .single();
            
            if (dashError) throw dashError;
            dashboardData = dashboard;
            
           
            
            // Load jobs
            await loadJobs();
            
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            loading = false;
        }
    }
    
    async function loadJobs() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            // Get candidate_id
            const { data: candidate } = await supabase
                .from('candidates')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            // Load all jobs for the candidate
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('candidate_id', candidate.id)
                .order('updated_at', { ascending: false });
            
            if (error) throw error;
            jobs = data || [];
            applyFilters();
            
        } catch (error) {
            console.error('Error loading jobs:', error);
        }
    }
    
    function applyFilters() {
        let filtered = [...jobs];
        
        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(job => 
                job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.job_title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(job => job.status === statusFilter);
        }
        
        // Tab filter
        if (activeTab !== 'all') {
            filtered = filtered.filter(job => job.status === activeTab);
        }
        
        // Date filter
        const now = new Date();
        if (dateFilter !== 'all_time') {
            filtered = filtered.filter(job => {
                const jobDate = new Date(job.created_at);
                const daysDiff = (now - jobDate) / (1000 * 60 * 60 * 24);
                
                switch(dateFilter) {
                    case 'last_7_days': return daysDiff <= 7;
                    case 'last_30_days': return daysDiff <= 30;
                    case 'last_3_months': return daysDiff <= 90;
                    default: return true;
                }
            });
        }
        
        // Sort
        switch(sortBy) {
            case 'most_recent':
                filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                break;
            case 'company':
                filtered.sort((a, b) => a.company_name.localeCompare(b.company_name));
                break;
            case 'status':
                filtered.sort((a, b) => a.status.localeCompare(b.status));
                break;
            case 'salary':
                filtered.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
                break;
        }
        
        filteredJobs = filtered;
        totalPages = Math.ceil(filtered.length / itemsPerPage);
    }
    
    function resetFilters() {
        searchQuery = '';
        statusFilter = 'all';
        dateFilter = 'last_30_days';
        sortBy = 'most_recent';
        applyFilters();
    }
    
    function switchTab(tab) {
        activeTab = tab;
        currentPage = 1;
        applyFilters();
    }
    
    function getJobsByStatus(status) {
        return jobs.filter(job => job.status === status);
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    function formatSalary(min, max, currency = 'USD') {
        if (!min && !max) return 'Not specified';
        if (min && max) return `$${(min/1000)}k-$${(max/1000)}k`;
        if (min) return `$${(min/1000)}k+`;
        return `Up to $${(max/1000)}k`;
    }
    
    function getStatusBadgeClass(status) {
        const classes = {
            'saved': 'bg-warning text-dark',
            'delegated': 'bg-primary',
            'applied': 'bg-success',
            'interviewing': 'text-white',
            'offered': 'bg-info',
            'rejected': 'bg-danger',
            'accepted': 'bg-success',
            'withdrawn': 'bg-secondary'
        };
        return classes[status] || 'bg-secondary';
    }
    
    function getCompanyInitials(company) {
        return company.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }
    
    function getAvatarColor(company) {
        const colors = ['4f46e5', '10b981', '635bff', 'ff5a5f', '3b82f6', 'f59e0b'];
        const index = company.length % colors.length;
        return colors[index];
    }
    
    $: paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    $: {
        // Re-apply filters when any filter changes
        searchQuery, statusFilter, dateFilter, sortBy;
        applyFilters();
    }
</script>

<div class="container-xxl">
    <div class="col-md-9 col-lg-10 px-4 py-4">
        {#if !onboarding_completed}
        <div class="text-center py-5">
            <i class="bi bi-person-check" style="font-size: 4rem; color: #ccc;"></i>
            <h4 class="mt-3">Onboarding Incomplete</h4>
            <p class="text-muted mb-4">
                Your profile is not fully set up yet. Complete your onboarding to unlock personalized job recommendations.
            </p>
            <a href="/candidate/onboarding" class="btn btn-primary">
                Complete Onboarding
            </a>
        </div>
        
        {:else}
            <div id="jobs-page" class="page-section">
                <div class="row mb-3">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 class="mb-1">Job Applications</h2>
                                <p class="text-muted">Track and manage your job applications</p>
                            </div>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addJobModal">
                                <i class="bi bi-plus-circle me-2"></i>Add Job Manually
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stats Overview -->
                <div class="row mb-4">
                    <div class="col-md-3 col-6 mb-3">
                        <div class="card stat-card">
                            <div class="card-body text-center">
                                <i class="bi bi-bookmark-fill text-warning" style="font-size: 2rem;"></i>
                                <h3 class="mt-2 mb-0">{dashboardData?.saved_jobs || 0}</h3>
                                <p class="text-muted mb-0">Saved</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 col-6 mb-3">
                        <div class="card stat-card" style="border-left-color: #3b82f6;">
                            <div class="card-body text-center">
                                <i class="bi bi-send-fill text-primary" style="font-size: 2rem;"></i>
                                <h3 class="mt-2 mb-0">{dashboardData?.delegated_jobs || 0}</h3>
                                <p class="text-muted mb-0">Delegated</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 col-6 mb-3">
                        <div class="card stat-card" style="border-left-color: #10b981;">
                            <div class="card-body text-center">
                                <i class="bi bi-check-circle-fill text-success" style="font-size: 2rem;"></i>
                                <h3 class="mt-2 mb-0">{dashboardData?.applied_jobs || 0}</h3>
                                <p class="text-muted mb-0">Applied</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 col-6 mb-3">
                        <div class="card stat-card" style="border-left-color: #8b5cf6;">
                            <div class="card-body text-center">
                                <i class="bi bi-people-fill text-purple" style="font-size: 2rem; color: #8b5cf6;"></i>
                                <h3 class="mt-2 mb-0">{dashboardData?.interviewing_jobs || 0}</h3>
                                <p class="text-muted mb-0">Interviewing</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filters and Search -->
                <div class="card mb-4">
                    <div class="card-body">
                        <div class="row align-items-end">
                            <div class="col-md-4 mb-3 mb-md-0">
                                <label class="form-label">Search</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                                    <input type="text" class="form-control" placeholder="Search by company or role..." bind:value={searchQuery}>
                                </div>
                            </div>
                            <div class="col-md-2 mb-3 mb-md-0">
                                <label class="form-label">Status</label>
                                <select class="form-select" bind:value={statusFilter}>
                                    <option value="all">All Statuses</option>
                                    <option value="saved">Saved</option>
                                    <option value="delegated">Delegated</option>
                                    <option value="applied">Applied</option>
                                    <option value="interviewing">Interviewing</option>
                                    <option value="offered">Offer</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div class="col-md-2 mb-3 mb-md-0">
                                <label class="form-label">Date Range</label>
                                <select class="form-select" bind:value={dateFilter}>
                                    <option value="last_7_days">Last 7 days</option>
                                    <option value="last_30_days">Last 30 days</option>
                                    <option value="last_3_months">Last 3 months</option>
                                    <option value="all_time">All time</option>
                                </select>
                            </div>
                            <div class="col-md-2 mb-3 mb-md-0">
                                <label class="form-label">Sort By</label>
                                <select class="form-select" bind:value={sortBy}>
                                    <option value="most_recent">Most Recent</option>
                                    <option value="company">Company (A-Z)</option>
                                    <option value="status">Status</option>
                                    <option value="salary">Salary (High-Low)</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-outline-secondary w-100" on:click={resetFilters}>
                                    <i class="bi bi-arrow-clockwise me-1"></i>Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Job Tabs -->
                <ul class="nav nav-tabs mb-4" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" class:active={activeTab === 'all'} on:click={() => switchTab('all')}>
                            All Jobs <span class="badge bg-secondary ms-2">{jobs.length}</span>
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" class:active={activeTab === 'saved'} on:click={() => switchTab('saved')}>
                            <i class="bi bi-bookmark-fill text-warning me-1"></i>Saved 
                            <span class="badge bg-secondary ms-2">{getJobsByStatus('saved').length}</span>
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" class:active={activeTab === 'delegated'} on:click={() => switchTab('delegated')}>
                            <i class="bi bi-send-fill text-primary me-1"></i>Delegated 
                            <span class="badge bg-secondary ms-2">{getJobsByStatus('delegated').length}</span>
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" class:active={activeTab === 'applied'} on:click={() => switchTab('applied')}>
                            <i class="bi bi-check-circle-fill text-success me-1"></i>Applied 
                            <span class="badge bg-secondary ms-2">{getJobsByStatus('applied').length}</span>
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" class:active={activeTab === 'interviewing'} on:click={() => switchTab('interviewing')}>
                            <i class="bi bi-people-fill me-1" style="color: #8b5cf6;"></i>Interviewing 
                            <span class="badge bg-secondary ms-2">{getJobsByStatus('interviewing').length}</span>
                        </button>
                    </li>
                </ul>

                <!-- Jobs List -->
                <div class="tab-content">
                    {#if paginatedJobs.length === 0}
                        <div class="text-center py-5">
                            <i class="bi bi-inbox" style="font-size: 4rem; color: #ccc;"></i>
                            <h4 class="mt-3">No jobs found</h4>
                            <p class="text-muted">Try adjusting your filters or add a new job</p>
                        </div>
                    {:else}
                        {#each paginatedJobs as job (job.id)}
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="row align-items-start">
                                        <div class="col-md-1 text-center mb-3 mb-md-0">
                                            <img src="https://ui-avatars.com/api/?name={getCompanyInitials(job.company_name)}&background={getAvatarColor(job.company_name)}&color=fff&size=64" 
                                                 alt={job.company_name} class="rounded" width="64" height="64">
                                        </div>
                                        <div class="col-md-7">
                                            <div class="d-flex align-items-start mb-2">
                                                <div class="flex-grow-1">
                                                    <h5 class="mb-1">{job.job_title}</h5>
                                                    <p class="text-muted mb-2">
                                                        <strong>{job.company_name}</strong> 
                                                        {#if job.location}• {job.location}{/if}
                                                        {#if job.work_mode}({job.work_mode}){/if}
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="mb-2">
                                                {#if job.salary_min || job.salary_max}
                                                    <span class="badge bg-success me-2">{formatSalary(job.salary_min, job.salary_max, job.salary_currency)}</span>
                                                {/if}
                                                {#if job.employment_type}
                                                    <span class="badge bg-light text-dark me-2">{job.employment_type}</span>
                                                {/if}
                                                {#if job.work_mode}
                                                    <span class="badge bg-light text-dark">{job.work_mode}</span>
                                                {/if}
                                            </div>
                                            <p class="mb-2 small text-muted">
                                                <i class="bi bi-calendar me-1"></i>
                                                {#if job.applied_at}
                                                    Applied: {formatDate(job.applied_at)}
                                                {:else if job.delegated_at}
                                                    Delegated: {formatDate(job.delegated_at)}
                                                {:else}
                                                    Saved: {formatDate(job.saved_at)}
                                                {/if}
                                                {#if job.next_interview_date}
                                                    • <i class="bi bi-clock ms-2 me-1"></i>Interview: {formatDate(job.next_interview_date)}
                                                {/if}
                                            </p>
                                            <div class="d-flex gap-2">
                                                <span class="badge {getStatusBadgeClass(job.status)}" style={job.status === 'interviewing' ? 'background-color: #8b5cf6;' : ''}>
                                                    <i class="bi bi-{job.status === 'saved' ? 'bookmark' : job.status === 'delegated' ? 'send' : job.status === 'applied' ? 'check-circle' : 'people'} me-1"></i>
                                                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-md-4 text-md-end">
                                            <div class="d-grid gap-2 d-md-block">
                                                <button class="btn btn-sm btn-primary mb-2 mb-md-0 me-md-2">
                                                    <i class="bi bi-eye me-1"></i>View Details
                                                </button>
                                                <div class="dropdown d-inline-block">
                                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                        <i class="bi bi-three-dots"></i>
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#"><i class="bi bi-pencil me-2"></i>Edit</a></li>
                                                        <li><a class="dropdown-item" href="#"><i class="bi bi-chat-dots me-2"></i>Message Agent</a></li>
                                                        <li><a class="dropdown-item" href="#"><i class="bi bi-file-text me-2"></i>Add Note</a></li>
                                                        <li><hr class="dropdown-divider"></li>
                                                        <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-x-circle me-2"></i>Mark as Rejected</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="mt-2">
                                                <small class="text-muted">Last updated: {formatDate(job.updated_at)}</small>
                                            </div>
                                        </div>
                                    </div>
                                    {#if job.agent_notes}
                                        <div class="mt-3 p-2 bg-light rounded">
                                            <small>
                                                <strong><i class="bi bi-person-circle me-1"></i>Agent Note:</strong> {job.agent_notes}
                                            </small>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        {/each}

                        <!-- Pagination -->
                        {#if totalPages > 1}
                            <nav>
                                <ul class="pagination justify-content-center">
                                    <li class="page-item" class:disabled={currentPage === 1}>
                                        <button class="page-link" on:click={() => currentPage = Math.max(1, currentPage - 1)}>
                                            <i class="bi bi-chevron-left"></i>
                                        </button>
                                    </li>
                                    {#each Array(totalPages) as _, i}
                                        <li class="page-item" class:active={currentPage === i + 1}>
                                            <button class="page-link" on:click={() => currentPage = i + 1}>{i + 1}</button>
                                        </li>
                                    {/each}
                                    <li class="page-item" class:disabled={currentPage === totalPages}>
                                        <button class="page-link" on:click={() => currentPage = Math.min(totalPages, currentPage + 1)}>
                                            <i class="bi bi-chevron-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        {/if}
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    /* ------------------ General ------------------ */
    .page-section {
        padding: 1rem 0.5rem;
    }
    
    .text-muted {
        font-size: 0.9rem;
    }
    
    /* ------------------ Stats Cards ------------------ */
    .stat-card {
        border-left: 4px solid #f59e0b;
        transition: transform 0.2s;
    }
    
    .stat-card:hover {
        transform: translateY(-2px);
    }
    
    .stat-card h3 {
        font-size: 1.5rem;
    }
    
    .stat-card p {
        font-size: 0.85rem;
    }
    
    /* ------------------ Filters ------------------ */
    .card .form-label {
        font-size: 0.85rem;
    }
    
    .card .form-select,
    .card input {
        font-size: 0.85rem;
        height: calc(1.5em + 0.75rem + 2px);
    }
    
    /* Make filters stack on mobile */
    @media (max-width: 767px) {
        .card .row.g-2 > div {
            flex: 0 0 100%;
            max-width: 100%;
        }
    }
    
    /* ------------------ Job Cards ------------------ */
    .card-body img {
        max-width: 64px;
        max-height: 64px;
        object-fit: cover;
    }
    
    .card .d-flex.flex-wrap {
        gap: 0.25rem;
    }
    
    .card h5 {
        font-size: 1rem;
    }
    
    .card p {
        font-size: 0.85rem;
    }
    
    .card .badge {
        font-size: 0.75rem;
        padding: 0.25em 0.5em;
    }
    
    /* Stack job card content on small screens */
    @media (max-width: 767px) {
        .card .row.g-2 {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
    
        .card .text-md-end {
            text-align: left !important;
            width: 100%;
        }
    
        .card .d-grid {
            display: grid !important;
            width: 100%;
        }
    
        .card .d-grid button {
            width: 100%;
        }
    
        .card .dropdown-menu {
            min-width: 100%;
        }
    }
    
    /* ------------------ Buttons ------------------ */
    .btn {
        font-size: 0.85rem;
        padding: 0.45rem 0.75rem;
    }
    
    .btn i {
        font-size: 0.9rem;
    }
    
    /* ------------------ Tabs ------------------ */
    .nav-tabs .nav-link {
        font-size: 0.85rem;
        padding: 0.35rem 0.5rem;
    }
    
    .nav-tabs .badge {
        font-size: 0.7rem;
        padding: 0.2em 0.35em;
    }
    
    /* ------------------ Pagination ------------------ */
    .pagination .page-link {
        font-size: 0.85rem;
        padding: 0.35rem 0.5rem;
    }
    
    /* ------------------ Onboarding Message ------------------ */
    .text-center i {
        font-size: 3.5rem;
    }
    
    .text-center h4 {
        font-size: 1.25rem;
    }
    
    .text-center p {
        font-size: 0.85rem;
    }
    
    /* ------------------ Mobile Specific ------------------ */
    @media (max-width: 576px) {
        .stat-card h3 {
            font-size: 1.25rem;
        }
    
        .card h5 {
            font-size: 0.95rem;
        }
    
        .card p {
            font-size: 0.8rem;
        }
    
        .btn {
            font-size: 0.8rem;
            padding: 0.4rem 0.6rem;
        }
    
        .nav-tabs .nav-link {
            font-size: 0.75rem;
            padding: 0.3rem 0.4rem;
        }
    }
    </style>
    