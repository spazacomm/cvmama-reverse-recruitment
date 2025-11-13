<!-- Dashboard +page.svelte - Integration Example -->
<script lang="ts">
    import { user, supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import type { AuthSession } from '@supabase/supabase-js';
    import JobsSection from '$lib/components/JobSection.svelte';

    export let session: AuthSession;
  
    let profile = session?.user;
    let dashboardData = null;
    let recentActivity = [];
    let recentMessages = [];
    let documents = [];
    let loading = true;
  
    onMount(async () => {
        if (!session?.user) {
            goto('/');
            return;
        }
        
        await loadDashboardData();
    });
    
    async function loadDashboardData() {
        loading = true;
        try {
            const { data: dashboard, error: dashError } = await supabase
                .from('candidate_dashboard_view')
                .select('*')
                .eq('user_id', session?.user?.id)
                .single();
            
            if (dashError) throw dashError;
            dashboardData = dashboard;
            
            await loadRecentActivity(dashboard.candidate_id);
            await loadRecentMessages(session?.user?.id);
            await loadDocuments(dashboard.candidate_id);
            
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            loading = false;
        }
    }
    
    async function loadRecentActivity(candidateId) {
        try {
            const { data: jobs, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('candidate_id', candidateId)
                .order('updated_at', { ascending: false })
                .limit(4);
            
            if (error) throw error;
            
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
    
    function calculateProgress(used, limit) {
        if (!limit) return 0;
        return (used / limit) * 100;
    }
    
    $: agentHoursProgress = dashboardData ? 
        calculateProgress(dashboardData.agent_hours_used, dashboardData.agent_hours_limit) : 0;
</script>

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
            <div class="col-md-9 col-lg-12 px-4 py-2">
                <div class="row mb-4">
                    <!-- Sidebar -->
                    <div class="col-lg-3 mb-4">
                        <div class="position-sticky" style="top: 1rem;">
                            <!-- Career Agent Card -->
                            <div class="card mb-4">
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

                            <!-- Subscription Card -->
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h5 class="card-title mb-3">
                                        <i class="bi bi-credit-card text-primary me-2"></i>Subscription
                                    </h5>
                                    {#if dashboardData.plan_name}
                                        <div class="mb-3">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <h6 class="mb-0">{dashboardData.plan_name}</h6>
                                                <span class="badge bg-success">{dashboardData.subscription_status || 'Active'}</span>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <small class="text-muted">Agent Hours Used</small>
                                                <small class="fw-bold">
                                                    {dashboardData.agent_hours_used || 0} / {dashboardData.agent_hours_limit || 0} hrs
                                                </small>
                                            </div>
                                            <div class="progress" style="height: 8px;">
                                                <div class="progress-bar bg-primary" style="width: {agentHoursProgress}%"></div>
                                            </div>
                                        </div>
                                        <div class="d-grid gap-2">
                                            <button class="btn btn-outline-primary btn-sm" on:click={() => goto('/settings/subscription')}>
                                                <i class="bi bi-gear me-2"></i>Manage
                                            </button>
                                        </div>
                                    {:else}
                                        <div class="text-center py-4">
                                            <button class="btn btn-primary btn-sm" on:click={() => goto('/pricing')}>
                                                <i class="bi bi-star me-2"></i>View Plans
                                            </button>
                                        </div>
                                    {/if}
                                </div>
                            </div>

                            <!-- Quick Actions -->
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title mb-3">
                                        <i class="bi bi-lightning-charge text-primary me-2"></i>Quick Actions
                                    </h5>
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-outline-primary btn-sm" on:click={() => goto('/documents')}>
                                            <i class="bi bi-file-earmark-arrow-up me-2"></i>Upload Document
                                        </button>
                                        <button class="btn btn-outline-primary btn-sm" on:click={() => goto('/profile')}>
                                            <i class="bi bi-pencil-square me-2"></i>Update Profile
                                        </button>
                                        <button class="btn btn-outline-primary btn-sm" on:click={() => goto('/jobs')}>
                                            <i class="bi bi-search me-2"></i>Browse Jobs
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Main Content -->
                    <div class="col-lg-9 mb-4">
                        <!-- Welcome Header -->
                        <div class="row mb-2 mt-4">
                            <div class="col-12">
                                <h2 class="mb-1">Welcome, {dashboardData.full_name?.split(' ')[0] || 'there'}</h2>
                                <p class="text-muted">Here's what's happening with your job search today.</p>
                            </div>
                        </div>

                        <!-- Quick Stats -->
                        <div class="row mb-4">
                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h3 class="mb-0 fw-bold mb-2">{dashboardData.delegated_jobs || 0}</h3>
                                                <p class="text-muted mb-1">Delegated</p>
                                                <span class="badge fs-12 badge-soft-success">
                                                    <i class="ti ti-arrow-badge-up"></i> Active tracking
                                                </span>
                                            </div>
                                            <div class="avatar-lg">
                                                <span class="avatar-title bg-info-subtle text-info rounded-circle">
                                                    <i class="bx bx-send fs-32"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h3 class="mb-0 fw-bold mb-2">{dashboardData.applied_jobs || 0}</h3>
                                                <p class="text-muted mb-1">Applied</p>
                                                <span class="badge fs-12 badge-soft-success">
                                                    <i class="ti ti-arrow-badge-up"></i> In progress
                                                </span>
                                            </div>
                                            <div class="avatar-lg">
                                                <span class="avatar-title bg-primary-subtle text-primary rounded-circle">
                                                    <i class="bx bx-calendar fs-32"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h3 class="mb-0 fw-bold mb-2">{dashboardData.interviewing_jobs || 0}</h3>
                                                <p class="text-muted mb-1">Interview</p>
                                                <span class="badge fs-12 badge-soft-warning">
                                                    <i class="ti ti-hourglass"></i> Awaiting reply
                                                </span>
                                            </div>
                                            <div class="avatar-lg">
                                                <span class="avatar-title bg-warning-subtle text-warning rounded-circle">
                                                    <i class="bx bx-chat fs-32"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Jobs Section - NEW COMPONENT -->
                        {#if dashboardData.candidate_id}
                            <JobsSection 
                                candidateId={dashboardData.candidate_id} 
                                {session}
                            />
                        {/if}

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
                                                    <div class="activity-icon {activity.bgClass} bg-opacity-10 me-3">
                                                        <i class="bi bi-{activity.icon}"></i>
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <p class="mb-1"><strong>{activity.title}</strong></p>
                                                        <small class="text-muted">{activity.description}</small>
                                                        <div><small class="text-muted">{formatDate(activity.timestamp)}</small></div>
                                                    </div>
                                                </div>
                                            {/each}
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
                                        </h5>
                                        {#if recentMessages.length > 0}
                                            {#each recentMessages as message}
                                                <div class="activity-item d-flex align-items-start">
                                                    <img src={message.sender?.avatar_url || `https://ui-avatars.com/api/?name=User&size=40`}
                                                        alt={message.sender?.full_name} class="rounded-circle me-3" width="40" height="40">
                                                    <div class="flex-grow-1">
                                                        <strong>{message.sender?.full_name || 'Agent'}</strong>
                                                        <p class="mb-0 text-muted small">{message.content?.substring(0, 80)}...</p>
                                                    </div>
                                                </div>
                                            {/each}
                                            <div class="d-grid mt-3">
                                                <button class="btn btn-primary btn-sm" on:click={() => goto('/messages')}>
                                                    <i class="bi bi-chat-left-text me-2"></i>Open Messages
                                                </button>
                                            </div>
                                        {:else}
                                            <div class="text-center py-4">
                                                <i class="bi bi-chat-dots" style="font-size: 2rem; color: #ccc;"></i>
                                                <p class="text-muted mt-3 mb-0">No messages yet</p>
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
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
    
    .avatar-lg {
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
    
    .badge-soft-success {
        background-color: rgba(40, 199, 111, 0.1);
        color: #28c76f;
    }
    
    .badge-soft-warning {
        background-color: rgba(251, 191, 36, 0.1);
        color: #fbbf24;
    }
</style>