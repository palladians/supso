<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import type { Event } from '$lib/db/schema';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let open: Writable<string | null>;
    export let data: Event | null = null

    open.subscribe(async (id) => {
        if (!id) return
        const response = await fetch(`/api/events/${id}`)
        const { event } = await response.json()
        data = event as Event
    })
</script>

<Dialog.Root open={!!$open} onOpenChange={() => open.set(null)}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{data?.event}</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			{data?.channel}
		</div>
	</Dialog.Content>
</Dialog.Root>
