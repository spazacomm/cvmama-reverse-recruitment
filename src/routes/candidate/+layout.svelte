<script>
    import { supabase, user } from '$lib/supabaseClient';
   import { goto } from '$app/navigation';
   import { onMount } from 'svelte';
 
   async function logout() {
     await supabase.auth.signOut();
     goto('/login');
   }


    
  
    let profile;
    const unsubscribe = user.subscribe(value => profile = value);
  
    onMount(() => {
      if (!profile || profile.role !== 'candidate') {
        goto('/login');
      }
    });
  
  


</script>


<!-- START Wrapper -->
<div class="wrapper">
   <!-- ========== Topbar Start ========== -->
   <header class="topbar">
       <div class="container-xxl">
           <div class="navbar-header">
               <div class="d-flex align-items-center gap-2">
                   <!-- Menu Toggle Button -->
                   <div class="topbar-item">
                       <button type="button" class="button-toggle-menu">
                           <iconify-icon
                               icon="iconamoon:menu-burger-horizontal"
                               class="fs-22"
                           ></iconify-icon>
                       </button>
                   </div>

                   
                   
               </div>

               <div class="d-flex align-items-center gap-1">
                   
                   <!-- Notification -->
                   <div class="dropdown topbar-item">
                       <button
                           type="button"
                           class="topbar-button position-relative"
                           id="page-header-notifications-dropdown"
                           data-bs-toggle="dropdown"
                           aria-haspopup="true"
                           aria-expanded="false"
                       >
                           <iconify-icon
                               icon="iconamoon:notification-duotone"
                               class="fs-24 align-middle"
                           ></iconify-icon>
                           <span
                               class="position-absolute topbar-badge fs-10 translate-middle badge bg-danger rounded-pill"
                               >3<span class="visually-hidden"
                                   >unread messages</span
                               ></span
                           >
                       </button>
                       <div
                           class="dropdown-menu py-0 dropdown-lg dropdown-menu-end"
                           aria-labelledby="page-header-notifications-dropdown"
                       >
                           <div
                               class="p-3 border-top-0 border-start-0 border-end-0 border-dashed border"
                           >
                               <div class="row align-items-center">
                                   <div class="col">
                                       <h6 class="m-0 fs-16 fw-semibold">
                                           Notifications
                                       </h6>
                                   </div>
                                   <div class="col-auto">
                                       <a
                                           href="javascript: void(0);"
                                           class="text-dark text-decoration-underline"
                                       >
                                           <small>Clear All</small>
                                       </a>
                                   </div>
                               </div>
                           </div>
                           <div data-simplebar style="max-height: 280px">
                               <!-- Item -->
                               <a
                                   href="javascript:void(0);"
                                   class="dropdown-item py-3 border-bottom text-wrap"
                               >
                                   <div class="d-flex">
                                       <div class="flex-shrink-0">
                                           <img
                                               src="/assets/images/users/avatar-1.jpg"
                                               class="img-fluid me-2 avatar-sm rounded-circle"
                                               alt="avatar-1"
                                           />
                                       </div>
                                       <div class="flex-grow-1">
                                           <p class="mb-0">
                                               <span class="fw-medium"
                                                   >Josephine Thompson </span
                                               >commented on admin panel
                                               <span
                                                   >" Wow 😍! this admin looks good
                                                   and awesome design"</span
                                               >
                                           </p>
                                       </div>
                                   </div>
                               </a>
                               <!-- Item -->
                               <a
                                   href="javascript:void(0);"
                                   class="dropdown-item py-3 border-bottom"
                               >
                                   <div class="d-flex">
                                       <div class="flex-shrink-0">
                                           <div class="avatar-sm me-2">
                                               <span
                                                   class="avatar-title bg-soft-info text-info fs-20 rounded-circle"
                                               >
                                                   D
                                               </span>
                                           </div>
                                       </div>
                                       <div class="flex-grow-1">
                                           <p class="mb-0 fw-semibold">
                                               Donoghue Susan
                                           </p>
                                           <p class="mb-0 text-wrap">
                                               Hi, How are you? What about our next
                                               meeting
                                           </p>
                                       </div>
                                   </div>
                               </a>
                               <!-- Item -->
                               <a
                                   href="javascript:void(0);"
                                   class="dropdown-item py-3 border-bottom"
                               >
                                   <div class="d-flex">
                                       <div class="flex-shrink-0">
                                           <img
                                               src="/assets/images/users/avatar-3.jpg"
                                               class="img-fluid me-2 avatar-sm rounded-circle"
                                               alt="avatar-3"
                                           />
                                       </div>
                                       <div class="flex-grow-1">
                                           <p class="mb-0 fw-semibold">
                                               Jacob Gines
                                           </p>
                                           <p class="mb-0 text-wrap">
                                               Answered to your comment on the cash
                                               flow forecast's graph 🔔.
                                           </p>
                                       </div>
                                   </div>
                               </a>
                               <!-- Item -->
                               <a
                                   href="javascript:void(0);"
                                   class="dropdown-item py-3 border-bottom"
                               >
                                   <div class="d-flex">
                                       <div class="flex-shrink-0">
                                           <div class="avatar-sm me-2">
                                               <span
                                                   class="avatar-title bg-soft-warning text-warning fs-20 rounded-circle"
                                               >
                                                   <iconify-icon
                                                       icon="iconamoon:comment-dots-duotone"
                                                   ></iconify-icon>
                                               </span>
                                           </div>
                                       </div>
                                       <div class="flex-grow-1">
                                           <p class="mb-0 fw-semibold text-wrap">
                                               You have received <b>20</b> new
                                               messages in the conversation
                                           </p>
                                       </div>
                                   </div>
                               </a>
                               <!-- Item -->
                               <a
                                   href="javascript:void(0);"
                                   class="dropdown-item py-3 border-bottom"
                               >
                                   <div class="d-flex">
                                       <div class="flex-shrink-0">
                                           <img
                                               src="/assets/images/users/avatar-5.jpg"
                                               class="img-fluid me-2 avatar-sm rounded-circle"
                                               alt="avatar-5"
                                           />
                                       </div>
                                       <div class="flex-grow-1">
                                           <p class="mb-0 fw-semibold">
                                               Shawn Bunch
                                           </p>
                                           <p class="mb-0 text-wrap">
                                               Commented on Admin
                                           </p>
                                       </div>
                                   </div>
                               </a>
                           </div>
                           <div class="text-center py-3">
                               <a
                                   href="javascript:void(0);"
                                   class="btn btn-primary btn-sm"
                                   >View All Notification
                                   <i class="bx bx-right-arrow-alt ms-1"></i
                               ></a>
                           </div>
                       </div>
                   </div>

                  

                   <!-- User -->
                   <div class="dropdown topbar-item">
                       <a
                           type="button"
                           class="topbar-button"
                           id="page-header-user-dropdown"
                           data-bs-toggle="dropdown"
                           aria-haspopup="true"
                           aria-expanded="false"
                       >
                           <span class="d-flex align-items-center">
                               <img
                                   class="rounded-circle"
                                   width="32"
                                   src="{profile?.avatar_url}"
                                   alt="avatar-3"
                               />
                           </span>
                       </a>
                       <div class="dropdown-menu dropdown-menu-end">
                           <!-- item-->
                           <h6 class="dropdown-header">{profile?.first_name}</h6>
                           <a class="dropdown-item" href="/candidate/profile">
                               <i
                                   class="bx bx-user-circle text-muted fs-18 align-middle me-1"
                               ></i
                               ><span class="align-middle">Profile</span>
                           </a>
                           

                           <a class="dropdown-item" href="/candidate/subscriptions">
                               <i
                                   class="bx bx-wallet text-muted fs-18 align-middle me-1"
                               ></i
                               ><span class="align-middle">Subscriptions</span>
                           </a>
                           <a class="dropdown-item" href="/faq">
                               <i
                                   class="bx bx-help-circle text-muted fs-18 align-middle me-1"
                               ></i
                               ><span class="align-middle">Help</span>
                           </a>
                           
                           <div class="dropdown-divider my-1"></div>

                           <a
                               class="dropdown-item text-danger"
                               href="#"
                               on:click={logout} 
                           >
                               <i class="bx bx-log-out fs-18 align-middle me-1"></i
                               ><span class="align-middle">Logout</span>
                           </a>
                       </div>
                   </div>
               </div>
           </div>
       </div>
   </header>

  

  


   <!-- ========== Topbar End ========== -->

   <!-- ========== App Menu Start ========== -->
   <div class="main-nav">
       <!-- Sidebar Logo -->
       <div class="logo-box">
           <a href="index.html" class="logo-dark">
              
               <img
                   src="/assets/images/logo-dark.png"
                   class="logo-lg"
                   alt="logo dark"
               />
           </a>

           <a href="index.html" class="logo-light">
               
               <img
                   src="/assets/images/logo-light.png"
                   class="logo-lg"
                   alt="logo light"
               />
           </a>
       </div>

       <!-- Menu Toggle Button (sm-hover) -->
       <button
           type="button"
           class="button-sm-hover"
           aria-label="Show Full Sidebar"
       >
           <iconify-icon
               icon="iconamoon:arrow-left-4-square-duotone"
               class="button-sm-hover-icon"
           ></iconify-icon>
       </button>

       <div class="scrollbar" data-simplebar>
           <ul class="navbar-nav" id="navbar-nav">
               <li class="menu-title">General</li>

               <li class="nav-item">
                <a class="nav-link" href="/candidate/dashboard">
                    <span class="nav-icon">
                        <iconify-icon
                            icon="iconamoon:home-duotone"
                        ></iconify-icon>
                    </span>
                    <span class="nav-text"> Overview </span>
                </a>
            </li>


            <li class="nav-item">
                <a class="nav-link" href="/candidate/jobs">
                    <span class="nav-icon">
                        <iconify-icon
                            icon="iconamoon:home-duotone"
                        ></iconify-icon>
                    </span>
                    <span class="nav-text"> Jobs </span>
                </a>
            </li>

              


               <li class="menu-title">Apps</li>

             

            <li class="nav-item">
                <a class="nav-link" href="/candidate/messages">
                    <span class="nav-icon">
                        <iconify-icon
                            icon="iconamoon:comment-dots-duotone"
                        ></iconify-icon>
                    </span>
                    <span class="nav-text"> Messages </span>
                </a>
            </li>

            <li class="nav-item">
                <a class="nav-link" href="/candidate/documents">
                    <span class="nav-icon">
                        <iconify-icon
                            icon="iconamoon:attachment-duotone"
                        ></iconify-icon>
                    </span>
                    <span class="nav-text"> Documents </span>
                </a>
            </li>

            <li class="nav-item">
                <a class="nav-link" href="/candidate/agent">
                    <span class="nav-icon">
                        <iconify-icon
                            icon="iconamoon:comment-dots-duotone"
                        ></iconify-icon>
                    </span>
                    <span class="nav-text"> My Agent </span>
                </a>
            </li>

            <li class="nav-item">
                <a class="nav-link" href="/candidate/subscription">
                    <span class="nav-icon">
                        <iconify-icon
                            icon="iconamoon:comment-dots-duotone"
                        ></iconify-icon>
                    </span>
                    <span class="nav-text"> Subscription </span>
                </a>
            </li>

            


            <li class="nav-item">
                <a
                    class="nav-link menu-arrow"
                    href="#sidebarProfile"
                    data-bs-toggle="collapse"
                    role="button"
                    aria-expanded="false"
                    aria-controls="sidebarProfile"
                >
                    <span class="nav-icon">
                        <iconify-icon
                            icon="iconamoon:attention-circle-duotone"
                        ></iconify-icon>
                    </span>
                    <span class="nav-text"> Settings </span>
                </a>
                <div class="collapse" id="sidebarProfile">
                    <ul class="nav sub-navbar-nav">
                        <li class="sub-nav-item">
                            <a class="sub-nav-link" href="/candidate/profile"
                                >Profile</a
                            >
                        </li>
                        <li class="sub-nav-item">
                            <a
                                class="sub-nav-link"
                                href="/candidate/accounts"
                                >Connected Accounts</a
                            >
                        </li>
                       
                       
                    </ul>
                </div>
            </li>

               

             
           </ul>
       </div>
   </div>

   <!-- ========== App Menu End ========== -->


   <!-- ==================================================== -->
   <!-- Start right Content here -->
   <!-- ==================================================== -->
   <div class="page-content">
       <slot />

       <!-- ========== Footer Start ========== -->
       <footer class="footer">
           <div class="container-fluid">
               <div class="row">
                   <div class="col-12 text-center">
                       {new Date().getFullYear()} 
                       &copy; cvmama career services. 
                   </div>
               </div>
           </div>
       </footer>
       <!-- ========== Footer End ========== -->

   </div>
   <!-- ==================================================== -->
   <!-- End Page Content -->
   <!-- ==================================================== -->
</div>
<!-- END Wrapper -->
