<script>
    import { user } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
  
    let profile;
    const unsubscribe = user.subscribe(value => profile = value);
  
    onMount(() => {
      if (!profile || profile.role !== 'candidate') {
        goto('/login');
      }
    });
  
  
  </script>


  <!-- Start Container -->
  <div class="container-xxl">
    <!-- ========== Page Title Start ========== -->
    <div class="row">
        <div class="col-12">
            <div class="page-title-box">
                <h4 class="mb-0 fw-semibold"> Overview</h4>
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item">
                        <a href="javascript: void(0);">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item active">Overview</li>
                </ol>
            </div>
        </div>
    </div>
    <!-- ========== Page Title End ========== -->


    <div class="row">


         <!-- Main Content -->
            <div class="col-md-9 col-lg-10 px-4 py-4">
                <!-- Welcome Header -->
                <div class="row mb-4">
                    <div class="col-12">
                        <h2 class="mb-1">Welcome back, Sarah! 👋</h2>
                        <p class="text-muted">Here's what's happening with your job search today.</p>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="row mb-4">
                    <div class="col-md-3 mb-3">
                        <div class="card stat-card">
                            <div class="card-body">
                                <h6 class="text-muted mb-2">Applications Sent</h6>
                                <h3 class="mb-0">24</h3>
                                <small class="text-success"><i class="bi bi-arrow-up"></i> +6 this week</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card stat-card" style="border-left-color: #10b981;">
                            <div class="card-body">
                                <h6 class="text-muted mb-2">Interviews</h6>
                                <h3 class="mb-0">5</h3>
                                <small class="text-success"><i class="bi bi-arrow-up"></i> +2 this week</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card stat-card" style="border-left-color: #f59e0b;">
                            <div class="card-body">
                                <h6 class="text-muted mb-2">Pending Responses</h6>
                                <h3 class="mb-0">12</h3>
                                <small class="text-muted">Awaiting reply</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card stat-card" style="border-left-color: #ef4444;">
                            <div class="card-body">
                                <h6 class="text-muted mb-2">Days Active</h6>
                                <h3 class="mb-0">23</h3>
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
                                <div class="text-center mb-3">
                                    <img src="https://ui-avatars.com/api/?name=Michael+Chen&background=7c3aed&color=fff&size=80" 
                                         alt="Agent" class="agent-avatar rounded-circle mb-3">
                                    <h6 class="mb-1">Michael Chen</h6>
                                    <p class="text-muted small mb-2">Tech Recruiter • 8 years exp.</p>
                                    <span class="badge bg-success">Active</span>
                                </div>
                                <div class="mb-3">
                                    <small class="text-muted d-block mb-1">Specializations:</small>
                                    <span class="badge bg-light text-dark me-1">Software Engineering</span>
                                    <span class="badge bg-light text-dark me-1">Product Management</span>
                                </div>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary btn-sm">
                                        <i class="bi bi-chat-dots me-2"></i>Send Message
                                    </button>
                                    <button class="btn btn-outline-secondary btn-sm">
                                        <i class="bi bi-person me-2"></i>View Full Profile
                                    </button>
                                </div>
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
                                <div class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h6 class="mb-0">Professional Plan</h6>
                                        <span class="badge badge-plan">Active</span>
                                    </div>
                                    <h4 class="mb-0">$249<small class="text-muted">/month</small></h4>
                                </div>
                                <div class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <small class="text-muted">Agent Hours Used</small>
                                        <small class="fw-bold">2.5 / 4 hrs</small>
                                    </div>
                                    <div class="progress progress-thin">
                                        <div class="progress-bar bg-primary" style="width: 62.5%"></div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <small class="text-muted d-block">Next billing date:</small>
                                    <strong>December 11, 2025</strong>
                                </div>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-outline-primary btn-sm">
                                        <i class="bi bi-gear me-2"></i>Manage Subscription
                                    </button>
                                    <button class="btn btn-outline-secondary btn-sm">
                                        <i class="bi bi-arrow-up-circle me-2"></i>Upgrade Plan
                                    </button>
                                </div>
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
                                    <button class="btn btn-outline-primary">
                                        <i class="bi bi-file-earmark-arrow-up me-2"></i>Upload Document
                                    </button>
                                    <button class="btn btn-outline-primary">
                                        <i class="bi bi-pencil-square me-2"></i>Update Profile
                                    </button>
                                    <button class="btn btn-outline-primary">
                                        <i class="bi bi-calendar-check me-2"></i>Schedule Call
                                    </button>
                                    <button class="btn btn-outline-primary">
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
                                <div class="activity-item d-flex">
                                    <div class="activity-icon bg-primary bg-opacity-10 text-primary me-3">
                                        <i class="bi bi-file-earmark-text"></i>
                                    </div>
                                    <div class="flex-grow-1">
                                        <p class="mb-1"><strong>Resume updated</strong></p>
                                        <small class="text-muted">Michael reviewed your new resume</small>
                                        <div><small class="text-muted">2 hours ago</small></div>
                                    </div>
                                </div>
                                <div class="activity-item d-flex">
                                    <div class="activity-icon bg-success bg-opacity-10 text-success me-3">
                                        <i class="bi bi-send"></i>
                                    </div>
                                    <div class="flex-grow-1">
                                        <p class="mb-1"><strong>Application sent</strong></p>
                                        <small class="text-muted">Senior Product Manager at TechCorp</small>
                                        <div><small class="text-muted">5 hours ago</small></div>
                                    </div>
                                </div>
                                <div class="activity-item d-flex">
                                    <div class="activity-icon bg-warning bg-opacity-10 text-warning me-3">
                                        <i class="bi bi-calendar-event"></i>
                                    </div>
                                    <div class="flex-grow-1">
                                        <p class="mb-1"><strong>Interview scheduled</strong></p>
                                        <small class="text-muted">DataFlow Inc. - First round</small>
                                        <div><small class="text-muted">Yesterday</small></div>
                                    </div>
                                </div>
                                <div class="activity-item d-flex">
                                    <div class="activity-icon bg-info bg-opacity-10 text-info me-3">
                                        <i class="bi bi-chat-dots"></i>
                                    </div>
                                    <div class="flex-grow-1">
                                        <p class="mb-1"><strong>New message</strong></p>
                                        <small class="text-muted">Michael sent you interview prep materials</small>
                                        <div><small class="text-muted">2 days ago</small></div>
                                    </div>
                                </div>
                                <div class="text-center mt-3">
                                    <a href="#" class="text-decoration-none">View all activity <i class="bi bi-arrow-right"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title mb-3">
                                    <i class="bi bi-chat-dots text-primary me-2"></i>Recent Messages
                                    <span class="badge bg-danger ms-2">3</span>
                                </h5>
                                <div class="activity-item d-flex align-items-start">
                                    <img src="https://ui-avatars.com/api/?name=Michael+Chen&background=7c3aed&color=fff&size=40" 
                                         alt="Michael" class="rounded-circle me-3" width="40" height="40">
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between align-items-start">
                                            <strong>Michael Chen</strong>
                                            <small class="text-muted">10:30 AM</small>
                                        </div>
                                        <p class="mb-0 text-muted small">Great news! I found a perfect match for your profile. Let's discuss the Senior PM role at...</p>
                                        <span class="badge bg-danger badge-sm mt-1">New</span>
                                    </div>
                                </div>
                                <div class="activity-item d-flex align-items-start">
                                    <img src="https://ui-avatars.com/api/?name=Michael+Chen&background=7c3aed&color=fff&size=40" 
                                         alt="Michael" class="rounded-circle me-3" width="40" height="40">
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between align-items-start">
                                            <strong>Michael Chen</strong>
                                            <small class="text-muted">Yesterday</small>
                                        </div>
                                        <p class="mb-0 text-muted small">I've reviewed your updated resume. Here are a few suggestions to make it even stronger...</p>
                                    </div>
                                </div>
                                <div class="activity-item d-flex align-items-start">
                                    <img src="https://ui-avatars.com/api/?name=Michael+Chen&background=7c3aed&color=fff&size=40" 
                                         alt="Michael" class="rounded-circle me-3" width="40" height="40">
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between align-items-start">
                                            <strong>Michael Chen</strong>
                                            <small class="text-muted">Nov 9</small>
                                        </div>
                                        <p class="mb-0 text-muted small">How did the interview with DataFlow go? Let me know if you need any follow-up support.</p>
                                    </div>
                                </div>
                                <div class="d-grid mt-3">
                                    <button class="btn btn-primary">
                                        <i class="bi bi-chat-left-text me-2"></i>Open Messages
                                    </button>
                                </div>
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
                                    <button class="btn btn-sm btn-primary">
                                        <i class="bi bi-plus-circle me-1"></i>Upload New
                                    </button>
                                </div>
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
                                            <tr>
                                                <td><i class="bi bi-file-pdf text-danger me-2"></i>Resume_SarahJohnson_2025.pdf</td>
                                                <td><span class="badge bg-primary">Resume</span></td>
                                                <td>Nov 10, 2025</td>
                                                <td><i class="bi bi-check-circle-fill text-success"></i> With agent</td>
                                                <td>
                                                    <button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-download"></i></button>
                                                    <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><i class="bi bi-file-word text-primary me-2"></i>CoverLetter_TechCorp.docx</td>
                                                <td><span class="badge bg-info">Cover Letter</span></td>
                                                <td>Nov 9, 2025</td>
                                                <td><i class="bi bi-check-circle-fill text-success"></i> With agent</td>
                                                <td>
                                                    <button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-download"></i></button>
                                                    <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><i class="bi bi-file-pdf text-danger me-2"></i>Portfolio_Projects.pdf</td>
                                                <td><span class="badge bg-success">Portfolio</span></td>
                                                <td>Nov 5, 2025</td>
                                                <td><i class="bi bi-check-circle-fill text-success"></i> With agent</td>
                                                <td>
                                                    <button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-download"></i></button>
                                                    <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
    
       
    </div>
    <!-- end row-->

   


</div>
<!-- End Container -->
  