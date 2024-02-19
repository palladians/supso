<script lang="ts">
	import PageNavbar from '$lib/components/dashboard/page-navbar.svelte';
	import EventsTable from '$lib/components/dashboard/events-table.svelte';
	import EventsDatePicker from '$lib/components/dashboard/events-date-picker.svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import Combobox from '$lib/components/dashboard/combobox.svelte';
	import { ArrowUp10Icon, ArrowDown01Icon } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	const PAGE_LENGTH = 10;
	export let data;

	$: channelOptions = data.channels.map((channel) => ({ label: `#${channel}`, value: channel }));
	$: eventOptions = data.eventNames.map((event) => ({ label: event, value: event }));
	$: assigneeOptions = data.project.usersToProjects.map((membership) => ({
		label: membership.user.username,
		value: membership.user.id
	}));
	$: lastEventCreatedAt = data.events[PAGE_LENGTH - 1]?.createdAt;

	export const channel = writable<string | null>($page.url.searchParams.get('channel'));
	export const event = writable<string | null>($page.url.searchParams.get('event'));
	export const assigneeId = writable<string | null>($page.url.searchParams.get('assignee_id'));
	export const eventsFrom = writable<string>($page.url.searchParams.get('from') ?? '');
	export const eventsTo = writable<string>($page.url.searchParams.get('to') ?? '');
	export const order = writable<string>($page.url.searchParams.get('order') ?? '');

	const toggleOrder = () => {
		$order === 'asc' ? order.set('') : order.set('asc');
	};

	onMount(() => {
		const unsubChannel = channel.subscribe((newChannel) => {
			if (!browser) return;
			$page.url.searchParams.set('channel', newChannel ?? '');
			goto($page.url, { invalidateAll: true });
		});
		const unsubEvent = event.subscribe((newEvent) => {
			if (!browser) return;
			$page.url.searchParams.set('event', newEvent ?? '');
			goto($page.url, { invalidateAll: true });
		});
		const unsubAssignee = assigneeId.subscribe((newAssignee) => {
			if (!browser) return;
			$page.url.searchParams.set('assignee_id', newAssignee ?? '');
			goto($page.url, { invalidateAll: true });
		});
		const unsubFrom = eventsFrom.subscribe((newFrom) => {
			if (!browser) return;
			$page.url.searchParams.set('from', newFrom ?? '');
			goto($page.url, { invalidateAll: true });
		});
		const unsubTo = eventsTo.subscribe((newTo) => {
			if (!browser) return;
			$page.url.searchParams.set('to', newTo ?? '');
			goto($page.url, { invalidateAll: true });
		});
		const unsubOrder = order.subscribe((newOrder) => {
			if (!browser) return;
			$page.url.searchParams.set('order', newOrder ?? '');
			goto($page.url, { invalidateAll: true });
		});
		return () => {
			unsubChannel();
			unsubEvent();
			unsubAssignee();
			unsubFrom();
			unsubTo();
			unsubOrder();
		};
	});
</script>

<div class="container flex flex-col">
	<PageNavbar title="Events">
		<Button variant="secondary" size="icon" slot="addon" on:click={toggleOrder}>
			{#if $order === 'asc'}
				<ArrowDown01Icon size={16} />
			{:else}
				<ArrowUp10Icon size={16} />
			{/if}
		</Button>
	</PageNavbar>
	<div class="flex items-center justify-between gap-2 py-4">
		<h2 class="font-semibold">Filters</h2>
		<div class="flex items-center gap-2">
			<EventsDatePicker value={eventsFrom} placeholder="Pick from" />
			<EventsDatePicker value={eventsTo} placeholder="Pick to" />
			<Combobox placeholder="Channel" options={channelOptions} value={channel} />
			<Combobox placeholder="Event" options={eventOptions} value={event} />
			<Combobox placeholder="Assignee" options={assigneeOptions} value={assigneeId} />
		</div>
	</div>
	<Card.Root>
		<EventsTable events={data.events} className="border-b" />
		{#if lastEventCreatedAt}
			<div class="m-4">
				<Button href={`?to=${lastEventCreatedAt}`} variant="secondary">Next Page</Button>
			</div>
		{/if}
	</Card.Root>
</div>
