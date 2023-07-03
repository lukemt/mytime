<script lang="ts">
	import { onDestroy } from 'svelte';
	import TimeInput from '../lib/components/TimeInputModal.svelte';
	import { notes } from '../lib/store';
	import Textarea from '$lib/components/Textarea.svelte';

	const pauseBetweenBells_ms = 1000;

	let showTimeInput = false;
	let countdownInterval: NodeJS.Timeout;
	let remainingTime = 0;

	let timeRemainingFormatted = '';
	$: {
		const minutes = Math.floor(remainingTime / 60);
		const seconds = remainingTime % 60;
		timeRemainingFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}

	async function start(duration_s: number) {
		showTimeInput = false;
		await requestNotificationPermission();

		remainingTime = duration_s;
		clearInterval(countdownInterval);
		countdownInterval = setInterval(() => {
			remainingTime--;
			if (remainingTime <= 0) {
				clearInterval(countdownInterval);
				getAttention();
			}
		}, 1000);
	}

	onDestroy(() => clearInterval(countdownInterval));

	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	// Play sound repeatedly until the app has focus
	const playSound = () => {
		const audio = new Audio('/sounds/service-bell.wav');
		audio.play();
		audio.addEventListener('ended', async () => {
			await sleep(pauseBetweenBells_ms);
			if (document.visibilityState === 'hidden') {
				audio.currentTime = 0;
				audio.play();
			}
		});
	};

	function getAttention() {
		playSound();

		// Send notification
		const notification = new Notification('Time is up!', {
			body: 'Time to take a break.'
		});

		// Not working on my machine, TODO: move to potential feature issues
		// if (document.visibilityState === 'hidden') {
		// 	document.addEventListener('visibilitychange', () => {
		// 		if (document.visibilityState === 'visible') {
		// 			notification.close();
		// 		} else {
		// 			console.warn('document.visibilityState is strange');
		// 		}
		// 	});
		// }
	}

	const requestNotificationPermission = async () => {
		if (window.Notification && window.Notification.permission !== 'granted') {
			const permission = await window.Notification.requestPermission();
			if (permission !== 'granted') {
				// Notification permission denied
				console.warn('Notification permission denied.');
			}
		}
	};
</script>

<div class="container mx-auto">
	<h1 class="text-4xl font-bold mb-4">my time</h1>

	<!-- textarea -->
	<div class="mb-4">
		<textarea
			class="w-full h-32 border border-gray-300 rounded p-2 bg-gray-100"
			placeholder="What are you working on?"
			bind:value={$notes}
		/>
	</div>

	<Textarea />

	<div class="text-2xl font-bold">
		{timeRemainingFormatted}
	</div>

	<div>
		<button
			on:click={() => (showTimeInput = true)}
			class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
		>
			Start
		</button>
	</div>

	<!-- time input modal -->
	{#if showTimeInput}
		<TimeInput {start} />
	{/if}
</div>
