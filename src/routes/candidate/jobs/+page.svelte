 <div class="container-xxl">

    <div class="col-md-9 col-lg-10 px-4 py-4">

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
                                    <h3 class="mt-2 mb-0">8</h3>
                                    <p class="text-muted mb-0">Saved</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mb-3">
                            <div class="card stat-card" style="border-left-color: #3b82f6;">
                                <div class="card-body text-center">
                                    <i class="bi bi-send-fill text-primary" style="font-size: 2rem;"></i>
                                    <h3 class="mt-2 mb-0">12</h3>
                                    <p class="text-muted mb-0">Delegated</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mb-3">
                            <div class="card stat-card" style="border-left-color: #10b981;">
                                <div class="card-body text-center">
                                    <i class="bi bi-check-circle-fill text-success" style="font-size: 2rem;"></i>
                                    <h3 class="mt-2 mb-0">24</h3>
                                    <p class="text-muted mb-0">Applied</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mb-3">
                            <div class="card stat-card" style="border-left-color: #8b5cf6;">
                                <div class="card-body text-center">
                                    <i class="bi bi-people-fill text-purple" style="font-size: 2rem; color: #8b5cf6;"></i>
                                    <h3 class="mt-2 mb-0">5</h3>
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
                                        <input type="text" class="form-control" placeholder="Search by company or role...">
                                    </div>
                                </div>
                                <div class="col-md-2 mb-3 mb-md-0">
                                    <label class="form-label">Status</label>
                                    <select class="form-select">
                                        <option selected>All Statuses</option>
                                        <option>Saved</option>
                                        <option>Delegated</option>
                                        <option>Applied</option>
                                        <option>Interviewing</option>
                                        <option>Offer</option>
                                        <option>Rejected</option>
                                    </select>
                                </div>
                                <div class="col-md-2 mb-3 mb-md-0">
                                    <label class="form-label">Date Range</label>
                                    <select class="form-select">
                                        <option selected>Last 30 days</option>
                                        <option>Last 7 days</option>
                                        <option>Last 3 months</option>
                                        <option>All time</option>
                                    </select>
                                </div>
                                <div class="col-md-2 mb-3 mb-md-0">
                                    <label class="form-label">Sort By</label>
                                    <select class="form-select">
                                        <option selected>Most Recent</option>
                                        <option>Company (A-Z)</option>
                                        <option>Status</option>
                                        <option>Salary (High-Low)</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <button class="btn btn-outline-secondary w-100">
                                        <i class="bi bi-arrow-clockwise me-1"></i>Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Job Tabs -->
                    <ul class="nav nav-tabs mb-4" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#all-jobs">
                                All Jobs <span class="badge bg-secondary ms-2">49</span>
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#saved-jobs">
                                <i class="bi bi-bookmark-fill text-warning me-1"></i>Saved <span class="badge bg-secondary ms-2">8</span>
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#delegated-jobs">
                                <i class="bi bi-send-fill text-primary me-1"></i>Delegated <span class="badge bg-secondary ms-2">12</span>
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#applied-jobs">
                                <i class="bi bi-check-circle-fill text-success me-1"></i>Applied <span class="badge bg-secondary ms-2">24</span>
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#interviewing-jobs">
                                <i class="bi bi-people-fill me-1" style="color: #8b5cf6;"></i>Interviewing <span class="badge bg-secondary ms-2">5</span>
                            </button>
                        </li>
                    </ul>

                    <!-- Jobs List -->
                    <div class="tab-content">
                        <!-- All Jobs Tab -->
                        <div class="tab-pane fade show active" id="all-jobs">
                            <!-- Job Card 1 - Interviewing -->
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="row align-items-start">
                                        <div class="col-md-1 text-center mb-3 mb-md-0">
                                            <img src="https://ui-avatars.com/api/?name=TechCorp&background=4f46e5&color=fff&size=64" 
                                                 alt="TechCorp" class="rounded" width="64" height="64">
                                        </div>
                                        <div class="col-md-7">
                                            <div class="d-flex align-items-start mb-2">
                                                <div class="flex-grow-1">
                                                    <h5 class="mb-1">Senior Product Manager</h5>
                                                    <p class="text-muted mb-2">
                                                        <strong>TechCorp Inc.</strong> • San Francisco, CA (Remote)
                                                    </p>
                                                </div>
                                                <button class="btn btn-sm btn-link text-warning">
                                                    <i class="bi bi-bookmark-fill"></i>
                                                </button>
                                            </div>
                                            <div class="mb-2">
                                                <span class="badge bg-success me-2">$140k-$170k</span>
                                                <span class="badge bg-light text-dark me-2">Full-time</span>
                                                <span class="badge bg-light text-dark">Remote</span>
                                            </div>
                                            <p class="mb-2 small text-muted">
                                                <i class="bi bi-calendar me-1"></i>Applied: Nov 9, 2025 • 
                                                <i class="bi bi-clock ms-2 me-1"></i>Interview: Nov 15, 2025 at 2:00 PM
                                            </p>
                                            <div class="d-flex gap-2">
                                                <span class="badge" style="background-color: #8b5cf6;">
                                                    <i class="bi bi-people me-1"></i>Interviewing - Round 2
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
                                                <small class="text-muted">Last updated: 2 hours ago</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-3 p-2 bg-light rounded">
                                        <small>
                                            <strong>Next Step:</strong> Prepare for technical interview with hiring manager. 
                                            <a href="#" class="text-decoration-none">Review prep materials →</a>
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <!-- Job Card 2 - Applied -->
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="row align-items-start">
                                        <div class="col-md-1 text-center mb-3 mb-md-0">
                                            <img src="https://ui-avatars.com/api/?name=DataFlow&background=10b981&color=fff&size=64" 
                                                 alt="DataFlow" class="rounded" width="64" height="64">
                                        </div>
                                        <div class="col-md-7">
                                            <div class="d-flex align-items-start mb-2">
                                                <div class="flex-grow-1">
                                                    <h5 class="mb-1">Product Manager</h5>
                                                    <p class="text-muted mb-2">
                                                        <strong>DataFlow Systems</strong> • Seattle, WA (Hybrid)
                                                    </p>
                                                </div>
                                                <button class="btn btn-sm btn-link text-muted">
                                                    <i class="bi bi-bookmark"></i>
                                                </button>
                                            </div>
                                            <div class="mb-2">
                                                <span class="badge bg-success me-2">$130k-$160k</span>
                                                <span class="badge bg-light text-dark me-2">Full-time</span>
                                                <span class="badge bg-light text-dark">Hybrid</span>
                                            </div>
                                            <p class="mb-2 small text-muted">
                                                <i class="bi bi-calendar me-1"></i>Applied: Nov 8, 2025 • 
                                                <i class="bi bi-person ms-2 me-1"></i>Applied by: Michael Chen (Agent)
                                            </p>
                                            <div class="d-flex gap-2">
                                                <span class="badge bg-success">
                                                    <i class="bi bi-check-circle me-1"></i>Applied
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
                                                <small class="text-muted">Last updated: 1 day ago</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Job Card 3 - Delegated -->
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="row align-items-start">
                                        <div class="col-md-1 text-center mb-3 mb-md-0">
                                            <img src="https://ui-avatars.com/api/?name=Stripe&background=635bff&color=fff&size=64" 
                                                 alt="Stripe" class="rounded" width="64" height="64">
                                        </div>
                                        <div class="col-md-7">
                                            <div class="d-flex align-items-start mb-2">
                                                <div class="flex-grow-1">
                                                    <h5 class="mb-1">Senior PM, Platform</h5>
                                                    <p class="text-muted mb-2">
                                                        <strong>Stripe</strong> • San Francisco, CA (Remote)
                                                    </p>
                                                </div>
                                                <button class="btn btn-sm btn-link text-warning">
                                                    <i class="bi bi-bookmark-fill"></i>
                                                </button>
                                            </div>
                                            <div class="mb-2">
                                                <span class="badge bg-success me-2">$160k-$200k</span>
                                                <span class="badge bg-light text-dark me-2">Full-time</span>
                                                <span class="badge bg-light text-dark">Remote</span>
                                            </div>
                                            <p class="mb-2 small text-muted">
                                                <i class="bi bi-calendar me-1"></i>Saved: Nov 6, 2025 • 
                                                <i class="bi bi-send ms-2 me-1"></i>Delegated to agent: Nov 7, 2025
                                            </p>
                                            <div class="d-flex gap-2">
                                                <span class="badge bg-primary">
                                                    <i class="bi bi-send me-1"></i>Delegated - Agent reviewing
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
                                                        <li><a class="dropdown-item" href="#"><i class="bi bi-x-circle me-2"></i>Withdraw</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="mt-2">
                                                <small class="text-muted">Last updated: 3 days ago</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-3 p-2 bg-light rounded">
                                        <small>
                                            <strong><i class="bi bi-person-circle me-1"></i>Agent Note:</strong> Great fit for your skills! Tailoring your resume and will submit by end of week.
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <!-- Job Card 4 - Saved -->
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="row align-items-start">
                                        <div class="col-md-1 text-center mb-3 mb-md-0">
                                            <img src="https://ui-avatars.com/api/?name=Airbnb&background=ff5a5f&color=fff&size=64" 
                                                 alt="Airbnb" class="rounded" width="64" height="64">
                                        </div>
                                        <div class="col-md-7">
                                            <div class="d-flex align-items-start mb-2">
                                                <div class="flex-grow-1">
                                                    <h5 class="mb-1">Product Manager, Core Platform</h5>
                                                    <p class="text-muted mb-2">
                                                        <strong>Airbnb</strong> • San Francisco, CA (Hybrid)
                                                    </p>
                                                </div>
                                                <button class="btn btn-sm btn-link text-warning">
                                                    <i class="bi bi-bookmark-fill"></i>
                                                </button>
                                            </div>
                                            <div class="mb-2">
                                                <span class="badge bg-success me-2">$150k-$185k</span>
                                                <span class="badge bg-light text-dark me-2">Full-time</span>
                                                <span class="badge bg-light text-dark">Hybrid</span>
                                            </div>
                                            <p class="mb-2 small text-muted">
                                                <i class="bi bi-calendar me-1"></i>Saved: Nov 5, 2025 • 
                                                <i class="bi bi-link-45deg ms-2 me-1"></i>Source: LinkedIn
                                            </p>
                                            <div class="d-flex gap-2">
                                                <span class="badge bg-warning text-dark">
                                                    <i class="bi bi-bookmark me-1"></i>Saved
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-md-4 text-md-end">
                                            <div class="d-grid gap-2 d-md-block">
                                                <button class="btn btn-sm btn-primary mb-2 mb-md-0 me-md-2">
                                                    <i class="bi bi-send me-1"></i>Delegate to Agent
                                                </button>
                                                <div class="dropdown d-inline-block">
                                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                        <i class="bi bi-three-dots"></i>
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#"><i class="bi bi-eye me-2"></i>View Details</a></li>
                                                        <li><a class="dropdown-item" href="#"><i class="bi bi-pencil me-2"></i>Edit</a></li>
                                                        <li><a class="dropdown-item" href="#"><i class="bi bi-chat-dots me-2"></i>Message Agent</a></li>
                                                        <li><hr class="dropdown-divider"></li>
                                                        <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-bookmark-x me-2"></i>Remove</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="mt-2">
                                                <small class="text-muted">Last updated: 5 days ago</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Pagination -->
                            <nav>
                                <ul class="pagination justify-content-center">
                                    <li class="page-item disabled">
                                        <a class="page-link" href="#"><i class="bi bi-chevron-left"></i></a>
                                    </li>
                                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                                    <li class="page-item"><a class="page-link" href="#">4</a></li>
                                    <li class="page-item"><a class="page-link" href="#">5</a></li>
                                    <li class="page-item">
                                        <a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <!-- Other tabs would have similar content filtered by status -->
                        <div class="tab-pane fade" id="saved-jobs">
                            <div class="text-center py-5">
                                <i class="bi bi-bookmark" style="font-size: 4rem; color: #f59e0b;"></i>
                                <h4 class="mt-3">Saved Jobs</h4>
                                <p class="text-muted">Jobs you've bookmarked for later review</p>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="delegated-jobs">
                            <div class="text-center py-5">
                                <i class="bi bi-send" style="font-size: 4rem; color: #3b82f6;"></i>
                                <h4 class="mt-3">Delegated to Agent</h4>
                                <p class="text-muted">Jobs your agent is reviewing and preparing applications for</p>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="applied-jobs">
                            <div class="text-center py-5">
                                <i class="bi bi-check-circle" style="font-size: 4rem; color: #10b981;"></i>
                                <h4 class="mt-3">Applied Jobs</h4>
                                <p class="text-muted">Applications that have been submitted</p>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="interviewing-jobs">
                            <div class="text-center py-5">
                                <i class="bi bi-people" style="font-size: 4rem; color: #8b5cf6;"></i>
                                <h4 class="mt-3">Interviewing</h4>
                                <p class="text-muted">Jobs where you're in the interview process</p>
                            </div>
                        </div>
                    </div>
                </div>

                </div>
                </div>