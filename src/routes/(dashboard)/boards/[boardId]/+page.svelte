<script lang="ts">
    import {flip} from "svelte/animate";
    import * as Card from '$lib/components/ui/card'
    import {Badge} from '$lib/components/ui/badge'
    import {Button} from '$lib/components/ui/button'
    import {dndzone, type DndEvent} from "svelte-dnd-action";
	import { formatDate } from "$lib/format/date";
    import { SettingsIcon } from 'lucide-svelte'
    import EventDetailsDialog from '$lib/components/dialogs/event-details-dialog.svelte'
	import { writable } from "svelte/store";
    import type { Event } from "$lib/db/schema.js";

    export let data

    export const eventDetailsId = writable<string | null>(null);

    export const options = data.board.options as string[]
    const flipDurationMs = 300;
    export const handleDndConsider = (column: number, e: CustomEvent<DndEvent<Event>>) => {
        data.eventsByOption[column][1] = e.detail.items;
    }
    export const handleDndFinalize = (column: number, e: CustomEvent<DndEvent<Event>>) => {
        const updatedEvents = e.detail.items
        data.eventsByOption[column][1] = updatedEvents;
        const movedItemId = e.detail.info.id
        const updatedEvent = updatedEvents.find((event) => event.id === movedItemId)
        if (!updatedEvent) return
        console.log('>>>F', data.eventsByOption[column])
        console.log('>>>T', updatedEvent)
    }
</script>

<div class="flex flex-col gap-4">
    <EventDetailsDialog open={eventDetailsId} />
    <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">{data.board.name}</h2>
        <Button href={`/boards/${data.board.id}/settings`} variant="secondary" class="gap-1">
            <SettingsIcon size={16} />
            <span>Board Settings</span>
        </Button>
    </div>
    <div class="flex gap-4">
        {#each data.eventsByOption as optionEvents, i}
            {@const items = optionEvents[1]}
            <Card.Root class="max-w-[24rem] w-full">
                <Card.Header>
                    <Card.Title>{optionEvents[0]}</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div class="min-h-[2rem] flex flex-col gap-2" use:dndzone="{{items, flipDurationMs}}" on:consider="{(e) => handleDndConsider(i, e)}" on:finalize="{(e) => handleDndFinalize(i, e)}">
                        {#each optionEvents[1] as event (event.id)}
                            <div animate:flip="{{duration: flipDurationMs}}" on:click={() => eventDetailsId.set(event.id)}>
                                <Card.Root class="flex flex-col items-start max-w-[24rem] w-full p-4 gap-2">
                                        <Badge variant="secondary">#{event.channel}</Badge>
                                        <h2 class="font-semibold">{event.event}</h2>
                                        <p class="text-sm text-muted-foreground">{formatDate(event.createdAt)}</p>
                                </Card.Root>
                            </div>
                        {/each}
                    </div>
                </Card.Content>
            </Card.Root>
        {/each}
    </div>
</div>