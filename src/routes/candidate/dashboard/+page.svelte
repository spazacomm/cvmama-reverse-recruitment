<script>
    import { user, supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
  
    let profile;
    let dashboardData = null;
    let recentActivity = [];
    let recentMessages = [];
    let documents = [];
    let loading = true;
    
    const unsubscribe = user.subscribe(value => profile = value);
  
    onMount(async () => {
        if (!profile || profile.role !== 'candidate') {
            goto('/login');
            return;
        }
        
        await loadDashboardData();
    });
    
    async function loadDashboardData() {
        loading = true;
        try {
            const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            
            // Load dashboard view
            const { data: dashboard, error: dashError } = await supabase
                .from('candidate_dashboard_view')
                .select('*')
                .eq('user_id', authUser.id)
                .single();
            
            if (dashError) throw dashError;
            dashboardData = dashboard;
            
            // Load recent activity (last 4 activities)
            await loadRecentActivity(dashboard.candidate_id);
            
            // Load recent messages
            await loadRecentMessages(authUser.id);
            
            // Load documents
            await loadDocuments(dashboard.candidate_id);
            
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            loading = false;
        }
    }
    
    async function loadRecentActivity(candidateId) {
        try {
            // Get recent job activities
            const { data: jobs, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('candidate_id', candidateId)
                .order('updated_at', { ascending: false })
                .limit(4);
            
            if (error) throw error;
            
            // Transform jobs into activity items
            recentActivity = jobs.map(job => {
                let activityType = 'updated';
                let icon = 'file-earmark-text';
                let bgClass = 'bg-primary';
                let title = 'Job updated';
                let description = `${job.job_title} at ${job.company_name}`;
                
                if (job.status === 'applied' && job.applied_at) {
                    activityType = 'applied';
                    icon = 'send';
                    bgClass = 'bg-success';
                    title = 'Application sent';
                } else if (job.status === 'interviewing' && job.next_interview_date) {
                    activityType = 'interview';
                    icon = 'calendar-event';
                    bgClass = 'bg-warning';
                    title = 'Interview scheduled';
                } else if (job.status === 'delegated') {
                    activityType = 'delegated';
                    icon = 'robot';
                    bgClass = 'bg-info';
                    title = 'Delegated to agent';
                }
                
                return {
                    type: activityType,
                    icon,
                    bgClass,
                    title,
                    description,
                    timestamp: job.updated_at
                };
            });
            
        } catch (error) {
            console.error('Error loading activity:', error);
        }
    }
    
    async function loadRecentMessages(userId) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*, sender:sender_id(full_name, avatar_url)')
                .eq('recipient_id', userId)
                .order('created_at', { ascending: false })
                .limit(3);
            
            if (error) throw error;
            recentMessages = data || [];
            
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }
    
    async function loadDocuments(candidateId) {
        try {
            // For now, we'll create mock data since documents aren't in the schema
            // In production, you'd query a documents table or storage bucket
            const { data: candidate } = await supabase
                .from('candidates')
                .select('resume_url, resume_updated_at')
                .eq('id', candidateId)
                .single();
            
            if (candidate?.resume_url) {
                documents = [
                    {
                        name: 'Resume_' + dashboardData.full_name.replace(' ', '_') + '_2025.pdf',
                        type: 'Resume',
                        modified: candidate.resume_updated_at || new Date(),
                        url: candidate.resume_url,
                        shared: true
                    }
                ];
            }
            
        } catch (error) {
            console.error('Error loading documents:', error);
        }
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        
        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    function formatTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    
    function getDaysActive() {
        if (!dashboardData) return 0;
        const created = new Date(dashboardData.created_at || Date.now());
        const now = new Date();
        return Math.floor((now - created) / (1000 * 60 * 60 * 24));
    }
    
    function calculateProgress(used, limit) {
        if (!limit) return 0;
        return (used / limit) * 100;
    }
    
    function getAgentInitials(name) {
        if (!name) return 'AG';
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }
    
    $: totalApplications = dashboardData ? 
        (dashboardData.saved_jobs + dashboardData.delegated_jobs + 
         dashboardData.applied_jobs + dashboardData.interviewing_jobs) : 0;
    
    $: pendingResponses = dashboardData ? 
        (dashboardData.applied_jobs - dashboardData.interviewing_jobs) : 0;
    
    $: agentHoursProgress = dashboardData ? 
        calculateProgress(dashboardData.agent_hours_used, dashboardData.agent_hours_limit) : 0;
</script>

<!-- Start Container -->
<div class="container-xxl">
   

    {#if loading}
        <div class="row">
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    {:else if dashboardData}
        <div class="row">
            <!-- Main Content -->
            <div class="col-md-9 col-lg-10 px-4 py-4">
                <!-- Welcome Header -->
                <div class="row mb-4">
                    <div class="col-12">
                        <h2 class="mb-1">Welcome, {dashboardData.full_name?.split(' ')[0] || 'there'}</h2>
                        <p class="text-muted">Here's what's happening with your job search today.</p>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="row mb-4">
                    <div class="col-md-3 mb-3">
                        <div class="card stat-card">
                            <div class="card-body">
                                <h6 class="text-muted mb-2">Applications Sent</h6>
                                <h3 class="mb-0">{dashboardData.applied_jobs || 0}</h3>
                                <small class="text-success">
                                    <i class="bi bi-arrow-up"></i> Active tracking
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card stat-card" style="border-left-color: #10b981;">
                            <div class="card-body">
                                <h6 class="text-muted mb-2">Interviews</h6>
                                <h3 class="mb-0">{dashboardData.interviewing_jobs || 0}</h3>
                                <small class="text-success">
                                    <i class="bi bi-arrow-up"></i> In progress
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card stat-card" style="border-left-color: #f59e0b;">
                            <div class="card-body">
                                <h6 class="text-muted mb-2">Pending Responses</h6>
                                <h3 class="mb-0">{pendingResponses >= 0 ? pendingResponses : 0}</h3>
                                <small class="text-muted">Awaiting reply</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card stat-card" style="border-left-color: #ef4444;">
                            <div class="card-body">
                                <h6 class="text-muted mb-2">Days Active</h6>
                                <h3 class="mb-0">{getDaysActive()}</h3>
                                <small class="text-muted">Since joining</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <!-- Your Career Agent -->
                    <div class="col-lg-4 mb-4">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title mb-3">
                                    <i class="bi bi-person-badge text-primary me-2"></i>Your Career Agent
                                </h5>
                                {#if dashboardData.agent_name}
                                    <div class="text-center mb-3">
                                        <img src={dashboardData.agent_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(dashboardData.agent_name)}&background=7c3aed&color=fff&size=80`}
                                             alt="Agent" class="agent-avatar rounded-circle mb-3" width="80" height="80">
                                        <h6 class="mb-1">{dashboardData.agent_name}</h6>
                                        <p class="text-muted small mb-2">Career Specialist</p>
                                        <span class="badge bg-success">Active</span>
                                    </div>
                                    <div class="mb-3">
                                        <small class="text-muted d-block mb-1">Working on:</small>
                                        <span class="badge bg-light text-dark me-1">{dashboardData.delegated_jobs || 0} Jobs</span>
                                        <span class="badge bg-light text-dark">{dashboardData.applied_jobs || 0} Applications</span>
                                    </div>
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-primary btn-sm" on:click={() => goto('/messages')}>
                                            <i class="bi bi-chat-dots me-2"></i>Send Message
                                        </button>
                                        <button class="btn btn-outline-secondary btn-sm">
                                            <i class="bi bi-person me-2"></i>View Full Profile
                                        </button>
                                    </div>
                                {:else}
                                    <div class="text-center py-4">
                                        <i class="bi bi-person-plus" style="font-size: 3rem; color: #ccc;"></i>
                                        <p class="text-muted mt-3 mb-3">No agent assigned yet</p>
                                        <button class="btn btn-primary btn-sm">
                                            <i class="bi bi-search me-2"></i>Find an Agent
                                        </button>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>

                    <!-- Subscription Status -->
                    <div class="col-lg-4 mb-4">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title mb-3">
                                    <i class="bi bi-credit-card text-primary me-2"></i>Subscription
                                </h5>
                                {#if dashboardData.plan_name}
                                    <div class="mb-3">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h6 class="mb-0">{dashboardData.plan_name}</h6>
                                            <span class="badge badge-plan">{dashboardData.subscription_status || 'Active'}</span>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <small class="text-muted">Agent Hours Used</small>
                                            <small class="fw-bold">
                                                {dashboardData.agent_hours_used || 0} / {dashboardData.agent_hours_limit || 0} hrs
                                            </small>
                                        </div>
                                        <div class="progress progress-thin">
                                            <div class="progress-bar bg-primary" style="width: {agentHoursProgress}%"></div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <small class="text-muted">Jobs Tracked</small>
                                            <small class="fw-bold">
                                                {dashboardData.jobs_used || 0} / {dashboardData.jobs_limit || '∞'}
                                            </small>
                                        </div>
                                        {#if dashboardData.jobs_limit}
                                            <div class="progress progress-thin">
                                                <div class="progress-bar bg-success" 
                                                     style="width: {calculateProgress(dashboardData.jobs_used, dashboardData.jobs_limit)}%"></div>
                                            </div>
                                        {/if}
                                    </div>
                                    {#if dashboardData.current_period_end}
                                        <div class="mb-3">
                                            <small class="text-muted d-block">Next billing date:</small>
                                            <strong>{formatDate(dashboardData.current_period_end)}</strong>
                                        </div>
                                    {/if}
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-outline-primary btn-sm" on:click={() => goto('/settings/subscription')}>
                                            <i class="bi bi-gear me-2"></i>Manage Subscription
                                        </button>
                                        <button class="btn btn-outline-secondary btn-sm" on:click={() => goto('/pricing')}>
                                            <i class="bi bi-arrow-up-circle me-2"></i>Upgrade Plan
                                        </button>
                                    </div>
                                {:else}
                                    <div class="text-center py-4">
                                        <i class="bi bi-credit-card-2-front" style="font-size: 3rem; color: #ccc;"></i>
                                        <p class="text-muted mt-3 mb-3">No active subscription</p>
                                        <button class="btn btn-primary btn-sm" on:click={() => goto('/pricing')}>
                                            <i class="bi bi-star me-2"></i>View Plans
                                        </button>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="col-lg-4 mb-4">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title mb-3">
                                    <i class="bi bi-lightning-charge text-primary me-2"></i>Quick Actions
                                </h5>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-outline-primary" on:click={() => goto('/documents')}>
                                        <i class="bi bi-file-earmark-arrow-up me-2"></i>Upload Document
                                    </button>
                                    <button class="btn btn-outline-primary" on:click={() => goto('/profile')}>
                                        <i class="bi bi-pencil-square me-2"></i>Update Profile
                                    </button>
                                    <button class="btn btn-outline-primary" on:click={() => goto('/schedule')}>
                                        <i class="bi bi-calendar-check me-2"></i>Schedule Call
                                    </button>
                                    <button class="btn btn-outline-primary" on:click={() => goto('/jobs')}>
                                        <i class="bi bi-search me-2"></i>Browse Jobs
                                    </button>
                                </div>
                                <div class="mt-4 p-3 bg-light rounded">
                                    <h6 class="mb-2"><i class="bi bi-lightbulb text-warning me-2"></i>Tip of the Day</h6>
                                    <p class="small mb-0 text-muted">Tailor your resume for each application. Highlight skills that match the job description to increase your chances of getting noticed.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity & Messages -->
                <div class="row">
                    <div class="col-lg-6 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title mb-3">
                                    <i class="bi bi-clock-history text-primary me-2"></i>Recent Activity
                                </h5>
                                {#if recentActivity.length > 0}
                                    {#each recentActivity as activity}
                                        <div class="activity-item d-flex">
                                            <div class="activity-icon {activity.bgClass} bg-opacity-10 text-{activity.bgClass.replace('bg-', '')} me-3">
                                                <i class="bi bi-{activity.icon}"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <p class="mb-1"><strong>{activity.title}</strong></p>
                                                <small class="text-muted">{activity.description}</small>
                                                <div><small class="text-muted">{formatDate(activity.timestamp)}</small></div>
                                            </div>
                                        </div>
                                    {/each}
                                    <div class="text-center mt-3">
                                        <a href="/jobs" class="text-decoration-none">View all activity <i class="bi bi-arrow-right"></i></a>
                                    </div>
                                {:else}
                                    <div class="text-center py-4">
                                        <i class="bi bi-clock-history" style="font-size: 2rem; color: #ccc;"></i>
                                        <p class="text-muted mt-3 mb-0">No recent activity</p>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title mb-3">
                                    <i class="bi bi-chat-dots text-primary me-2"></i>Recent Messages
                                    {#if dashboardData.unread_messages > 0}
                                        <span class="badge bg-danger ms-2">{dashboardData.unread_messages}</span>
                                    {/if}
                                </h5>
                                {#if recentMessages.length > 0}
                                    {#each recentMessages as message}
                                        <div class="activity-item d-flex align-items-start">
                                            <img src={message.sender?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender?.full_name || 'User')}&background=7c3aed&color=fff&size=40`}
                                                 alt={message.sender?.full_name} class="rounded-circle me-3" width="40" height="40">
                                            <div class="flex-grow-1">
                                                <div class="d-flex justify-content-between align-items-start">
                                                    <strong>{message.sender?.full_name || 'Agent'}</strong>
                                                    <small class="text-muted">{formatTime(message.created_at)}</small>
                                                </div>
                                                <p class="mb-0 text-muted small">{message.content?.substring(0, 80)}{message.content?.length > 80 ? '...' : ''}</p>
                                                {#if !message.is_read}
                                                    <span class="badge bg-danger badge-sm mt-1">New</span>
                                                {/if}
                                            </div>
                                        </div>
                                    {/each}
                                    <div class="d-grid mt-3">
                                        <button class="btn btn-primary" on:click={() => goto('/messages')}>
                                            <i class="bi bi-chat-left-text me-2"></i>Open Messages
                                        </button>
                                    </div>
                                {:else}
                                    <div class="text-center py-4">
                                        <i class="bi bi-chat-dots" style="font-size: 2rem; color: #ccc;"></i>
                                        <p class="text-muted mt-3 mb-3">No messages yet</p>
                                        {#if dashboardData.agent_name}
                                            <button class="btn btn-primary btn-sm" on:click={() => goto('/messages')}>
                                                <i class="bi bi-chat-left-text me-2"></i>Send a message
                                            </button>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Documents Section -->
                <div class="row">
                    <div class="col-12 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="card-title mb-0">
                                        <i class="bi bi-file-earmark-text text-primary me-2"></i>Your Documents
                                    </h5>
                                    <button class="btn btn-sm btn-primary" on:click={() => goto('/documents')}>
                                        <i class="bi bi-plus-circle me-1"></i>Upload New
                                    </button>
                                </div>
                                {#if documents.length > 0}
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Document Name</th>
                                                    <th>Type</th>
                                                    <th>Last Modified</th>
                                                    <th>Shared</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {#each documents as doc}
                                                    <tr>
                                                        <td>
                                                            <i class="bi bi-file-pdf text-danger me-2"></i>{doc.name}
                                                        </td>
                                                        <td><span class="badge bg-primary">{doc.type}</span></td>
                                                        <td>{formatDate(doc.modified)}</td>
                                                        <td>
                                                            {#if doc.shared}
                                                                <i class="bi bi-check-circle-fill text-success"></i> With agent
                                                            {:else}
                                                                <i class="bi bi-x-circle text-muted"></i> Private
                                                            {/if}
                                                        </td>
                                                        <td>
                                                            <a href={doc.url} target="_blank" class="btn btn-sm btn-outline-primary me-1">
                                                                <i class="bi bi-download"></i>
                                                            </a>
                                                            <button class="btn btn-sm btn-outline-danger">
                                                                <i class="bi bi-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                {/each}
                                            </tbody>
                                        </table>
                                    </div>
                                {:else}
                                    <div class="text-center py-4">
                                        <i class="bi bi-file-earmark" style="font-size: 3rem; color: #ccc;"></i>
                                        <p class="text-muted mt-3 mb-3">No documents uploaded yet</p>
                                        <button class="btn btn-primary btn-sm" on:click={() => goto('/documents')}>
                                            <i class="bi bi-upload me-2"></i>Upload your first document
                                        </button>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- end row-->
    {/if}
</div>
<!-- End Container -->

<style>
    .stat-card {
        border-left: 4px solid #3b82f6;
        transition: transform 0.2s;
    }
    
    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .activity-item {
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .activity-item:last-child {
        border-bottom: none;
    }
    
    .activity-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        flex-shrink: 0;
    }
    
    .agent-avatar {
        border: 3px solid #f0f0f0;
    }
    
    .badge-plan {
        background-color: #10b981;
        color: white;
        text-transform: capitalize;
    }
    
    .progress-thin {
        height: 8px;
        border-radius: 4px;
    }
    
    .card {
        transition: box-shadow 0.2s;
    }
    
    .card:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
</style>