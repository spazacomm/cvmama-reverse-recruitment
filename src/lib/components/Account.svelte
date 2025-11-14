<script lang="ts">
	import { onMount } from 'svelte';
	import type { AuthSession } from '@supabase/supabase-js';
	import { supabase } from '../supabaseClient';
	import Avatar from './Avatar.svelte';
	import CandidateDashboard from './CandidateDashboard.svelte';
	import CandidateOnboarding from './CandidateOnboarding.svelte';
	import CandidatePortal from './CandidatePortal.svelte';

	// ✅ Props (Svelte 5 runes mode)
	const { session } = $props<{ session: AuthSession }>();

	// ✅ Reactive state
	let loading = $state(false);


	// ✅ Computed role (plain const is fine, no reactivity needed)
	const role = session?.user?.user_metadata?.role;

	

	
	async function logout() {
		await supabase.auth.signOut();
		// Example: navigate to login if using @sveltejs/kit
		// goto('/');
	}
</script>

<!-- START Wrapper -->
<div class="wrapper">
	<!-- ========== Topbar Start ========== -->
	<header class="topbar">
		<div class="container-xxl">
			<div class="navbar-header d-flex justify-between align-items-center">
				<div class="d-flex align-items-center gap-2">
					<div class="topbar-item">
						<button type="button" class="button-toggle-menu">
							<iconify-icon
								icon="iconamoon:menu-burger-horizontal"
								class="fs-22"
							></iconify-icon>
						</button>
					</div>
				</div>

				<div class="d-flex align-items-center gap-1">
					<!-- Notifications -->
					<div class="dropdown topbar-item">
						<button
							type="button"
							class="topbar-button position-relative"
							data-bs-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
							<iconify-icon
								icon="iconamoon:notification-duotone"
								class="fs-24 align-middle"
							></iconify-icon>
							<span
								class="position-absolute topbar-badge fs-10 translate-middle badge bg-danger rounded-pill"
								>3<span class="visually-hidden">unread messages</span></span
							>
						</button>
						<!-- You can fill dropdown items here -->
					</div>

					<!-- User Dropdown -->
					<div class="dropdown topbar-item">
						<a
							type="button"
							class="topbar-button"
							id="page-header-user-dropdown"
							data-bs-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
							<span class="d-flex align-items-center">
								<img
									class="rounded-circle"
									width="32"
									src={session?.user?.user_metadata?.avatar_url ?? '/assets/images/default-avatar.png'}
									alt="avatar"
								/>
							</span>
						</a>

						<div class="dropdown-menu dropdown-menu-end">
							<h6 class="dropdown-header">
								{session?.user?.user_metadata?.full_name ?? 'User'}
							</h6>

							<!-- <a class="dropdown-item" href="/candidate/profile">
								<i class="bx bx-user-circle text-muted fs-18 align-middle me-1"></i>
								<span class="align-middle">Profile</span>
							</a>

							<a class="dropdown-item" href="/candidate/subscriptions">
								<i class="bx bx-wallet text-muted fs-18 align-middle me-1"></i>
								<span class="align-middle">Subscriptions</span>
							</a> -->

							<a class="dropdown-item" href="/faq">
								<i class="bx bx-help-circle text-muted fs-18 align-middle me-1"></i>
								<span class="align-middle">Help</span>
							</a>

							<div class="dropdown-divider my-1"></div>

							<a class="dropdown-item text-danger" href="#" on:click={logout}>
								<i class="bx bx-log-out fs-18 align-middle me-1"></i>
								<span class="align-middle">Logout</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- ========== Topbar End ========== -->

	<!-- Role-based content -->
	{#if loading}
		<div class="text-center py-5">Loading...</div>
	{:else if role === 'candidate'}
		
		<CandidatePortal {session} />
       
	
	{:else if role === 'agent'}
		<CandidateDashboard {session} />
	{:else if role === 'admin'}
		<CandidateDashboard {session} />
	{/if}
</div>
