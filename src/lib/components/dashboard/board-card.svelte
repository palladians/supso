<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Event } from '$lib/db/schema';
	import { formatDateShort } from '$lib/format/date';
	import * as Card from '$lib/components/ui/card';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	export let eventDetailsId: Writable<string | null>;
	export let event: Event;
	export let onDelete: () => void;
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<Button
			variant="outline"
			class="flex h-auto w-full max-w-[24rem] flex-1 flex-col items-start justify-start gap-4 p-4 text-left"
			on:click={() => goto(`/events/${event.id}`)}
		>
			<h2 class="w-full truncate font-semibold">{event.event}</h2>
			<div class="flex gap-1">
				<Badge variant="secondary">#{event.channel}</Badge>
				<Badge variant="secondary">{formatDateShort(event.createdAt)}</Badge>
			</div>
		</Button>
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item>Copy link</ContextMenu.Item>
		<ContextMenu.Item on:click={onDelete}>Delete</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
