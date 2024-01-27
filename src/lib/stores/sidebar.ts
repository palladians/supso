import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type SidebarState = Record<string, boolean>;

const persistedValue = browser
	? localStorage.getItem('sidebar') && JSON.parse(localStorage.getItem('sidebar') ?? '')
	: null;

export const sidebar = writable<SidebarState | null>(persistedValue);

sidebar.subscribe((value) => {
	if (!browser) return;
	if (!value) return;
	localStorage.setItem('sidebar', JSON.stringify(value));
});
