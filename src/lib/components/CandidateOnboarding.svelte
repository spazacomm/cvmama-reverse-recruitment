<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { onMount, createEventDispatcher } from 'svelte';
	import type { AuthSession } from '@supabase/supabase-js';

	// ✅ Import onboarding steps config
	import { onboardingSteps } from '$lib/config/onboardingSteps';

	export let session: AuthSession | null = null;

	const dispatch = createEventDispatcher();

	let candidateId: string | null = null;
	let steps: { step_name: string; status: string }[] = [];
	let currentStep: string | null = null;
	let loading = true;

	onMount(async () => {
		if (!session?.user) return;

		loading = true;

		// ✅ Fetch candidate ID
		const { data: candidate } = await supabase
			.from('candidates')
			.select('id')
			.eq('user_id', session.user.id)
			.single();

		if (!candidate) {
			loading = false;
			return;
		}

		candidateId = candidate.id;

		// ✅ Fetch existing steps
		const { data: existingSteps } = await supabase
			.from('candidate_onboarding_steps')
			.select('*')
			.eq('candidate_id', candidateId);

		steps = existingSteps || [];

		// ✅ Determine next pending step
		const nextPending = steps.find((s) => s.status === 'pending');
		currentStep = nextPending ? nextPending.step_name : null;

		loading = false;
	});

	// ✅ When a step is completed
	async function handleStepComplete() {
		if (!currentStep) return;

		await supabase
			.from('candidate_onboarding_steps')
			.update({ status: 'completed', updated_at: new Date().toISOString() })
			.eq('candidate_id', candidateId)
			.eq('step_name', currentStep);

		// Update local steps array
		steps = steps.map((s) =>
			s.step_name === currentStep ? { ...s, status: 'completed' } : s
		);

		const nextPending = steps.find((s) => s.status === 'pending');
		currentStep = nextPending ? nextPending.step_name : null;

		// ✅ If no steps pending, mark onboarding complete
		if (!nextPending) {
			await supabase
				.from('candidates')
				.update({ onboarding_completed: true, updated_at: new Date().toISOString() })
				.eq('id', candidateId);

			dispatch('onboardingComplete');
		}
	}
</script>

{#if loading}
	<div class="text-center py-5">
		<div class="spinner-border text-primary" role="status"></div>
		<p class="mt-3">Loading onboarding step...</p>
	</div>
{:else if currentStep}
	<div class="container py-4">
		<svelte:component
			this={onboardingSteps.find((s) => s.name === currentStep)?.component}
			{session}
			on:stepComplete={handleStepComplete}
		/>
	</div>
{/if}
