<script lang="ts">
	import EventsChart from '$lib/components/charts/events-chart.svelte';
	import EventsTable from '$lib/components/dashboard/events-table.svelte';
	import PageTitle from '$lib/components/dashboard/page-navbar.svelte';
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { SettingsIcon } from 'lucide-svelte';
	import { events } from '$lib/stores/events';
	import { take } from 'rambda';
	import { goto } from '$app/navigation';
	import { sidebar } from '$lib/stores/sidebar';

	export let data;
	export let lastFiveEvents = data.lastFiveEvents;

	onMount(() => {
		sidebar.set({ ...$sidebar, [data.project.id]: true });
		const unsub = events.subscribe((events) => {
			const newEvents = events
				.filter((event) => event.projectId === $page.params.projectId)
				.map((event) => ({ ...event, new: true }));
			lastFiveEvents = take(5, [...newEvents, ...lastFiveEvents]);
		});
		return () => {
			unsub();
		};
	});
</script>

<div class="container flex flex-col">
	<PageTitle title="Overview">
		<div slot="addon">
			{#if data.role === 'admin'}
				<Button
					size="sm"
					href={`/projects/${$page.params.projectId}/settings`}
					variant="secondary"
					class="gap-1"
				>
					<SettingsIcon size={16} />
					<span>Project Settings</span>
				</Button>
			{/if}
		</div>
	</PageTitle>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<Card.Root>
			<Card.Header class="py-4">
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
			<Card.Header class="py-4">
				<div class="flex items-center justify-between">
					<Card.Title>Latest Events</Card.Title>
					<Button href={`/projects/${$page.params.projectId}/events`} size="sm" variant="secondary"
						>All Events</Button
					>
				</div>
			</Card.Header>
			<EventsTable events={lastFiveEvents} hideActions hideAssignee hideNotify />
		</Card.Root>
	</div>
</div>
