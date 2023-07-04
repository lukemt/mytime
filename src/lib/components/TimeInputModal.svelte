<script lang="ts">
	import { timeSliderValue } from '$lib/store';

	export let start: (duration_s: number) => Promise<void>;

	const maxSeconds = 60; // 1 hour

	let sliderValueFormatted = '';
	$: {
		const sliderSeconds = $timeSliderValue * $timeSliderValue;
		const minutes = Math.floor(sliderSeconds / 60);
		const seconds = sliderSeconds % 60;
		sliderValueFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
	<div class="bg-white rounded p-4 w-9/12">
		<div class="text-2xl font-bold mb-4">
			{sliderValueFormatted}
		</div>

		<div>
			<input type="range" min="1" max={maxSeconds} bind:value={$timeSliderValue} class="w-full" />
		</div>

		<button
			class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
			autofocus
			on:click={() => start($timeSliderValue * $timeSliderValue)}>Start</button
		>
	</div>
</div>
