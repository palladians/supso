<script lang="ts">
	import { type Event } from '$lib/db/schema';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { CheckIcon, XIcon, MoreVerticalIcon } from 'lucide-svelte';
	import { formatDate } from '$lib/format/date';

	export let events: Event[];
	export let hideActions: boolean = false;
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Event</Table.Head>
			<Table.Head>Channel</Table.Head>
			<Table.Head>Notify</Table.Head>
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
							<Badge variant="secondary" class="text-lg">{event.emoji}</Badge>
						{/if}
						<span>{event.event}</span>
					</a>
				</Table.Cell>
				<Table.Cell>
					<Button
						href={`/projects/${event.projectId}/events?channel=${event.channel}`}
						variant="link"
						class="text-foreground"
					>
						#{event.channel}
					</Button>
				</Table.Cell>
				<Table.Cell>
					{#if event.notify}
						<CheckIcon size={16} />
					{:else}
						<XIcon size={16} />
					{/if}
				</Table.Cell>
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
