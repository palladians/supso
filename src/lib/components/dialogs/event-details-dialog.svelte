<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import type { Event, Project } from '$lib/db/schema';
	import { derived, writable, type Writable } from 'svelte/store';
	import { Skeleton } from '../ui/skeleton';
	import { formatDate } from '$lib/format/date';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	type EventWithProject = Event & {
		project: Project;
	};

	export let open: Writable<string | null>;
	export const event = writable<EventWithProject | null>(null);
	export const loading = derived(event, ($event) => !$event?.id);
	export const board = $page.data.board;

	const updateEventTag = ({ eventId, value }: Record<string, string>) => {
		const updateEventTagForm = new FormData();
		updateEventTagForm.set('eventId', eventId);
		updateEventTagForm.set('key', board.tag);
		updateEventTagForm.set('value', value);
		return fetch('?/updateEventTag', {
			method: 'POST',
			body: updateEventTagForm
		});
	};

	const onEventTagChanged = async ({ value }: { value: string }) => {
		await updateEventTag({ eventId: $event?.id ?? '', value });
	};

	onMount(() => {
		const unsub = open.subscribe(async (id) => {
			if (!id) return;
			event.set(null);
			const response = await fetch(`/api/events/${id}`);
			const { event: eventData } = await response.json();
			event.set(eventData as EventWithProject);
		});
		return () => {
			unsub();
		};
	});
</script>

<Dialog.Root open={!!$open} onOpenChange={() => open.set(null)}>
	<Dialog.Content class="pt-4">
		{#if $loading}
			<Skeleton class="h-24 w-full" />
		{/if}
		{#if $event}
			<Dialog.Header>
				<div class="mr-6 flex items-center justify-between">
					<Dialog.Title class="truncate">{$event?.event}</Dialog.Title>
					<Select.Root selected={$event?.tags?.[board.tag]} onSelectedChange={onEventTagChanged}>
						<Select.Trigger class="w-[180px]">
							<Select.Value placeholder={$event?.tags?.[board.tag] ?? 'Tag'} />
						</Select.Trigger>
						<Select.Content>
							{#each board.options as option}
								<Select.Item value={option} label={option}>{option}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</Dialog.Header>
			<div class="mt-2 grid grid-cols-4 gap-x-8 gap-y-4">
				<p class="text-right">Channel</p>
				<p class="col-span-3">#{$event?.channel}</p>
				<p class="text-right">Created At</p>
				<p class="col-span-3">{$event?.createdAt && formatDate($event.createdAt)}</p>
				<p class="text-right">Updated At</p>
				<p class="col-span-3">{$event?.updatedAt && formatDate($event.updatedAt)}</p>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
