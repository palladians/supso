<script lang="ts">
	import { formatDate } from '$lib/format/date';
	import { Badge } from '../ui/badge';
	import * as Table from '../ui/table';
	import type { Event } from '$lib/db/schema';
	import { cn } from '$lib/utils';
	type EventWithNew = Event & {
		new: boolean;
	};
	export let lastEvents: EventWithNew[];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Event</Table.Head>
			<Table.Head>Channel</Table.Head>
			<Table.Head class="text-right">Created</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each lastEvents as event}
			<Table.Row>
				<Table.Cell>
					<a href={`/events/${event.id}`} class="flex items-center gap-2">
						<div class={cn('h-2 w-2 rounded-full', event.new && 'bg-teal-600')} />
						{#if event.emoji}
							<Badge variant="secondary" class={cn('text-lg')}>{event.emoji}</Badge>
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
