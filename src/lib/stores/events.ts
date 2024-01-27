import { toast } from 'svelte-sonner';
import { writable } from 'svelte/store';
import type { Event } from '$lib/db/schema';
import { goto } from '$app/navigation';

type EventsState = Event[];

export const events = writable<EventsState>([]);

events.subscribe((events) => {
	events.forEach((event) => {
		toast.success(event.event, {
			description: '#' + event.channel,
			action: {
				label: 'View',
				onClick: () => goto(`/events/${event.id}`)
			},
			duration: 10000
		});
	});
});
