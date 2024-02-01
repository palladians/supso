<script lang="ts">
	import Head from '$lib/components/head.svelte';
	import * as Card from '$lib/components/ui/card';
	import EventsTableShort from '$lib/components/dashboard/events-table-short.svelte';
	import { onMount } from 'svelte';
	import { events } from '$lib/stores/events';
	import { take } from 'rambda';

	export let data;
	export let lastTenEvents = data.lastTenEvents;

	onMount(() => {
		const unsub = events.subscribe((events) => {
			const newEvents = events.map((event) => ({ ...event, new: true }));
			lastTenEvents = take(10, [...newEvents, ...lastTenEvents]);
		});
		return () => {
			unsub();
		};
	});
</script>

<Head title="Projects" />

<div class="container flex flex-1 flex-col">
	<h2 class="py-4 text-lg font-semibold">Latest Events (All projects)</h2>
	<Card.Root class="flex w-full flex-col gap-8 p-6">
		<EventsTableShort lastEvents={lastTenEvents} />
	</Card.Root>
</div>
