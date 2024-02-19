<script lang="ts">
	import { type Event } from '$lib/db/schema';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { CheckIcon, XIcon, MoreVerticalIcon } from 'lucide-svelte';
	import { formatDate } from '$lib/format/date';
	import { cn } from '$lib/utils';

	type EventWithNew = Event & { new: boolean };
	export let events: EventWithNew[];
	export let hideAssignee: boolean = false;
	export let hideActions: boolean = false;
	export let hideNotify: boolean = false;
	export let className: string = '';
</script>

<Table.Root class={className}>
	<Table.Header>
		<Table.Row>
			<Table.Head>Event</Table.Head>
			<Table.Head>Channel</Table.Head>
			{#if !hideNotify}
				<Table.Head>Notify</Table.Head>
			{/if}
			{#if !hideAssignee}
				<Table.Head>Assignee</Table.Head>
			{/if}
			<Table.Head>Created</Table.Head>
			{#if !hideActions}
				<Table.Head class="text-right">Actions</Table.Head>
			{/if}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each events as event}
			<Table.Row>
				<Table.Cell>
					<a href={`/events/${event.id}`} class="flex items-center gap-2">
						{#if event.emoji}
							<Badge
								variant="secondary"
								class={cn(
									'text-md h-8 w-8',
									event.new && 'bg-gradient-to-tr from-teal-500 via-green-500 to-yellow-300'
								)}>{event.emoji}</Badge
							>
						{/if}
						<span>{event.event}</span>
					</a>
				</Table.Cell>
				<Table.Cell>
					<Button
						href={`/projects/${event.projectId}/events?channel=${event.channel}`}
						variant="link"
						class="text-foreground p-0"
					>
						#{event.channel}
					</Button>
				</Table.Cell>
				{#if !hideNotify}
					<Table.Cell>
						{#if event.notify === 'true'}
							<CheckIcon size={16} />
						{:else}
							<XIcon size={16} />
						{/if}
					</Table.Cell>
				{/if}
				{#if !hideAssignee}
					<Table.Cell>{event.assignee ? event.assignee?.username : '-'}</Table.Cell>
				{/if}
				<Table.Cell>
					{formatDate(event.createdAt ?? '')}
				</Table.Cell>
				{#if !hideActions}
					<Table.Cell class="flex items-center justify-end">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<Button size="icon" variant="secondary"><MoreVerticalIcon size={16} /></Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Item>Assign to me</DropdownMenu.Item>
								<DropdownMenu.Item>Delete Event</DropdownMenu.Item></DropdownMenu.Content
							>
						</DropdownMenu.Root></Table.Cell
					>
				{/if}
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
