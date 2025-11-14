<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { AuthSession } from '@supabase/supabase-js';

	import CandidateDashboard from './CandidateDashboard.svelte';
	import CandidateOnboarding from './CandidateOnboarding.svelte';
	import Subscription from './onboarding/Subscription.svelte';

	// ✅ Import server onboarding helper
	import { isOnboardingComplete } from '$lib/utils/onboarding';

	const { session } = $props<{ session: AuthSession }>();

	let loading = $state(true);
	let profile = $state<any>(null);
	let activeSubscription = $state<any>(null);
	let hasUsedTrial = $state(false);
	let onboardingComplete = $state(false);

	onMount(async () => {
		if (!session?.user) {
			goto('/');
			return;
		}

		await getProfile();

		if (profile?.id) {
			// ✅ Check onboarding status using the centralized function
			onboardingComplete = await isOnboardingComplete(session.user.id);
			console.log('onboarding status');
			console.log(onboardingComplete);

			// ✅ Only check subscription if onboarding is complete
			if (onboardingComplete) {
				await checkSubscription();
			}
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
			const { data: sub, error } = await supabase
				.from('subscriptions')
				.select('id, status, trial_start, trial_end, plan_id, current_period_end')
				.eq('candidate_id', profile.id)
				.in('status', ['active', 'trialing'])
				.single();

			if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows found"

			if (sub) activeSubscription = sub;

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
		onboardingComplete = await isOnboardingComplete(session.user.id);
		if (onboardingComplete) {
			await checkSubscription();
		}
	}

	// ✅ When onboarding completes, reload everything
	// ✅ When subscription completes, reload subscription status
async function handleSubscriptionComplete() {
	try {
		if (!profile?.id) return;

		// Re-check active subscription
		const { data: sub, error } = await supabase
			.from('subscriptions')
			.select('id, status, trial_start, trial_end, plan_id, current_period_end')
			.eq('candidate_id', profile.id)
			.in('status', ['active', 'trialing'])
			.single();

		if (error && error.code !== 'PGRST116') throw error;

		if (sub) activeSubscription = sub;
	} catch (err) {
		console.error('Error updating subscription:', err);
	}
}


</script>

<!-- ✅ View Logic -->
{#if loading}
	<div class="text-center py-5">Loading...</div>

{:else if !onboardingComplete}
	<!-- Show Onboarding -->
	<CandidateOnboarding {session} on:onboardingComplete={handleOnboardingComplete} />

{:else if !activeSubscription}
	<!-- No active subscription → Show Subscription options -->
	<Subscription {session} excludeTrial={hasUsedTrial} on:subscriptionComplete={handleSubscriptionComplete} />

{:else}
	<!-- Has active subscription → Show Dashboard -->
	<CandidateDashboard {session} />
{/if}
