<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { onMount, createEventDispatcher} from 'svelte';
	import { tick } from 'svelte';

	export let session;
	export let excludeTrial = false;
	export let currentPlanId: string | null = null;

	 
    const dispatch = createEventDispatcher();

	let plans = [];
	let loading = true;
	let toasts: { id: number; message: string; type: 'success' | 'error' }[] = [];
	let purchasingPlans: Record<string, boolean> = {}; // track per plan
	let candidate: { id: string } | null = null;

	let toastId = 0;

	function showToast(message: string, type: 'success' | 'error' = 'success') {
		const id = toastId++;
		toasts = [...toasts, { id, message, type }];
		setTimeout(() => {
			toasts = toasts.filter((t) => t.id !== id);
		}, 3000);
	}

	// Fetch candidate data
	async function fetchCandidate() {
		if (!session?.user) return;
		const { data, error } = await supabase
			.from('candidates')
			.select('id')
			.eq('user_id', session.user.id)
			.single();

		if (error) {
			console.error('Error fetching candidate:', error);
			showToast('Could not fetch candidate info.', 'error');
			return;
		}
		candidate = data;
	}

	onMount(async () => {
		await fetchCandidate();

		let query = supabase
			.from('plans')
			.select('*')
			.eq('is_active', true)
			.order('display_order', { ascending: true });

		if (excludeTrial) query = query.neq('slug', 'free-trial');

		const { data, error } = await query;
		if (error) console.error('Error fetching plans:', error);
		else plans = data;

		loading = false;
	});

	async function handleSubscribe(plan) {
		if (!session?.user) {
			showToast('Please log in to subscribe to a plan.', 'error');
			return;
		}
		if (!candidate) {
			showToast('Candidate info missing.', 'error');
			return;
		}

		purchasingPlans[plan.id] = true;

		try {
			const startDate = new Date().toISOString();
			const endDate = new Date(
				new Date().setMonth(new Date().getMonth() + (plan.duration_months || 1))
			).toISOString();

			if (plan.price_usd === 0) {
				// Trial subscription
				const { error } = await supabase.from('subscriptions').insert([
					{
						candidate_id: candidate.id,
						plan_id: plan.id,
						status: 'trialing',
						trial_start: startDate,
						trial_end: endDate,
						current_period_start: startDate,
						current_period_end: endDate,
						jobs_limit: plan.max_jobs,
						agent_hours_limit: plan.agent_hours_per_month || null
					}
				]);

				if (error) throw error;
				currentPlanId = plan.id;
				showToast('Trial activated! 🎉', 'success');

				setTimeout(() => {
          dispatch('subscriptionComplete', {
            currentPlanId,
            candidate.id
          });
        }, 1000);

			} else {
				// Paid subscription (mock)
				await tick();
				await new Promise((r) => setTimeout(r, 1500));

				const { error } = await supabase.from('subscriptions').insert([
					{
						candidate_id: candidate.id,
						plan_id: plan.id,
						status: 'active',
						current_period_start: startDate,
						current_period_end: endDate,
						is_trial: false,
						jobs_limit: plan.max_jobs,
						agent_hours_limit: plan.agent_hours_per_month || null
					}
				]);

				if (error) throw error;
				currentPlanId = plan.id;
				showToast(`Subscription to ${plan.name} activated! ✅`, 'success');
			}
		} catch (err: any) {
			console.error(err);
			showToast(err.message || 'Something went wrong.', 'error');
		} finally {
			purchasingPlans[plan.id] = false;
		}
	}
</script>



{#if loading}
	<div class="text-center py-5">Loading plans...</div>
{:else}
<!-- Start Container xxl -->
<div class="container-xxl">
	<div class="row">
		<div class="col-12">
			<div class="text-center my-4">
				<h3>Simple Pricing Plans</h3>
				<p class="text-muted text-center">
					Get the power and control you need to manage your career with confidence
				</p>
			</div>

			<div class="row justify-content-center">
				{#each plans as plan}
					<div class="col-lg-3 mb-4">
						<div class="card card-pricing">
							<div class="card-body">
								{#if plan.is_featured}
									<div class="pricing-ribbon pricing-ribbon-primary float-end">
										Popular
									</div>
								{/if}

								<h5 class="mt-0 mb-3 fs-14 text-uppercase fw-semibold">{plan.name}</h5>
								<h2 class="mt-0 mb-3 fw-bold">
									${plan.price_usd}
									<span class="fs-14 fw-medium text-muted">
										/ {plan.duration_months > 1 ? `${plan.duration_months} months` : 'month'}
									</span>
								</h2>

								<p>{plan.description}</p>

								<ul class="card-pricing-features text-muted border-top pt-2 mt-2 ps-0 list-unstyled">
									<li class="text-dark">
										<i class="bx bx-check-circle text-primary fs-15 me-1"></i>
										Up to {plan.max_jobs} job applications
									</li>

									{#if plan.agent_hours_per_month}
										<li class="text-dark">
											<i class="bx bx-check-circle text-primary fs-15 me-1"></i>
											{plan.agent_hours_per_month} hrs agent support
										</li>
									{/if}

									<li class="text-dark">
										<i class="bx bx-check-circle text-primary fs-15 me-1"></i>
										{plan.career_stages?.length
											? plan.career_stages.join(', ')
											: 'All career stages'}
									</li>
								</ul>

								<div class="mt-4 text-center">
									{#if currentPlanId === plan.id}
										<button class="btn btn-primary px-sm-4 disabled w-100">
											Current Plan
										</button>
									{:else}
                                    <button
                                    class="btn btn-primary px-sm-4 w-100"
                                    on:click={() => handleSubscribe(plan)}
                                    disabled={purchasingPlans[plan.id]}
                                >
                                    {purchasingPlans[plan.id] ? 'Processing...' : 'Get Started'}
                                </button>
                                
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Toast container -->
	<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
		{#each toasts as toast (toast.id)}
			<div class="toast align-items-center text-bg-{toast.type === 'success' ? 'success' : 'danger'} show mb-2" role="alert">
				<div class="d-flex">
					<div class="toast-body">{toast.message}</div>
					<button type="button" class="btn-close btn-close-white me-2 m-auto" on:click={() => toasts = toasts.filter(t => t.id !== toast.id)}></button>
				</div>
			</div>
		{/each}
	</div>
</div>
{/if}
