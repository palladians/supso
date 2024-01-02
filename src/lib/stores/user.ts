import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const persistedValue = browser ? localStorage.getItem('currentProjectId') : null;

export const currentProjectId = writable<string | null>(persistedValue);

currentProjectId.subscribe((value) => {
	if (!browser) return;
	if (!value) return;
	localStorage.setItem('currentProjectId', value);
});
