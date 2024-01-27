<script lang="ts">
	import EventsChart from '$lib/components/charts/events-chart.svelte';
	import EventsTableShort from '$lib/components/dashboard/events-table-short.svelte';
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { SettingsIcon } from 'lucide-svelte';
	import { events } from '$lib/stores/events';
	import { take } from 'rambda';
	import { goto } from '$app/navigation';

	export let data;
	export let lastFiveEvents = data.lastFiveEvents;

	onMount(() => {
		events.subscribe((events) => {
			const newEvents = events
				.filter((event) => event.projectId === $page.params.projectId)
				.map((event) => ({ ...event, new: true }));
			lastFiveEvents = take(5, [...newEvents, ...lastFiveEvents]);
		});
	});
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<div class="flex flex-col">
			<div class="text-muted-foreground flex gap-2 text-sm">
				<a href="/projects">Projects</a>
				<p class="text-muted">/</p>
				<a href={`/projects/${data.project.id}`}>{data.project.name}</a>
			</div>
			<h2 class="text-lg font-semibold">Overview</h2>
		</div>
		{#if data.role === 'admin'}
			<Button
				href={`/projects/${$page.params.projectId}/settings`}
				variant="secondary"
				class="gap-1"
			>
				<SettingsIcon size={16} />
				<span>Project Settings</span>
			</Button>
		{/if}
	</div>
	<div class="grid grid-cols-2 gap-4">
		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<Card.Title>Events</Card.Title>
					<Tabs.Root
						value={data.duration}
						onValueChange={(value) => {
							if (!value) return;
							$page.url.searchParams.set('duration', value);
							goto($page.url);
						}}
					>
						<Tabs.List>
							<Tabs.Trigger value="1y">1y</Tabs.Trigger>
							<Tabs.Trigger value="1m">1m</Tabs.Trigger>
							<Tabs.Trigger value="1w">1w</Tabs.Trigger>
						</Tabs.List>
					</Tabs.Root>
				</div>
			</Card.Header>
			<Card.Content>
				<EventsChart data={data.eventsChartData} />
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<Card.Title>Latest Events</Card.Title>
					<Button href={`/projects/${$page.params.projectId}/events`} size="sm" variant="secondary"
						>All Events</Button
					>
				</div>
			</Card.Header>
			<Card.Content>
				<EventsTableShort lastEvents={lastFiveEvents} />
			</Card.Content>
		</Card.Root>
	</div>
</div>
