<script lang="ts">

    function uploadFile(){
        console.log('upload file');
    }
    </script>

      <!-- Start Container -->
  <div class="container-xxl">

    <div class="col-md-9 col-lg-10 px-4 py-4">
                
                <div id="documents-page" class="page-section">
                    <div class="row mb-3">
                        <div class="col-12">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h2 class="mb-1">Documents</h2>
                                    <p class="text-muted">Manage your resumes, cover letters, and other files</p>
                                </div>
                                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#uploadModal">
                                    <i class="bi bi-cloud-upload me-2"></i>Upload Document
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Upload Zone -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="upload-zone" on:click="{uploadFile}">
                                <i class="bi bi-cloud-upload text-primary" style="font-size: 3rem;"></i>
                                <h5 class="mt-3">Drag & Drop Files Here</h5>
                                <p class="text-muted">or click to browse (PDF, DOCX, TXT - Max 10MB)</p>
                                <input type="file" id="fileInput" style="display: none;" multiple accept=".pdf,.docx,.txt">
                            </div>
                        </div>
                    </div>

                    <!-- Document Categories -->
                    <ul class="nav nav-tabs mb-4" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#all-docs">
                                All Documents <span class="badge bg-secondary ms-2">8</span>
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#resumes">
                                Resumes <span class="badge bg-secondary ms-2">3</span>
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#cover-letters">
                                Cover Letters <span class="badge bg-secondary ms-2">2</span>
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#portfolios">
                                Portfolios <span class="badge bg-secondary ms-2">2</span>
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#other">
                                Other <span class="badge bg-secondary ms-2">1</span>
                            </button>
                        </li>
                    </ul>

                    <!-- Documents Grid -->
                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="all-docs">
                            <div class="row">
                                <div class="col-md-4 col-lg-3 mb-4">
                                    <div class="card document-card">
                                        <div class="card-body text-center">
                                            <i class="bi bi-file-pdf text-danger document-icon"></i>
                                            <h6 class="mb-2">Resume_SarahJohnson_2025.pdf</h6>
                                            <span class="badge bg-primary mb-2">Resume</span>
                                            <p class="text-muted small mb-2">2.3 MB • Nov 10, 2025</p>
                                            <div class="d-flex gap-2 justify-content-center">
                                                <button class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-download"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                            <div class="mt-2">
                                                <small class="text-success">
                                                    <i class="bi bi-check-circle-fill"></i> Shared with agent
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-4 col-lg-3 mb-4">
                                    <div class="card document-card">
                                        <div class="card-body text-center">
                                            <i class="bi bi-file-word text-primary document-icon"></i>
                                            <h6 class="mb-2">CoverLetter_TechCorp.docx</h6>
                                            <span class="badge bg-info mb-2">Cover Letter</span>
                                            <p class="text-muted small mb-2">1.1 MB • Nov 9, 2025</p>
                                            <div class="d-flex gap-2 justify-content-center">
                                                <button class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-download"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                            <div class="mt-2">
                                                <small class="text-success">
                                                    <i class="bi bi-check-circle-fill"></i> Shared with agent
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-4 col-lg-3 mb-4">
                                    <div class="card document-card">
                                        <div class="card-body text-center">
                                            <i class="bi bi-file-pdf text-danger document-icon"></i>
                                            <h6 class="mb-2">Portfolio_Projects.pdf</h6>
                                            <span class="badge bg-success mb-2">Portfolio</span>
                                            <p class="text-muted small mb-2">5.7 MB • Nov 5, 2025</p>
                                            <div class="d-flex gap-2 justify-content-center">
                                                <button class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-download"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                            <div class="mt-2">
                                                <small class="text-success">
                                                    <i class="bi bi-check-circle-fill"></i> Shared with agent
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-4 col-lg-3 mb-4">
                                    <div class="card document-card">
                                        <div class="card-body text-center">
                                            <i class="bi bi-file-pdf text-danger document-icon"></i>
                                            <h6 class="mb-2">Certifications_PM.pdf</h6>
                                            <span class="badge bg-warning mb-2">Certificate</span>
                                            <p class="text-muted small mb-2">0.8 MB • Oct 28, 2025</p>
                                            <div class="d-flex gap-2 justify-content-center">
                                                <button class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-download"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                            <div class="mt-2">
                                                <small class="text-muted">
                                                    <i class="bi bi-circle"></i> Private
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

    </div>

    </div>