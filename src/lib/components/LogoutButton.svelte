<script>
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
  
    async function logout() {
      await supabase.auth.signOut();
      goto('/login');
    }
  </script>
  
  <button on:click={logout}>Logout</button>
  