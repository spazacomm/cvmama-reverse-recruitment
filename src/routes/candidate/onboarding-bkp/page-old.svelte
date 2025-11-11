<script>
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';

	let full_name = '';
	let phone = '';
	let career_goal = '';
	let loading = false;
	let message = null;
	let messageType = 'success';

	async function completeOnboarding(e) {
		e.preventDefault();
		loading = true;

		const {
			data: { session }
		} = await supabase.auth.getSession();

		if (!session) {
			goto('/login');
			return;
		}

		const { error } = await supabase
			.from('profiles')
			.update({ full_name, phone, career_goal, onboarding_complete: true })
			.eq('id', session.user.id);

		if (error) {
			message = error.message;
			messageType = 'danger';
			loading = false;
			return;
		}

		message = 'Onboarding complete! Redirecting...';
		messageType = 'success';

		setTimeout(() => goto('/dashboard/candidate'), 1200);
	}
</script>

<div class="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-xl-6">

				<div class="">
					<div class="card-body p-4">

						<div class="text-center mb-4">
							<!-- 	<img src="/assets/images/logo-dark.png" height="26" alt="logo" /> -->
							<h4 class="mt-3 mb-1 fw-bold">Welcome to cvmama</h4>
							<p class="text-muted">Before we begin, help us understand you better.</p>
						</div>

						<!-- Onboarding Progress -->
						<div class="mb-4">
							<div class="progress" style="height: 6px;">
								<div class="progress-bar bg-primary" role="progressbar" style="width: 35%;"></div>
							</div>
							<p class="text-center small text-muted mt-2">Step 1 of 3</p>
						</div>

						{#if message}
						<div class="alert alert-{messageType} py-2">
							{message}
						</div>
						{/if}

						<form on:submit={completeOnboarding} class="authentication-form">

							<div class="mb-3">
								<label class="form-label">Full Name</label>
								<input type="text" class="form-control" placeholder="Your full name" bind:value={full_name} required />
							</div>

							<div class="mb-3">
								<label class="form-label">Phone Number</label>
								<input type="tel" class="form-control" placeholder="e.g +2547..." bind:value={phone} required />
							</div>

							<div class="mb-3">
								<label class="form-label">Career Goal</label>
								<textarea class="form-control" rows="3" placeholder="What kind of job are you targeting?"
									bind:value={career_goal}></textarea>
							</div>

							<div class="d-grid mt-4">
								<button class="btn btn-primary" type="submit" disabled={loading}>
									{loading ? 'Saving...' : 'Continue'}
								</button>
							</div>

						</form>
					</div>
				</div>

				<p class="text-center  mt-3 mb-0">
					Need help? <a href="#" class=" fw-semibold">Contact Support</a>
				</p>

			</div>
		</div>
	</div>
</div>
