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
        <div class="col-xl col-lg-4 col-md-6">
            <div class="card">
                <div
                    class="card-body overflow-hidden position-relative"
                >
                    <iconify-icon
                        icon="iconamoon:3d-duotone"
                        class="fs-36 text-info"
                    ></iconify-icon>
                    <h3 class="mb-0 fw-bold mt-3 mb-1">
                        $59.6k
                    </h3>
                    <p class="text-muted">Total Income</p>
                    <span class="badge fs-12 badge-soft-success"
                        ><i class="ti ti-arrow-badge-up"></i>
                        8.72%</span
                    >
                    <i
                        class="bx bx-doughnut-chart widget-icon"
                    ></i>
                </div>
                <!-- end card-body -->
            </div>
            <!-- end card -->
        </div>
        <!-- end col -->

        <div class="col-xl col-lg-4 col-md-6">
            <div class="card">
                <div
                    class="card-body overflow-hidden position-relative"
                >
                    <iconify-icon
                        icon="iconamoon:category-duotone"
                        class="fs-36 text-success"
                    ></iconify-icon>
                    <h3 class="mb-0 fw-bold mt-3 mb-1">
                        $24.03k
                    </h3>
                    <p class="text-muted">Total Expenses</p>
                    <span class="badge fs-12 badge-soft-danger"
                        ><i class="ti ti-arrow-badge-down"></i>
                        3.28%</span
                    >
                    <i
                        class="bx bx-bar-chart-alt-2 widget-icon"
                    ></i>
                </div>
                <!-- end card-body -->
            </div>
            <!-- end card -->
        </div>
        <!-- end col -->

        <div class="col-xl col-lg-4 col-md-6">
            <div class="card">
                <div
                    class="card-body overflow-hidden position-relative"
                >
                    <iconify-icon
                        icon="iconamoon:store-duotone"
                        class="fs-36 text-purple"
                    ></iconify-icon>
                    <h3 class="mb-0 fw-bold mt-3 mb-1">
                        $48.7k
                    </h3>
                    <p class="text-muted">Investments</p>
                    <span class="badge fs-12 badge-soft-danger"
                        ><i class="ti ti-arrow-badge-down"></i>
                        5.69%</span
                    >
                    <i
                        class="bx bx-building-house widget-icon"
                    ></i>
                </div>
                <!-- end card-body -->
            </div>
            <!-- end card -->
        </div>
        <!-- end col -->

        <div class="col-xl col-lg-6 col-md-6">
            <div class="card">
                <div
                    class="card-body overflow-hidden position-relative"
                >
                    <iconify-icon
                        icon="iconamoon:gift-duotone"
                        class="fs-36 text-orange"
                    ></iconify-icon>
                    <h3 class="mb-0 fw-bold mt-3 mb-1">
                        $11.3k
                    </h3>
                    <p class="text-muted">Savings</p>
                    <span class="badge fs-12 badge-soft-success"
                        ><i class="ti ti-arrow-badge-up"></i>
                        10.58%</span
                    >
                    <i class="bx bx-bowl-hot widget-icon"></i>
                </div>
                <!-- end card-body -->
            </div>
            <!-- end card -->
        </div>
        <!-- end col -->

        <div class="col-xl col-lg-6 col-md-12">
            <div class="card">
                <div
                    class="card-body overflow-hidden position-relative"
                >
                    <iconify-icon
                        icon="iconamoon:certificate-badge-duotone"
                        class="fs-36 text-warning"
                    ></iconify-icon>
                    <h3 class="mb-0 fw-bold mt-3 mb-1">
                        $5.5k
                    </h3>
                    <p class="text-muted">Profits</p>
                    <span class="badge fs-12 badge-soft-success"
                        ><i class="ti ti-arrow-badge-up"></i>
                        2.25%</span
                    >
                    <i
                        class="bx bx-cricket-ball widget-icon"
                    ></i>
                </div>
                <!-- end card-body -->
            </div>
            <!-- end card -->
        </div>
        <!-- end col -->
    </div>
    <!-- end row-->

    <div class="row">
        <div class="col-xl-6">
            <div class="card">
                <div class="card-body p-0">
                    <div class="pt-3 px-3">
                        <div class="float-end">
                            <a
                                href="javascript:void(0);"
                                class="text-primary"
                                >Export
                                <i
                                    class="bx bx-export ms-1"
                                ></i>
                            </a>
                        </div>
                        <h5 class="card-title mb-3">
                            Recent Project Summary
                        </h5>
                    </div>
                    <div
                        class="mb-3"
                        data-simplebar
                        style="max-height: 324px"
                    >
                        <div
                            class="table-responsive table-centered table-nowrap px-3"
                        >
                            <table
                                class="table table-hover mb-0"
                            >
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th>Client</th>
                                        <th>Team</th>
                                        <th>Deadline</th>
                                        <th>Work Progress</th>
                                    </tr>
                                </thead>
                                <!-- end thead -->
                                <tbody>
                                    <tr>
                                        <td>Zelogy</td>
                                        <td>Daniel Olsen</td>
                                        <td
                                            class="avatar-group"
                                        >
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-2.jpg"
                                                    alt="avatar-2"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-3.jpg"
                                                    alt="avatar-3"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-4.jpg"
                                                    alt="avatar-4"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                        </td>
                                        <td>12 April 2024</td>
                                        <td>
                                            <div
                                                class="progress progress-sm"
                                            >
                                                <div
                                                    class="progress-bar"
                                                    role="progressbar"
                                                    style="
                                                        width: 33%;
                                                    "
                                                    aria-valuenow="33"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Shiaz</td>
                                        <td>Jack Roldan</td>
                                        <td
                                            class="avatar-group"
                                        >
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-1.jpg"
                                                    alt="avatar-1"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-5.jpg"
                                                    alt="avatar-5"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                        </td>
                                        <td>10 April 2024</td>
                                        <td>
                                            <div
                                                class="progress progress-sm"
                                            >
                                                <div
                                                    class="progress-bar bg-success"
                                                    role="progressbar"
                                                    style="
                                                        width: 74%;
                                                    "
                                                    aria-valuenow="74"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Holderick</td>
                                        <td>Betty Cox</td>
                                        <td
                                            class="avatar-group"
                                        >
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-5.jpg"
                                                    alt="avatar-5"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-2.jpg"
                                                    alt="avatar-2"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-3.jpg"
                                                    alt="avatar-3"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                        </td>
                                        <td>31 March 2024</td>
                                        <td>
                                            <div
                                                class="progress progress-sm"
                                            >
                                                <div
                                                    class="progress-bar bg-warning"
                                                    role="progressbar"
                                                    style="
                                                        width: 50%;
                                                    "
                                                    aria-valuenow="50"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Feyvux</td>
                                        <td>Carlos Johnson</td>
                                        <td
                                            class="avatar-group"
                                        >
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-3.jpg"
                                                    alt="avatar-3"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-7.jpg"
                                                    alt="avatar-7"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-6.jpg"
                                                    alt="avatar-6"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                        </td>
                                        <td>25 March 2024</td>
                                        <td>
                                            <div
                                                class="progress progress-sm"
                                            >
                                                <div
                                                    class="progress-bar"
                                                    role="progressbar"
                                                    style="
                                                        width: 92%;
                                                    "
                                                    aria-valuenow="92"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Xavlox</td>
                                        <td>Lorraine Cox</td>
                                        <td
                                            class="avatar-group"
                                        >
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-7.jpg"
                                                    alt="avatar-7"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                        </td>
                                        <td>22 March 2024</td>
                                        <td>
                                            <div
                                                class="progress progress-sm"
                                            >
                                                <div
                                                    class="progress-bar bg-danger"
                                                    role="progressbar"
                                                    style="
                                                        width: 48%;
                                                    "
                                                    aria-valuenow="48"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Mozacav</td>
                                        <td>Delores Young</td>
                                        <td
                                            class="avatar-group"
                                        >
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-3.jpg"
                                                    alt="avatar-3"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-4.jpg"
                                                    alt="avatar-4"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                            <a
                                                href="javascript:void(0);"
                                                class="avatar-group-item"
                                            >
                                                <img
                                                    src="assets/images/users/avatar-2.jpg"
                                                    alt="avatar-2"
                                                    class="img-fluid avatar-xs rounded-circle avatar-border"
                                                />
                                            </a>
                                        </td>
                                        <td>15 March 2024</td>
                                        <td>
                                            <div
                                                class="progress progress-sm"
                                            >
                                                <div
                                                    class="progress-bar bg-blue"
                                                    role="progressbar"
                                                    style="
                                                        width: 21%;
                                                    "
                                                    aria-valuenow="21"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <!-- end tbody -->
                            </table>
                            <!-- end table -->
                        </div>
                        <!-- end table responsive -->
                    </div>
                </div>
                <!-- end card body -->
            </div>
            <!-- end card -->
        </div>
        <!-- end col -->
        <div class="col-xl-6">
            <div class="card">
                <div class="card-body">
                    <div class="dropdown float-end">
                        <a
                            href="javascript:void(0);"
                            class="dropdown-toggle arrow-none"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i
                                class="bx bx-dots-vertical-rounded fs-18 text-dark"
                            ></i>
                        </a>
                        <div
                            class="dropdown-menu dropdown-menu-end"
                        >
                            <a
                                href="javascript:void(0);"
                                class="dropdown-item"
                            >
                                <i
                                    class="bx bx-list-ul me-2"
                                ></i
                                >To Do
                            </a>
                            <a
                                href="javascript:void(0);"
                                class="dropdown-item"
                            >
                                <i
                                    class="bx bx-line-chart me-2"
                                ></i
                                >In Progress
                            </a>
                            <a
                                href="javascript:void(0);"
                                class="dropdown-item"
                            >
                                <i
                                    class="bx bx-check-square me-2"
                                ></i
                                >Completed
                            </a>
                        </div>
                    </div>
                    <h5 class="card-title mb-3">
                        Today's Schedules
                    </h5>
                    <div class="row align-items-center">
                        <div class="col-3 col-sm-2">
                            <p>09:00</p>
                        </div>
                        <div class="col-9 col-sm-10">
                            <div
                                class="alert alert-primary px-2"
                                role="alert"
                            >
                                <p class="mb-0">
                                    Setup Github Repository
                                </p>
                                <p class="mb-0">
                                    09:00 - 10:00
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row align-items-center">
                        <div class="col-3 col-sm-2">
                            <p>10:00</p>
                        </div>
                        <div class="col-9 col-sm-10">
                            <div
                                class="alert alert-success px-2"
                                role="alert"
                            >
                                <p class="mb-0">
                                    Design Review - Reback Admin
                                </p>
                                <p class="mb-0">
                                    10:00 - 10:30
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row align-items-center">
                        <div class="col-3 col-sm-2">
                            <p>11:00</p>
                        </div>
                        <div class="col-9 col-sm-10">
                            <div
                                class="alert alert-info px-2"
                                role="alert"
                            >
                                <p class="mb-0">
                                    Meeting with BD Team
                                </p>
                                <p class="mb-0">
                                    11:00 - 12:30
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row align-items-center">
                        <div class="col-3 col-sm-2">
                            <p class="mb-0">01:00</p>
                        </div>
                        <div class="col-9 col-sm-10">
                            <div
                                class="alert alert-warning px-2 mb-0"
                                role="alert"
                            >
                                <p class="mb-0">
                                    Meeting with Design Studio
                                </p>
                                <p class="mb-0">
                                    01:00 - 02:00
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- end card body -->
            </div>
            <!-- end card -->
        </div>
        <!-- end col -->
    </div>
    <!-- end row -->


</div>
<!-- End Container -->
  