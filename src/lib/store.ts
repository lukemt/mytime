import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const notes = writable<string>();
export const notes2 = writable<string>();
export const timeSliderValue = writable<number>(5);

if (browser) {
	notes.set(localStorage.getItem('notes') ?? '');
	notes.subscribe((value) => {
		localStorage.setItem('notes', value);
	});

	notes2.set(localStorage.getItem('notes2') ?? '');
	notes2.subscribe((value) => {
		localStorage.setItem('notes2', value);
	});
}
