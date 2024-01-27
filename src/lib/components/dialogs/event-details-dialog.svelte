<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import type { Event } from '$lib/db/schema';
	import type { Writable } from 'svelte/store';
	import { Skeleton } from '../ui/skeleton';
	import { formatDate } from '$lib/format/date';

	export let open: Writable<string | null>;
	export let loading: boolean = true;
	export let data: Event | null = null;

	open.subscribe(async (id) => {
		if (!id) return;
		loading = true;
		data = null;
		const response = await fetch(`/api/events/${id}`);
		const { event } = await response.json();
		data = event as Event;
		loading = false;
	});
</script>

<Dialog.Root open={!!$open} onOpenChange={() => open.set(null)}>
	<Dialog.Content>
		{#if loading}
			<Skeleton class="h-24 w-full" />
		{/if}
		{#if data}
			<Dialog.Header>
				<Dialog.Title>{data?.event}</Dialog.Title>
			</Dialog.Header>
			<div class="mt-2 grid grid-cols-4 gap-x-8 gap-y-4">
				<p class="text-right">Channel</p>
				<p class="col-span-3">#{data?.channel}</p>
				<p class="text-right">Created At</p>
				<p class="col-span-3">{data?.createdAt && formatDate(data.createdAt)}</p>
				<p class="text-right">Updated At</p>
				<p class="col-span-3">{data?.updatedAt && formatDate(data.updatedAt)}</p>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
