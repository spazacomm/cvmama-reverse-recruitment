<script lang="ts">
	import { supabase } from '../supabaseClient';
	import { onMount, createEventDispatcher } from 'svelte';
	import type { AuthSession } from '@supabase/supabase-js';

	import BasicInfo from './onboarding/BasicInfo.svelte';
	import CareerInfo from './onboarding/CareerInfo.svelte';
	import ResumeUpload from './onboarding/ResumeUpload.svelte';
	import ConsentDefault from './onboarding/ConsentDefault.svelte';
   

	export let session: AuthSession | null = null;

	let currentStep: string | null = null;
	let candidateId: string | null = null;
	let steps: any[] = [];
	let loading = true;
	let message = '';

	const stepComponents = {
		step1_basic_info: BasicInfo,
		step2_career_info: CareerInfo,
		step3_resume_upload: ResumeUpload,
		step4_consents: ConsentDefault,
        
	};

	const dispatch = createEventDispatcher();

	onMount(async () => {
		if (!session?.user) return;
		loading = true;

		const { data: candidate } = await supabase
			.from('candidates')
			.select('id, onboarding_completed')
			.eq('user_id', session.user.id)
			.single();

		if (!candidate) {
			message = 'Candidate not found.';
			loading = false;
			return;
		}

		candidateId = candidate.id;

		// ✅ If already completed, no need to fetch steps — immediately dispatch
		if (candidate.onboarding_completed) {
			dispatch('onboardingComplete');
			loading = false;
			return;
		}

		// Otherwise, continue checking steps
		const { data: existingSteps, error } = await supabase
			.from('candidate_onboarding_steps')
			.select('*')
			.eq('candidate_id', candidate.id);

		if (error) {
			console.error(error);
			loading = false;
			return;
		}

		if (!existingSteps?.length) {
			const defaultSteps = Object.keys(stepComponents).map((step) => ({
				candidate_id: candidate.id,
				step_name: step,
				status: 'pending'
			}));
			await supabase.from('candidate_onboarding_steps').insert(defaultSteps);
			steps = defaultSteps;
		} else {
			steps = existingSteps;
		}

		// ✅ Check if all steps are already completed
		const allDone = steps.every((s) => s.status === 'completed');
		if (allDone) {
			await supabase
				.from('candidates')
				.update({ onboarding_completed: true, updated_at: new Date().toISOString() })
				.eq('id', candidateId);

			dispatch('onboardingComplete');
			loading = false;
			return;
		}

		// Otherwise pick the next pending step
		const nextPending = steps.find((s) => s.status === 'pending');
		currentStep = nextPending ? nextPending.step_name : null;

		loading = false;
	});

	// ✅ When a step is completed
	async function handleStepComplete() {
		if (!candidateId || !currentStep) return;

		await supabase
			.from('candidate_onboarding_steps')
			.update({ status: 'completed', updated_at: new Date().toISOString() })
			.eq('candidate_id', candidateId)
			.eq('step_name', currentStep);

		const { data: updatedSteps } = await supabase
			.from('candidate_onboarding_steps')
			.select('*')
			.eq('candidate_id', candidateId);

		steps = updatedSteps || [];

		const nextPending = steps.find((s) => s.status === 'pending');
		currentStep = nextPending ? nextPending.step_name : null;

		// ✅ If all steps done — mark onboarding completed and dispatch event
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
		<p class="mt-3">Loading onboarding steps...</p>
	</div>
{:else if currentStep}
	<div class="container py-4">
		<svelte:component
			this={stepComponents[currentStep]}
			{session}
			on:stepComplete={handleStepComplete}
		/>
	</div>
{:else}
	<div class="alert alert-success text-center my-5">
		🎉 All onboarding steps are completed!
	</div>
{/if}
