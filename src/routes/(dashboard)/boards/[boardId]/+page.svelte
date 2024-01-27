<script lang="ts">
	import { flip } from 'svelte/animate';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import { formatDate } from '$lib/format/date';
	import { SettingsIcon } from 'lucide-svelte';
	import EventDetailsDialog from '$lib/components/dialogs/event-details-dialog.svelte';
	import { writable, derived } from 'svelte/store';
	import type { Event, Board } from '$lib/db/schema';
	import { subscribeToBoard } from '$lib/realtime/board';
	import { onMount } from 'svelte';

	type BoardWithEvents = Board & {
		events: Event[];
	};

	export let data;
	export const board = writable<BoardWithEvents>(data.board);
	export const eventDetailsId = writable<string | null>(null);
	export const eventsByOption = derived(board, ($board) =>
		$board.options.map((option: string) => [
			option,
			$board.events
				.filter((event) => {
					const tags = event.tags as Record<string, any>;
					return tags[$board.tag] === option;
				})
				.sort((first, second) => {
					const laneOrder: string[] = JSON.parse($board.eventsOrder)?.[option];
					if (!laneOrder) return 0;
					const firstIndex = laneOrder.findIndex((id) => id === first.id);
					const secondIndex = laneOrder.findIndex((id) => id === second.id);
					return firstIndex - secondIndex;
				})
		])
	);

	const flipDurationMs = 300;
	export const handleDndConsider = (column: number, e: CustomEvent<DndEvent<Event>>) => {
		eventsByOption[column][1] = e.detail.items;
	};
	export const handleDndFinalize = async (column: number, e: CustomEvent<DndEvent<Event>>) => {
		const updatedEvents = e.detail.items;
		eventsByOption[column][1] = updatedEvents;
		const movedItemId = e.detail.info.id;
		const updatedEvent = updatedEvents.find((event) => event.id === movedItemId);
		if (!updatedEvent) return;
		const newTagValue = eventsByOption.find(([value, events]) =>
			events.some((event) => event.id === movedItemId)
		)[0];
		const eventsOrder = Object.fromEntries(
			eventsByOption.map(([column, events]) => [column, events.map((event) => event.id)])
		);
		const updatedEventFormData = new FormData();
		updatedEventFormData.set('eventId', updatedEvent.id);
		updatedEventFormData.set('key', $board.tag);
		updatedEventFormData.set('value', newTagValue);
		const orderFormData = new FormData();
		orderFormData.set('eventsOrder', JSON.stringify(eventsOrder));
		await fetch('?/updateEventsOrder', {
			method: 'POST',
			body: orderFormData
		});
		await fetch('?/updateEventTag', {
			method: 'POST',
			body: updatedEventFormData
		});
	};

	onMount(() => {
		subscribeToBoard({
			accessToken: data.user.accessTokens[0].id,
			boardId: $board.id,
			callback: ({ eventsOrder }) => {
				const boardOptions = $board.options as string[];
				eventsByOption = boardOptions.map((option) => [
					option,
					$board.events
						.filter((event) => {
							const tags = event.tags as Record<string, any>;
							return tags[$board.tag] === option;
						})
						.sort((first, second) => {
							const laneOrder: string[] = JSON.parse(eventsOrder)?.[option];
							if (!laneOrder) return 0;
							const firstIndex = laneOrder.findIndex((id) => id === first.id);
							const secondIndex = laneOrder.findIndex((id) => id === second.id);
							return firstIndex - secondIndex;
						})
				]);
			}
		});
	});
</script>

<div class="flex flex-col gap-4">
	<EventDetailsDialog open={eventDetailsId} />
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold">{$board.name}</h2>
		<Button href={`/boards/${$board.id}/settings`} variant="secondary" class="gap-1">
			<SettingsIcon size={16} />
			<span>Board Settings</span>
		</Button>
	</div>
	<div class="flex gap-4 overflow-x-scroll">
		{#each eventsByOption as optionEvents, i}
			{@const items = optionEvents[1]}
			<Card.Root class="min-w-[24rem] max-w-[24rem]">
				<Card.Header>
					<Card.Title>{optionEvents[0]}</Card.Title>
				</Card.Header>
				<Card.Content>
					<div
						class="flex min-h-[2rem] flex-col gap-2"
						use:dndzone={{ items, flipDurationMs }}
						on:consider={(e) => handleDndConsider(i, e)}
						on:finalize={(e) => handleDndFinalize(i, e)}
					>
						{#each optionEvents[1] as event (event.id)}
							<div
								animate:flip={{ duration: flipDurationMs }}
								on:click={() => eventDetailsId.set(event.id)}
							>
								<Card.Root class="flex w-full max-w-[24rem] flex-col items-start gap-2 p-4">
									<Badge variant="secondary">#{event.channel}</Badge>
									<h2 class="font-semibold">{event.event}</h2>
									<p class="text-muted-foreground text-sm">{formatDate(event.createdAt)}</p>
								</Card.Root>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
