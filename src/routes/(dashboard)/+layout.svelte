<script lang="ts">
	import Sidebar from '$lib/components/dashboard/sidebar.svelte';
	import Footer from '$lib/components/dashboard/footer.svelte';
	import { subscribeToEvents } from '$lib/realtime/events';
	import { onMount } from 'svelte';
	import { events } from '$lib/stores/events';

	export let data;

	onMount(async () => {
		const { cancel } = await subscribeToEvents({
			accessToken: data.user.accessTokens[0].id,
			callback: events.set
		});
		return () => {
			cancel();
		};
	});
</script>

<main class="grid max-w-[100vw] flex-1 grid-cols-[min-content_1fr] gap-4">
	<Sidebar />
	<div class="flex flex-[4] flex-col gap-4">
		<div class="flex flex-1 flex-col pb-24">
			<slot />
		</div>
		<Footer />
	</div>
</main>
