// src/lib/server/onboarding.ts
import { supabase } from '$lib/supabaseClient';
import { onboardingSteps } from '$lib/config/onboardingSteps';

export async function isOnboardingComplete(userId: string) {
    // 1️⃣ Get candidate
    const { data: candidate } = await supabase
        .from('candidates')
        .select('id, onboarding_completed')
        .eq('user_id', userId)
        .single();

    if (!candidate) return false;

    const candidateId = candidate.id;

    // 2️⃣ If flag already true, skip step fetch
   // if (candidate.onboarding_completed) return true;

    // 3️⃣ Fetch existing steps from DB
    const { data: existingSteps, error } = await supabase
        .from('candidate_onboarding_steps')
        .select('step_name, status')
        .eq('candidate_id', candidateId);

    if (error) throw error;

    const existingStepNames = existingSteps?.map((s) => s.step_name) || [];

    // 4️⃣ Insert missing steps
    const missingSteps = onboardingSteps.filter((step) => !existingStepNames.includes(step.name));

    if (missingSteps.length > 0) {
        
        const defaultSteps = missingSteps.map((step) => ({
            candidate_id: candidateId,
            step_name: step.name,
            status: 'pending'
        }));

        await supabase.from('candidate_onboarding_steps').insert(defaultSteps);
    }

    // 5️⃣ Refetch all steps after inserting missing ones
    const { data: allSteps } = await supabase
        .from('candidate_onboarding_steps')
        .select('status')
        .eq('candidate_id', candidateId);

    if (!allSteps || allSteps.length === 0) return false;

    // 6️⃣ Check if any step is pending
    const anyPending = allSteps.some((s) => s.status !== 'completed');

    // 7️⃣ Update onboarding_completed flag
    await supabase
        .from('candidates')
        .update({ onboarding_completed: !anyPending, updated_at: new Date().toISOString() })
        .eq('id', candidateId);

    return !anyPending;
}
