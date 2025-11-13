<script lang="ts">
    import { onMount } from 'svelte'
    import { supabase } from '$lib/supabaseClient'
    import type { AuthSession } from '@supabase/supabase-js'
    import Account from '$lib/components/Account.svelte'
    import Auth from '$lib/components/Auth.svelte'
  
    let session = $state<AuthSession | null>(null)
  
    onMount(() => {
      supabase.auth.getSession().then(({ data }) => {
        session = data.session
      })
  
      supabase.auth.onAuthStateChange((_event, _session) => {
        session = _session
      })
    })
  </script>
  
 
    {#if !session}
    <Auth />
    {:else}
    <Account {session} />
    {/if}
  