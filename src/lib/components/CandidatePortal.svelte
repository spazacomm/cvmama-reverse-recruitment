<script lang="ts">
	import { user, supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { AuthSession } from '@supabase/supabase-js';

	import CandidateDashboard from './CandidateDashboard.svelte';
	import CandidateOnboarding from './CandidateOnboarding.svelte';
	import Subscription from './onboarding/Subscription.svelte';

	const { session } = $props<{ session: AuthSession }>();

	let loading = $state(true);
	let profile = $state<any>(null);
	let activeSubscription = $state<any>(null);
	let hasUsedTrial = $state(false);

	onMount(async () => {
		if (!session?.user) {
			goto('/');
			return;
		}
		await getProfile();
		if (profile?.id) {
			await checkSubscription();
		}
		loading = false;
	});

	// ✅ Fetch candidate profile
	async function getProfile() {
		try {
			const { user } = session;
			if (!user) return;

			const { data, error, status } = await supabase
				.from('candidates')
				.select('*')
				.eq('user_id', user.id)
				.single();

			if (error && status !== 406) throw error;
			if (data) profile = data;
		} catch (err) {
			console.error('Error loading profile:', err);
		}
	}

	// ✅ Check active subscription & trial usage
	async function checkSubscription() {
		try {
			// Get any active or trialing subscription
			const { data: sub, error } = await supabase
				.from('subscriptions')
				.select(`
					id, status, trial_start, trial_end, plan_id, current_period_end
				`)
				.eq('candidate_id', profile.id)
				.in('status', ['active', 'trialing'])
				.single();

			if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows found"

			if (sub) {
				activeSubscription = sub;
			}

			// Check if user ever had a trial (used or expired)
			const { data: pastTrial } = await supabase
				.from('subscriptions')
				.select('id')
				.eq('candidate_id', profile.id)
				.not('trial_end', 'is', null)
				.limit(1)
				.single();

			if (pastTrial) hasUsedTrial = true;
		} catch (err) {
			console.error('Error checking subscription:', err);
		}
	}

	// ✅ When onboarding completes, reload everything
	async function handleOnboardingComplete() {
		await getProfile();
		await checkSubscription();
	}
</script>

<!-- ✅ View Logic -->
{#if loading}
	<div class="text-center py-5">Loading...</div>

{:else if !profile?.onboarding_completed}
	<!-- Show Onboarding -->
	<CandidateOnboarding {session} on:onboardingComplete={handleOnboardingComplete} />

{:else if !activeSubscription}
	<!-- No active subscription → Show Subscription options -->
	<Subscription {session} excludeTrial={hasUsedTrial} />

{:else}
	<!-- Has active subscription → Show Dashboard -->
	<CandidateDashboard {session} />
{/if}
