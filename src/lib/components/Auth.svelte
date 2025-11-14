<script lang="ts">

import { onMount, onDestroy } from 'svelte';

	onMount(() => {
		// Safe: runs only in the browser
		document.body.classList.add('authentication-bg');

		return () => {
			document.body.classList.remove('authentication-bg');
		};
	});

    import { supabase } from "../supabaseClient";
  
    let loading = $state(false);
    let email = $state("");
    let password = $state("");

    let message = '';
	let messageType = '';
  
    const handleLogin = async () => {
      try {
        loading = true;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
			
		
        }
      } finally {
        loading = false;
      }
    };
  </script>
  
 


  <div class="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 ">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-5">
          <div class="card auth-card">
            <div class="card-body px-3 py-5">
              <div class="mx-auto mb-4 text-center auth-logo">
                <a href="/" class="logo-dark">
                  <!-- <img src="/assets/images/logo-sm.png" height="30" class="me-1" alt="logo sm" /> -->
                  <img src="/assets/images/logo-dark.png" height="40" alt="logo dark" />
                </a>
                <a href="/" class="logo-light">
                  <!-- <img src="/assets/images/logo-sm.png" height="30" class="me-1" alt="logo sm" /> -->
                  <img src="/assets/images/logo-light.png" height="40" alt="logo light" />
                </a>
              </div>
  
              <h2 class="fw-bold text-center fs-18">Sign In</h2>
              <p class="text-muted text-center mt-1 mb-4">
                Enter your email address and password to access the dashboard.
              </p>
  
              <!-- Bootstrap Alert for messages -->
              {#if message}
                <div class="alert alert-{messageType} alert-dismissible fade show" role="alert">
                  {message}
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              {/if}
  
              <div class="px-4">
                <form class="authentication-form" on:submit={handleLogin}>
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
                    <a href="/reset-password" class="float-end text-muted text-unline-dashed ms-1">
                      Reset password
                    </a>
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
  
                  
  
                  <div class="mb-1 text-center d-grid">
                    <button class="btn btn-primary" type="submit" disabled={loading}>
                      {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                  </div>
                </form>
  
                <!-- <p class="mt-3 fw-semibold text-center">OR sign with</p>
  
                <div class="text-center">
                  <button class="btn btn-light shadow-none"><i class="bx bxl-google fs-20"></i></button>
                  <button class="btn btn-light shadow-none"><i class="bx bxl-facebook fs-20"></i></button>
                  <button class="btn btn-light shadow-none"><i class="bx bxl-github fs-20"></i></button>
                </div> -->
              </div>
            </div>
          </div>
  
          <p class="text-white mb-0 text-center">
            New here?
            <a href="/signup" class="text-white fw-bold ms-1">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  </div>