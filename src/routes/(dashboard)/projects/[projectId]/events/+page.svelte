<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { formatDate } from '$lib/format/date';
	import Combobox from '$lib/components/dashboard/combobox.svelte';
	import { XIcon, CheckIcon } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const PAGE_LENGTH = 10;
	export let data;

	$: channelOptions = data.channels.map((channel) => ({ label: `#${channel}`, value: channel }));
	$: eventOptions = data.eventNames.map((event) => ({ label: event, value: event }));
	$: lastEventCreatedAt = data.events[PAGE_LENGTH - 1]?.createdAt;

	export const channel = writable<string | null>($page.url.searchParams.get('channel'));
	export const event = writable<string | null>($page.url.searchParams.get('event'));

	channel.subscribe((newChannel) => {
		if (!browser) return;
		$page.url.searchParams.set('channel', newChannel ?? '');
		goto($page.url);
	});

	event.subscribe((newEvent) => {
		if (!browser) return;
		$page.url.searchParams.set('event', newEvent ?? '');
		goto($page.url);
	});
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold">Events</h2>
		<div class="flex items-center gap-2">
			<Combobox placeholder="Channel" options={channelOptions} value={channel} />
			<Combobox placeholder="Event" options={eventOptions} value={event} />
		</div>
	</div>
	<Card.Root class="p-6">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Event</Table.Head>
					<Table.Head>Channel</Table.Head>
					<Table.Head>Notify</Table.Head>
					<Table.Head class="text-right">Created</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.events as event}
					<Table.Row>
						<Table.Cell>
							<a href={`/events/${event.id}`} class="flex items-center gap-2">
								{#if event.emoji}
									<Badge variant="secondary" class="text-lg">{event.emoji}</Badge>
								{/if}
								<span>{event.event}</span>
							</a>
						</Table.Cell>
						<Table.Cell>
							<Badge variant="secondary">#{event.channel}</Badge>
						</Table.Cell>
						<Table.Cell>
							<Badge variant="secondary">
								{#if event.notify}
									<CheckIcon size={16} />
								{:else}
									<XIcon size={16} />
								{/if}
							</Badge>
						</Table.Cell>
						<Table.Cell>
							<div class="flex items-center justify-end gap-2">
								<span>{formatDate(event.createdAt ?? '')}</span>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
			{#if lastEventCreatedAt}
				<Table.Caption class="text-left">
					<Button href={`?last_cursor=${lastEventCreatedAt}`} variant="secondary">Next Page</Button>
				</Table.Caption>
			{/if}
		</Table.Root>
	</Card.Root>
</div>
