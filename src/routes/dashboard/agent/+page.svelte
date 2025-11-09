<script>
    import { user } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
  
    let profile;
    const unsubscribe = user.subscribe(value => profile = value);
  
    onMount(() => {
      if (!profile || profile.role !== 'agent') {
        goto('/login');
      }
    });
  
    onDestroy(() => {
      unsubscribe();
    });
  </script>
  
  <h1>Agent Dashboard</h1>
  <p>Welcome, {profile?.full_name}</p>
  