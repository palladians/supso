<script lang="ts">
	import EventsChart from '$lib/components/charts/events-chart.svelte';
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { currentProjectId } from '$lib/stores/user';
	import { onMount } from 'svelte';
	import { formatDate } from '$lib/format/date';
	import { SettingsIcon } from 'lucide-svelte';

	onMount(() => {
		currentProjectId.set($page.params.projectId);
	});

	export let data;
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold">Overview</h2>
		<Button href={`/projects/${$page.params.projectId}/settings`} variant="secondary" class="gap-1">
			<SettingsIcon size={16} />
			<span>Project Settings</span>
		</Button>
	</div>
	<div class="grid grid-cols-2 gap-4">
		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<Card.Title>Events</Card.Title>
					<Tabs.Root value="1w">
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
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Event</Table.Head>
							<Table.Head>Channel</Table.Head>
							<Table.Head class="text-right">Created</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.lastFiveEvents as event}
							<Table.Row>
								<Table.Cell>
									<a href={`/events/${event.id}`} class="flex items-center gap-2">
										{#if event.emoji}
											<Badge variant="secondary" class="text-lg">{event.emoji}</Badge>
										{/if}
										<span>
											{event.event}
										</span>
									</a>
								</Table.Cell>
								<Table.Cell>
									<Badge variant="secondary">
										#{event.channel}
									</Badge>
								</Table.Cell>
								<Table.Cell class="text-right">{formatDate(event.createdAt ?? '')}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</div>
