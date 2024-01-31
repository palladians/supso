<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { BellDotIcon, BellIcon } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import type { Event } from '$lib/db/schema';
	import { onMount } from 'svelte';
	import { events } from '$lib/stores/events';
	import { take } from 'rambda';
	import { cn } from '$lib/utils';

	export const open = writable<boolean>(false);
	export const notifications = writable<Event[]>($page.data.notifications);
	export const dirty = writable<boolean>(false);

	onMount(() => {
		const unsubOpen = open.subscribe((newState) => newState && dirty.set(false));
		const unsubEvents = events.subscribe((newEvents) => {
			if (newEvents.length === 0) return;
			const eventsToNotify = newEvents.filter((event) => event.notify === 'true');
			if (eventsToNotify.length === 0) return;
			const newNotifications = take(5, [...eventsToNotify, ...$notifications]);
			notifications.set(newNotifications);
			dirty.set(true);
		});
		return () => {
			unsubOpen();
			unsubEvents();
		};
	});
</script>

<Popover.Root open={$open} onOpenChange={(value) => open.set(value)}>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			size="icon"
			variant="outline"
			class={cn($dirty && 'text-teal-400')}
		>
			{#if $dirty}
				<BellDotIcon size={16} />
			{:else}
				<BellIcon size={16} />
			{/if}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="flex w-full max-w-[24rem] flex-col p-0">
		<h2 class="p-4">Notifications</h2>
		<Table.Root class="max-w-[24rem]">
			<Table.Header class="max-w-[24rem]">
				<Table.Row class="flex max-w-[23.75rem] items-center">
					<Table.Head class="flex-1 pt-3">Event</Table.Head>
					<Table.Head class="flex-1 pt-3">Channel</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body class="max-w-[24rem]">
				{#each $notifications as notification}
					<Table.Row class="flex max-w-[23.75rem] items-center">
						<Table.Cell class="flex-1 truncate">
							<a href={`/events/${notification.id}`} on:click={() => open.set(false)}
								>{notification.event}</a
							></Table.Cell
						>
						<Table.Cell class="flex-1 truncate">#{notification.channel}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Popover.Content>
</Popover.Root>
