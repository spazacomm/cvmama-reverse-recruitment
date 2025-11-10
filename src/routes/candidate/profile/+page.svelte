<script lang="ts">
    function showSettings(setting){
        console.log(setting);
    }
</script>
<div class="container-xxl">

    <div class="col-md-9 col-lg-10 px-4 py-4">

        <div id="settings-page" class="page-section">
                    <div class="row mb-3">
                        <div class="col-12">
                            <h2 class="mb-1">Settings</h2>
                            <p class="text-muted">Manage your account preferences</p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-3">
                            <div class="card settings-nav">
                                <div class="list-group list-group-flush">
                                    <a href="#" class="list-group-item list-group-item-action active" on:click="{showSettings('profile')}">
                                        <i class="bi bi-person me-2"></i>Profile
                                    </a>
                                    <a href="#" class="list-group-item list-group-item-action" on:click="{showSettings('preferences')}">
                                        <i class="bi bi-sliders me-2"></i>Preferences
                                    </a>
                                    <a href="#" class="list-group-item list-group-item-action" on:click="{showSettings('notifications')}">
                                        <i class="bi bi-bell me-2"></i>Notifications
                                    </a>
                                    <a href="#" class="list-group-item list-group-item-action" on:click="{showSettings('security')}">
                                        <i class="bi bi-shield-lock me-2"></i>Security
                                    </a>
                                    <a href="#" class="list-group-item list-group-item-action" on:click="{showSettings('privacy')}">
                                        <i class="bi bi-eye me-2"></i>Privacy
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-9">
                            <!-- Profile Settings -->
                            <div id="profile-settings" class="settings-section active">
                                <div class="card mb-4">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Profile Information</h5>
                                        <div class="row">
                                            <div class="col-md-12 mb-4 text-center">
                                                <div class="avatar-upload">
                                                    <img src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=4f46e5&color=fff&size=150" 
                                                         alt="Profile" class="avatar-preview">
                                                    <div class="upload-overlay">
                                                        <i class="bi bi-camera"></i>
                                                    </div>
                                                </div>
                                                <p class="text-muted small mt-2">Click camera icon to change photo</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">First Name</label>
                                                <input type="text" class="form-control" value="Sarah">
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Last Name</label>
                                                <input type="text" class="form-control" value="Johnson">
                                            </div>
                                            <div class="col-md-12 mb-3">
                                                <label class="form-label">Email Address</label>
                                                <input type="email" class="form-control" value="sarah.johnson@example.com">
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Current Title</label>
                                                <input type="text" class="form-control" value="Product Manager">
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Years of Experience</label>
                                                <select class="form-select">
                                                    <option>0-2 years</option>
                                                    <option>3-5 years</option>
                                                    <option selected>6-10 years</option>
                                                    <option>10+ years</option>
                                                </select>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Location</label>
                                                <input type="text" class="form-control" value="San Francisco, CA">
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Remote Preference</label>
                                                <select class="form-select">
                                                    <option selected>Remote</option>
                                                    <option>Hybrid</option>
                                                    <option>On-site</option>
                                                    <option>Flexible</option>
                                                </select>
                                            </div>
                                            <div class="col-md-12 mb-3">
                                                <label class="form-label">Bio</label>
                                                <textarea class="form-control" rows="4">Experienced Product Manager with a passion for building user-centric SaaS products. Skilled in agile methodologies, stakeholder management, and data-driven decision making.</textarea>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">LinkedIn URL</label>
                                                <input type="url" class="form-control" value="https://linkedin.com/in/sarahjohnson">
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Portfolio URL</label>
                                                <input type="url" class="form-control" value="https://sarahjohnson.com">
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-end">
                                            <button class="btn btn-outline-secondary me-2">Cancel</button>
                                            <button class="btn btn-primary">Save Changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Preferences Settings -->
                            <div id="preferences-settings" class="settings-section">
                                <div class="card mb-4">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Job Search Preferences</h5>
                                        <div class="mb-4">
                                            <label class="form-label">Target Roles</label>
                                            <div class="d-flex flex-wrap gap-2 mb-2">
                                                <span class="badge bg-primary">Product Manager <i class="bi bi-x ms-1"></i></span>
                                                <span class="badge bg-primary">Senior Product Manager <i class="bi bi-x ms-1"></i></span>
                                                <span class="badge bg-primary">Director of Product <i class="bi bi-x ms-1"></i></span>
                                            </div>
                                            <button class="btn btn-sm btn-outline-primary"><i class="bi bi-plus-circle me-1"></i>Add Role</button>
                                        </div>
                                        <div class="mb-4">
                                            <label class="form-label">Target Industries</label>
                                            <div class="d-flex flex-wrap gap-2 mb-2">
                                                <span class="badge bg-info">SaaS <i class="bi bi-x ms-1"></i></span>
                                                <span class="badge bg-info">Fintech <i class="bi bi-x ms-1"></i></span>
                                                <span class="badge bg-info">E-commerce <i class="bi bi-x ms-1"></i></span>
                                            </div>
                                            <button class="btn btn-sm btn-outline-primary"><i class="bi bi-plus-circle me-1"></i>Add Industry</button>
                                        </div>
                                        <div class="row mb-4">
                                            <div class="col-md-6">
                                                <label class="form-label">Minimum Salary</label>
                                                <div class="input-group">
                                                    <span class="input-group-text">$</span>
                                                    <input type="number" class="form-control" value="140000">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label">Maximum Salary</label>
                                                <div class="input-group">
                                                    <span class="input-group-text">$</span>
                                                    <input type="number" class="form-control" value="180000">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Skills</label>
                                            <div class="d-flex flex-wrap gap-2 mb-2">
                                                <span class="badge bg-success">Product Strategy <i class="bi bi-x ms-1"></i></span>
                                                <span class="badge bg-success">User Research <i class="bi bi-x ms-1"></i></span>
                                                <span class="badge bg-success">Agile/Scrum <i class="bi bi-x ms-1"></i></span>
                                                <span class="badge bg-success">SQL <i class="bi bi-x ms-1"></i></span>
                                                <span class="badge bg-success">A/B Testing <i class="bi bi-x ms-1"></i></span>
                                            </div>
                                            <button class="btn btn-sm btn-outline-primary"><i class="bi bi-plus-circle me-1"></i>Add Skill</button>
                                        </div>
                                        <div class="d-flex justify-content-end">
                                            <button class="btn btn-outline-secondary me-2">Cancel</button>
                                            <button class="btn btn-primary">Save Preferences</button>
                                        </div>
                                    </div>
                                </div>

                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Communication Preferences</h5>
                                        <div class="mb-3">
                                            <label class="form-label">Preferred Communication Frequency</label>
                                            <select class="form-select">
                                                <option>Daily updates</option>
                                                <option selected>Weekly check-ins</option>
                                                <option>Bi-weekly check-ins</option>
                                                <option>Monthly updates</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Best Time for Calls</label>
                                            <select class="form-select">
                                                <option selected>Morning (9am - 12pm)</option>
                                                <option>Afternoon (12pm - 5pm)</option>
                                                <option>Evening (5pm - 8pm)</option>
                                                <option>Flexible</option>
                                            </select>
                                        </div>
                                        <div class="d-flex justify-content-end">
                                            <button class="btn btn-outline-secondary me-2">Cancel</button>
                                            <button class="btn btn-primary">Save Preferences</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Notifications Settings -->
                            <div id="notifications-settings" class="settings-section">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Notification Preferences</h5>
                                        <div class="mb-4">
                                            <h6 class="mb-3">Email Notifications</h6>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="emailMessages" checked>
                                                <label class="form-check-label" for="emailMessages">
                                                    New messages from agent
                                                </label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="emailApplications" checked>
                                                <label class="form-check-label" for="emailApplications">
                                                    Application status updates
                                                </label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="emailInterviews" checked>
                                                <label class="form-check-label" for="emailInterviews">
                                                    Interview reminders
                                                </label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="emailTips">
                                                <label class="form-check-label" for="emailTips">
                                                    Career tips and resources
                                                </label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="emailNewsletter">
                                                <label class="form-check-label" for="emailNewsletter">
                                                    Weekly newsletter
                                                </label>
                                            </div>
                                        </div>
                                        <hr>
                                        <div class="mb-4">
                                            <h6 class="mb-3">Push Notifications</h6>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="pushMessages" checked>
                                                <label class="form-check-label" for="pushMessages">
                                                    New messages
                                                </label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="pushUpdates" checked>
                                                <label class="form-check-label" for="pushUpdates">
                                                    Important updates
                                                </label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="pushReminders">
                                                <label class="form-check-label" for="pushReminders">
                                                    Reminders
                                                </label>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-end">
                                            <button class="btn btn-outline-secondary me-2">Cancel</button>
                                            <button class="btn btn-primary">Save Preferences</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Security Settings -->
                            <div id="security-settings" class="settings-section">
                                <div class="card mb-4">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Change Password</h5>
                                        <div class="mb-3">
                                            <label class="form-label">Current Password</label>
                                            <input type="password" class="form-control">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">New Password</label>
                                            <input type="password" class="form-control">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Confirm New Password</label>
                                            <input type="password" class="form-control">
                                        </div>
                                        <div class="d-flex justify-content-end">
                                            <button class="btn btn-primary">Update Password</button>
                                        </div>
                                    </div>
                                </div>

                                <div class="card mb-4">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Two-Factor Authentication</h5>
                                        <div class="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <h6 class="mb-1">Two-Factor Authentication</h6>
                                                <p class="text-muted small mb-0">Add an extra layer of security to your account</p>
                                            </div>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" id="2faSwitch">
                                            </div>
                                        </div>
                                        <p class="text-muted small">When enabled, you'll need to enter a code from your authenticator app in addition to your password.</p>
                                        <button class="btn btn-primary">Enable 2FA</button>
                                    </div>
                                </div>

                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Active Sessions</h5>
                                        <div class="border-bottom pb-3 mb-3">
                                            <div class="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 class="mb-1"><i class="bi bi-laptop me-2 text-primary"></i>Chrome on MacOS</h6>
                                                    <p class="text-muted small mb-1">San Francisco, CA • 192.168.1.1</p>
                                                    <p class="text-muted small mb-0"><span class="badge bg-success">Current Session</span></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h6 class="mb-1"><i class="bi bi-phone me-2 text-info"></i>Mobile App on iOS</h6>
                                                <p class="text-muted small mb-1">San Francisco, CA • 192.168.1.100</p>
                                                <p class="text-muted small mb-0">Last active 2 hours ago</p>
                                            </div>
                                            <button class="btn btn-sm btn-outline-danger">Revoke</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Privacy Settings -->
                            <div id="privacy-settings" class="settings-section">
                                <div class="card mb-4">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Privacy Settings</h5>
                                        <div class="mb-4">
                                            <div class="d-flex justify-content-between align-items-center mb-3">
                                                <div>
                                                    <h6 class="mb-1">Profile Visibility</h6>
                                                    <p class="text-muted small mb-0">Control who can see your profile information</p>
                                                </div>
                                                <select class="form-select w-auto">
                                                    <option>Only my agent</option>
                                                    <option selected>My agent and employers</option>
                                                    <option>Public</option>
                                                </select>
                                            </div>
                                        </div>
                                        <hr>
                                        <div class="mb-4">
                                            <h6 class="mb-3">Data Sharing</h6>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="shareAnalytics" checked>
                                                <label class="form-check-label" for="shareAnalytics">
                                                    Share usage analytics to improve the platform
                                                </label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="shareProfile">
                                                <label class="form-check-label" for="shareProfile">
                                                    Allow my profile to be shown to potential employers
                                                </label>
                                            </div>
                                        </div>
                                        <hr>
                                        <div>
                                            <h6 class="mb-3 text-danger">Danger Zone</h6>
                                            <div class="border border-danger rounded p-3">
                                                <h6>Delete Account</h6>
                                                <p class="text-muted small mb-3">Once you delete your account, there is no going back. Please be certain.</p>
                                                <button class="btn btn-danger">Delete My Account</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title mb-4">Download Your Data</h5>
                                        <p class="text-muted">Request a copy of your personal data including profile information, messages, and documents.</p>
                                        <button class="btn btn-primary">Request Data Export</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        </div>
        </div>