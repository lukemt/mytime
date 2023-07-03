import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const notes = writable<string>();

if (browser) {
	notes.set(localStorage.getItem('notes') ?? '');
	notes.subscribe((value) => {
		localStorage.setItem('notes', value);
	});
}
