<script>
    import { supabase, user } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
  
    let fullName = '';
    let email = '';
    let password = '';
    let acceptTerms = false;
    let role = 'candidate'; // default role
    let loading = false;
  
    // Bootstrap alert messages
    let message = '';
    let messageType = ''; // 'success' or 'danger'
  
    async function signUp(e) {
      e.preventDefault();
      message = '';
      messageType = '';
  
      if (!acceptTerms) {
        message = 'You must accept the Terms and Conditions';
        messageType = 'danger';
        return;
      }
  
      loading = true;
  
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });
  
      if (authError) {
        message = authError.message;
        messageType = 'danger';
        loading = false;
        return;
      }
  
      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: authData.user.id, full_name: fullName, role }]);
  
      if (profileError) {
        message = profileError.message;
        messageType = 'danger';
        loading = false;
        return;
      }
  
      user.set(profileData[0]);
      message = 'Signup successful! Redirecting...';
      messageType = 'success';
  
      // Wait a bit to show message before redirect
      setTimeout(() => {
        if (role === 'admin') goto('/dashboard/admin');
        else if (role === 'agent') goto('/dashboard/agent');
        else goto('/dashboard/candidate');
      }, 1500);
  
      loading = false;
    }
  </script>
  
  <div class="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-5">
          <div class="card auth-card">
            <div class="card-body px-3 py-5">
              <div class="mx-auto mb-4 text-center auth-logo">
                <a href="/" class="logo-dark">
                  <img src="/assets/images/logo-sm.png" height="30" class="me-1" alt="logo sm" />
                  <img src="/assets/images/logo-dark.png" height="24" alt="logo dark" />
                </a>
                <a href="/" class="logo-light">
                  <img src="/assets/images/logo-sm.png" height="30" class="me-1" alt="logo sm" />
                  <img src="/assets/images/logo-light.png" height="24" alt="logo light" />
                </a>
              </div>
  
              <h2 class="fw-bold text-center fs-18">Sign Up</h2>
              <p class="text-muted text-center mt-1 mb-4">
                New to our platform? Sign up now! It only takes a minute.
              </p>
  
              <!-- Bootstrap Alert for messages -->
              {#if message}
                <div class="alert alert-{messageType} alert-dismissible fade show" role="alert">
                  {message}
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              {/if}
  
              <div class="px-4">
                <form class="authentication-form" on:submit={signUp}>
                  <div class="mb-3">
                    <label class="form-label" for="example-name">Name</label>
                    <input
                      type="text"
                      id="example-name"
                      class="form-control"
                      placeholder="Enter your name"
                      bind:value={fullName}
                      required
                    />
                  </div>
  
                  <div class="mb-3">
                    <label class="form-label" for="example-email">Email</label>
                    <input
                      type="email"
                      id="example-email"
                      class="form-control"
                      placeholder="Enter your email"
                      bind:value={email}
                      required
                    />
                  </div>
  
                  <div class="mb-3">
                    <label class="form-label" for="example-password">Password</label>
                    <input
                      type="password"
                      id="example-password"
                      class="form-control"
                      placeholder="Enter your password"
                      bind:value={password}
                      required
                    />
                  </div>
  
                  <div class="mb-3">
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="checkbox-signin"
                        bind:checked={acceptTerms}
                      />
                      <label class="form-check-label" for="checkbox-signin">
                        I accept Terms and Conditions
                      </label>
                    </div>
                  </div>
  
                  <div class="mb-1 text-center d-grid">
                    <button class="btn btn-primary" type="submit" disabled={loading}>
                      {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                  </div>
                </form>
  
                <p class="mt-3 fw-semibold text-center">OR sign with</p>
                <div class="text-center">
                  <button class="btn btn-light shadow-none"><i class="bx bxl-google fs-20"></i></button>
                  <button class="btn btn-light shadow-none"><i class="bx bxl-facebook fs-20"></i></button>
                  <button class="btn btn-light shadow-none"><i class="bx bxl-github fs-20"></i></button>
                </div>
              </div>
            </div>
          </div>
  
          <p class="text-white mb-0 text-center">
            I already have an account
            <a href="/login" class="text-white fw-bold ms-1">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  </div>
  