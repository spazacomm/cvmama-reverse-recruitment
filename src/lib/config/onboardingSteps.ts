// src/lib/config/onboardingSteps.ts

import BasicInfo from '$lib/components/onboarding/BasicInfo.svelte';
import CareerInfo from '$lib/components/onboarding/CareerInfo.svelte';
import ResumeUpload from '$lib/components/onboarding/ResumeUpload.svelte';
import JobPreference from '$lib/components/onboarding/JobPreference.svelte';
import ConsentDefault from '$lib/components/onboarding/ConsentDefault.svelte';

// ✅ Centralized step definitions
export const onboardingSteps = [
	{ name: 'step1_basic_info', component: BasicInfo },
	{ name: 'step2_career_info', component: CareerInfo },
	{ name: 'step3_resume_upload', component: ResumeUpload },
	{ name: 'step_preference', component: JobPreference },
	{ name: 'step4_consents', component: ConsentDefault },
];

  