<div class="container-xxl">

    <div class="col-md-9 col-lg-10 px-4 py-4">

                <div id="accounts-page" class="page-section">
                    <div class="row mb-3">
                        <div class="col-12">
                            <h2 class="mb-1">Linked Accounts</h2>
                            <p class="text-muted">Connect your accounts to enable your agent to apply for jobs on your behalf</p>
                        </div>
                    </div>

                    <!-- Info Banner -->
                    <div class="alert alert-info d-flex align-items-start mb-4" role="alert">
                        <i class="bi bi-info-circle-fill me-3 flex-shrink-0" style="font-size: 1.5rem;"></i>
                        <div>
                            <h6 class="alert-heading mb-2">Why Link Your Accounts?</h6>
                            <p class="mb-2">Linking your accounts allows your career agent to:</p>
                            <ul class="mb-0">
                                <li>Apply to jobs directly on your behalf</li>
                                <li>Manage your job applications efficiently</li>
                                <li>Track all applications in one place</li>
                                <li>Respond to employer communications quickly</li>
                            </ul>
                            <p class="mb-0 mt-2"><strong>Security:</strong> All credentials are encrypted and securely stored. Your agent will only use these accounts for job search activities with your permission.</p>
                        </div>
                    </div>

                    <!-- Account Options -->
                    <div class="row mb-4">
                        <div class="col-12">
                            <h5 class="mb-3">Choose Your Preference</h5>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100 border-primary" style="cursor: pointer;">
                                        <div class="card-body text-center">
                                            <i class="bi bi-key-fill text-primary" style="font-size: 3rem;"></i>
                                            <h5 class="mt-3">Use My Existing Accounts</h5>
                                            <p class="text-muted">Connect your existing email and job site accounts. You maintain full control and access.</p>
                                            <div class="form-check mt-3">
                                                <input class="form-check-input" type="radio" name="accountMode" id="existingMode" checked>
                                                <label class="form-check-label" for="existingMode">
                                                    I'll provide my credentials
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100 border-secondary" style="cursor: pointer;">
                                        <div class="card-body text-center">
                                            <i class="bi bi-plus-circle-fill text-secondary" style="font-size: 3rem;"></i>
                                            <h5 class="mt-3">Create Dedicated Accounts</h5>
                                            <p class="text-muted">We'll create separate job search accounts for you. Keep your personal accounts private.</p>
                                            <div class="form-check mt-3">
                                                <input class="form-check-input" type="radio" name="accountMode" id="dedicatedMode">
                                                <label class="form-check-label" for="dedicatedMode">
                                                    Create new accounts for me
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Email Account -->
                    <div class="card mb-4">
                        <div class="card-header bg-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="mb-0">
                                        <i class="bi bi-envelope-fill text-primary me-2"></i>Email Account
                                    </h5>
                                    <small class="text-muted">For receiving job alerts and employer communications</small>
                                </div>
                                <span class="badge bg-success">Connected</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <div class="d-flex align-items-center mb-3">
                                        <i class="bi bi-envelope-check-fill text-success me-3" style="font-size: 2rem;"></i>
                                        <div>
                                            <h6 class="mb-0">sarah.johnson@example.com</h6>
                                            <small class="text-muted">Connected on Nov 1, 2025</small>
                                        </div>
                                    </div>
                                    <div class="alert alert-success mb-0">
                                        <small><i class="bi bi-check-circle me-1"></i> Your agent can now manage job-related emails on your behalf</small>
                                    </div>
                                </div>
                                <div class="col-md-4 text-md-end">
                                    <button class="btn btn-outline-primary mb-2 w-100" data-bs-toggle="modal" data-bs-target="#emailSettingsModal">
                                        <i class="bi bi-gear me-1"></i>Settings
                                    </button>
                                    <button class="btn btn-outline-danger w-100" data-bs-toggle="modal" data-bs-target="#disconnectModal">
                                        <i class="bi bi-x-circle me-1"></i>Disconnect
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- LinkedIn Account -->
                    <div class="card mb-4">
                        <div class="card-header bg-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="mb-0">
                                        <i class="bi bi-linkedin text-primary me-2"></i>LinkedIn
                                    </h5>
                                    <small class="text-muted">For Easy Apply and networking opportunities</small>
                                </div>
                                <span class="badge bg-success">Connected</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <div class="d-flex align-items-center mb-3">
                                        <img src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=0077b5&color=fff&size=64" 
                                             alt="LinkedIn" class="rounded-circle me-3" width="64" height="64">
                                        <div>
                                            <h6 class="mb-0">Sarah Johnson</h6>
                                            <small class="text-muted">linkedin.com/in/sarahjohnson</small><br>
                                            <small class="text-muted">Connected on Nov 1, 2025</small>
                                        </div>
                                    </div>
                                    <div class="alert alert-warning mb-0">
                                        <small><i class="bi bi-exclamation-triangle me-1"></i> LinkedIn Easy Apply permissions expire in 30 days. You'll need to reconnect.</small>
                                    </div>
                                </div>
                                <div class="col-md-4 text-md-end">
                                    <button class="btn btn-outline-primary mb-2 w-100">
                                        <i class="bi bi-arrow-clockwise me-1"></i>Refresh Connection
                                    </button>
                                    <button class="btn btn-outline-danger w-100" data-bs-toggle="modal" data-bs-target="#disconnectModal">
                                        <i class="bi bi-x-circle me-1"></i>Disconnect
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Job Sites Section -->
                    <h5 class="mb-3">Job Sites</h5>

                    <!-- Indeed -->
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-1 text-center">
                                    <img src="https://ui-avatars.com/api/?name=Indeed&background=2164f3&color=fff&size=64" 
                                         alt="Indeed" class="rounded" width="64" height="64">
                                </div>
                                <div class="col-md-7">
                                    <h6 class="mb-1">Indeed</h6>
                                    <p class="text-muted mb-2">World's largest job site with millions of listings</p>
                                    <span class="badge bg-success">Connected</span>
                                    <small class="text-muted ms-2">• Connected on Nov 2, 2025</small>
                                </div>
                                <div class="col-md-4 text-md-end">
                                    <button class="btn btn-sm btn-outline-primary me-2">
                                        <i class="bi bi-gear"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#disconnectModal">
                                        <i class="bi bi-x-circle me-1"></i>Disconnect
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Fuzu -->
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-1 text-center">
                                    <img src="https://ui-avatars.com/api/?name=Fuzu&background=00a86b&color=fff&size=64" 
                                         alt="Fuzu" class="rounded" width="64" height="64">
                                </div>
                                <div class="col-md-7">
                                    <h6 class="mb-1">Fuzu</h6>
                                    <p class="text-muted mb-2">Leading job portal in East Africa</p>
                                    <span class="badge bg-secondary">Not Connected</span>
                                </div>
                                <div class="col-md-4 text-md-end">
                                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#connectAccountModal" >
                                        <i class="bi bi-plus-circle me-1"></i>Connect Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- BrighterMonday -->
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-1 text-center">
                                    <img src="https://ui-avatars.com/api/?name=BrighterMonday&background=ff6b35&color=fff&size=64" 
                                         alt="BrighterMonday" class="rounded" width="64" height="64">
                                </div>
                                <div class="col-md-7">
                                    <h6 class="mb-1">BrighterMonday</h6>
                                    <p class="text-muted mb-2">East Africa's leading job board</p>
                                    <span class="badge bg-secondary">Not Connected</span>
                                </div>
                                <div class="col-md-4 text-md-end">
                                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#connectAccountModal" >
                                        <i class="bi bi-plus-circle me-1"></i>Connect Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Glassdoor -->
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-1 text-center">
                                    <img src="https://ui-avatars.com/api/?name=Glassdoor&background=0caa41&color=fff&size=64" 
                                         alt="Glassdoor" class="rounded" width="64" height="64">
                                </div>
                                <div class="col-md-7">
                                    <h6 class="mb-1">Glassdoor</h6>
                                    <p class="text-muted mb-2">Job search with company reviews and salary insights</p>
                                    <span class="badge bg-secondary">Not Connected</span>
                                </div>
                                <div class="col-md-4 text-md-end">
                                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#connectAccountModal" >
                                        <i class="bi bi-plus-circle me-1"></i>Connect Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ZipRecruiter -->
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-1 text-center">
                                    <img src="https://ui-avatars.com/api/?name=ZipRecruiter&background=1472d9&color=fff&size=64" 
                                         alt="ZipRecruiter" class="rounded" width="64" height="64">
                                </div>
                                <div class="col-md-7">
                                    <h6 class="mb-1">ZipRecruiter</h6>
                                    <p class="text-muted mb-2">Smart matching technology for job seekers</p>
                                    <span class="badge bg-secondary">Not Connected</span>
                                </div>
                                <div class="col-md-4 text-md-end">
                                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#connectAccountModal" >
                                        <i class="bi bi-plus-circle me-1"></i>Connect Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Add More Sites -->
                    <div class="card border-dashed">
                        <div class="card-body text-center py-4">
                            <i class="bi bi-plus-circle text-muted" style="font-size: 2rem;"></i>
                            <h6 class="mt-3 text-muted">Need to connect another job site?</h6>
                            <button class="btn btn-outline-primary mt-2" data-bs-toggle="modal" data-bs-target="#requestSiteModal">
                                <i class="bi bi-plus-circle me-1"></i>Request New Site
                            </button>
                        </div>
                    </div>

                    <!-- Security Notice -->
                    <div class="card mt-4 border-info">
                        <div class="card-body">
                            <h6><i class="bi bi-shield-check text-info me-2"></i>Security & Privacy</h6>
                            <ul class="mb-0 small">
                                <li>All credentials are encrypted using bank-level AES-256 encryption</li>
                                <li>Your agent can only access accounts for job application purposes</li>
                                <li>You can disconnect any account at any time</li>
                                <li>We never share your credentials with third parties</li>
                                <li>Activity logs are available for your review</li>
                            </ul>
                        </div>
                    </div>
                </div>

				</div>
				</div>