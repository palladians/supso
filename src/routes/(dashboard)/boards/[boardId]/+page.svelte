<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import DragDropList, { VerticalDropZone } from 'svelte-dnd-list';
	import { SettingsIcon } from 'lucide-svelte';
	import DeleteEventAlert from '$lib/components/alerts/delete-event-alert.svelte';
	import PageNavbar from '$lib/components/dashboard/page-navbar.svelte';
	import BoardCard from '$lib/components/dashboard/board-card.svelte';
	import { writable, derived } from 'svelte/store';
	import type { Event, Board } from '$lib/db/schema';
	import { subscribeToBoard } from '$lib/realtime/board';
	import { onMount } from 'svelte';
	import { uniq, uniqBy } from 'rambda';

	type BoardWithEvents = Board & {
		events: Event[];
	};

	type EventsOrder = Record<string, string[]>;

	export let data;
	export const board = writable<BoardWithEvents>(data.board);
	export const eventsOrder = writable<EventsOrder>(JSON.parse(data.board.eventsOrder) ?? {});
	export const eventDetailsId = writable<string | null>(null);
	export const deleteEventId = writable<string | null>(null);
	export const eventsByOption = derived([board, eventsOrder], ([$board, $eventsOrder]) => {
		const newValue = $board.options.map((option: string) => {
			const laneOrder = uniq($eventsOrder[option] ?? []);
			const sortedEvents = $board.project.events
				.filter((event: Event) => {
					const tags = event.tags as Record<string, any>;
					if (tags?.length === 0) return;
					if (!tags?.[$board.tag]) return;
					return tags[$board.tag] === option;
				})
				.sort((first: Event, second: Event) => {
					if (!laneOrder) return 0;
					const firstIndex = laneOrder.findIndex((id) => id === first.id);
					const secondIndex = laneOrder.findIndex((id) => id === second.id);
					return firstIndex - secondIndex;
				});
			return [option, sortedEvents];
		});
		return newValue;
	});
	const updateEventsOrder = () => {
		const newDbEventsOrder = Object.fromEntries(
			$eventsByOption.map(([column, events]) => [column, uniq(events).map((event) => event.id)])
		);
		const updateEventsOrderForm = new FormData();
		updateEventsOrderForm.set('eventsOrder', JSON.stringify(newDbEventsOrder));
		return fetch('?/updateEventsOrder', {
			method: 'POST',
			body: updateEventsOrderForm
		});
	};
	const updateEventTag = ({ eventId, value }: Record<string, string>) => {
		const updateEventTagForm = new FormData();
		updateEventTagForm.set('eventId', eventId);
		updateEventTagForm.set('key', $board.tag);
		updateEventTagForm.set('value', value);
		return fetch('?/updateEventTag', {
			method: 'POST',
			body: updateEventTagForm
		});
	};
	const optimisticCardUpdate = ({ eventId, newTagValue }: Record<string, string>) => {
		const optimisticUiEventIndex = $board.project.events.findIndex((event) => event.id === eventId);
		const optimisticUiEvent = $board.project.events[optimisticUiEventIndex];
		const updatedOptimisticEvent = {
			...optimisticUiEvent,
			tags: {
				[$board.tag]: newTagValue
			}
		};
		board.set({
			...$board,
			project: {
				...$board.project,
				events: $board.project.events.with(optimisticUiEventIndex, updatedOptimisticEvent)
			}
		});
	};
	export const onDrop = async (event) => {
		const { detail } = event;
		if (!detail.to || detail.from === detail.to) {
			return;
		}
		const fallback = Object.fromEntries(
			$eventsByOption.map(([column, events]) => [column, events.map((event) => event.id)])
		);
		const currentOrder = Object.keys($eventsOrder).length > 0 ? $eventsOrder : fallback;
		const movedItem = currentOrder[detail.from.dropZoneID][detail.from.index];
		const fromColumnWithoutMovedItem = currentOrder[detail.from.dropZoneID].filter(
			(_, index) => index !== detail.from.index
		);
		eventsOrder.set({ ...currentOrder, [detail.from.dropZoneID]: fromColumnWithoutMovedItem });
		const toColumnWithMovedItem = currentOrder[detail.to.dropZoneID].toSpliced(
			detail.to.index,
			0,
			movedItem
		);
		eventsOrder.set({ ...currentOrder, [detail.to.dropZoneID]: toColumnWithMovedItem });
		optimisticCardUpdate({ eventId: movedItem, newTagValue: detail.to.dropZoneID });
		await updateEventsOrder();
		await updateEventTag({ eventId: movedItem, value: detail.to.dropZoneID });
	};

	onMount(async () => {
		const { cancel: cancelBoardSubscription } = await subscribeToBoard({
			accessToken: data.user.accessTokens[0].id,
			boardId: $board.id,
			callback: ({ eventsOrder: newOrder, events }) => {
				eventsOrder.set(JSON.parse(newOrder));
				board.set({
					...$board,
					project: {
						...$board.project,
						events: uniqBy((event) => event.id, [...events, ...$board.project.events])
					}
				});
			}
		});
		return () => {
			cancelBoardSubscription();
		};
	});
</script>

<div class="flex flex-1 flex-col px-4">
	<DeleteEventAlert open={deleteEventId} />
	<PageNavbar
		title={$board.name}
		subpage={{ name: 'Boards', url: `/projects/${$board.projectId}/boards` }}
	>
		<Button
			href={`/boards/${$board.id}/settings`}
			variant="secondary"
			class="sticky right-4 top-0 gap-1"
			slot="addon"
		>
			<SettingsIcon size={16} />
			<span>Board Settings</span>
		</Button>
	</PageNavbar>
	<div class="flex gap-4">
		{#each $eventsByOption as [name, events]}
			<Card.Root class="min-w-[24rem] max-w-[24rem]">
				<Card.Header>
					<Card.Title>{name}</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-1">
					<DragDropList
						id={name}
						type={VerticalDropZone}
						itemSize={100}
						itemCount={events.length}
						on:drop={onDrop}
						let:index
						zoneClass="flex flex-col gap-2 flex-1 min-h-[24rem]"
					>
						<BoardCard
							event={events[index]}
							{eventDetailsId}
							onDelete={() => deleteEventId.set(events[index].id)}
						/>
					</DragDropList>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
