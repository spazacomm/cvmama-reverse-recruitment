<script>
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores'; // track current route

	export const user = writable(null);

	const publicRoutes = ['/login', '/signup']; // routes anyone can access

	onMount(async () => {
		const currentPath = $page.url.pathname;

		// Skip redirect for public routes
		if (publicRoutes.includes(currentPath)) return;

		const { data: { session } } = await supabase.auth.getSession();

		if (!session) {
			goto('/login');
			return;
		}

		const { data: profile } = await supabase
			.from('profiles')
			.select('role, full_name')
			.eq('id', session.user.id)
			.single();

		if (!profile) {
			console.log('Profile not found');
			goto('/login');
			return;
		}

		user.set(profile);

		// Redirect based on role
		if (profile.role === 'admin') goto('/dashboard/admin');
		else if (profile.role === 'agent') goto('/dashboard/agent');
		else goto('/candidate/dashboard');
	});
</script>

<slot />
