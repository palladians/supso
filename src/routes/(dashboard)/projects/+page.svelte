<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import EventsTableShort from '$lib/components/dashboard/events-table-short.svelte';
	import { onMount } from 'svelte';
	import { events } from '$lib/stores/events';
	import { take } from 'rambda';

	export let data;
	export let lastTenEvents = data.lastTenEvents;

	onMount(() => {
		events.subscribe((events) => {
			const newEvents = events.map((event) => ({ ...event, new: true }));
			lastTenEvents = take(10, [...newEvents, ...lastTenEvents]);
		});
	});
</script>

<div class="flex flex-1">
	<Card.Root class="flex w-full flex-col gap-8 p-4">
		<h2 class="text-lg font-semibold">Latest Events (All projects)</h2>
		<EventsTableShort lastEvents={lastTenEvents} />
	</Card.Root>
</div>
