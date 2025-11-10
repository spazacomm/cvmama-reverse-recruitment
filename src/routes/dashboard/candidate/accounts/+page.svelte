<script>
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';

	let message = null;
	let messageType = 'success';
	let loading = false;

	const {
			data: { session }
		} = await supabase.auth.getSession();

		if (!session) {
			goto('/login');
		}

	async function completeStep() {
		loading = true;

		

		const { error } = await supabase
			.from('profiles')
			.update({ accounts_connected: true })
			.eq('id', session.user.id);

		if (error) {
			message = error.message;
			messageType = 'danger';
			loading = false;
			return;
		}

		message = 'Step complete! Redirecting...';
		messageType = 'success';

		setTimeout(() => goto('/onboarding/roadmap'), 1200);
	}
</script>

<div class="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-xl-6">

				<div class="card auth-card">
					<div class="card-body p-4">

						<div class="text-center mb-4">
							<img src="/assets/images/logo-dark.png" height="26" alt="logo" />
							<h4 class="mt-3 mb-1 fw-bold">Connect Your Accounts</h4>
							<p class="text-muted">We use your accounts to automate job applications.</p>
						</div>

						<!-- Progress -->
						<div class="mb-4">
							<div class="progress" style="height: 6px;">
								<div class="progress-bar bg-primary" role="progressbar" style="width: 65%;"></div>
							</div>
							<p class="text-center small text-muted mt-2">Step 2 of 3</p>
						</div>

						{#if message}
						<div class="alert alert-{messageType} py-2">
							{message}
						</div>
						{/if}

						<div class="list-group">

							<button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
								<div class="d-flex align-items-center">
									<img src="/assets/images/brands/linkedin.png" class="me-3" style="height:24px;" />
									<span class="fw-semibold">Connect LinkedIn</span>
								</div>
								<span class="badge bg-primary rounded-pill">Connect</span>
							</button>

							<button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
								<div class="d-flex align-items-center">
									<img src="/assets/images/brands/google.png" class="me-3" style="height:24px;" />
									<span class="fw-semibold">Connect Gmail</span>
								</div>
								<span class="badge bg-primary rounded-pill">Connect</span>
							</button>

							<button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
								<div class="d-flex align-items-center">
									<img src="/assets/images/brands/indeed.png" class="me-3" style="height:24px;" />
									<span class="fw-semibold">Connect Indeed</span>
								</div>
								<span class="badge bg-primary rounded-pill">Connect</span>
							</button>

						</div>

						<div class="alert alert-info mt-3 small">
							You can skip this now and connect later from your profile settings.
						</div>

						<div class="d-grid mt-4">
							<button class="btn btn-primary" on:click={completeStep} disabled={loading}>
								{loading ? 'Saving...' : 'Continue'}
							</button>
						</div>

					</div>
				</div>

			</div>
		</div>
	</div>
</div>
