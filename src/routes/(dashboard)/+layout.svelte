<script lang="ts">
	import Sidebar from '$lib/components/dashboard/sidebar.svelte';
	import Footer from '$lib/components/dashboard/footer.svelte';
	import { subscribeToEvents } from '$lib/realtime/events';
	import { onMount } from 'svelte';
	import { events } from '$lib/stores/events';

	export let data;

	onMount(async () => {
		await subscribeToEvents({
			accessToken: data.user.accessTokens[0].id,
			callback: events.set
		});
	});
</script>

<main class="flex min-h-screen flex-1 gap-4">
	<Sidebar />
	<div class="flex flex-[4] flex-col gap-4">
		<div class="container flex flex-1 flex-col p-2 pb-24">
			<slot />
		</div>
		<Footer />
	</div>
</main>
