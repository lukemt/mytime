<script lang="ts">
	export let start: (duration_s: number) => Promise<void>;

	const maxSeconds = 60 * 60; // 1 hour
	let sliderValue_s = 60;

	let sliderValueFormatted = '';
	$: {
		const minutes = Math.floor(sliderValue_s / 60);
		const seconds = sliderValue_s % 60;
		sliderValueFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
	<div class="bg-white rounded p-4">
		<div class="text-2xl font-bold mb-4">
			{sliderValueFormatted}
		</div>

		<div>
			<input type="range" min="1" max={maxSeconds} bind:value={sliderValue_s} class="w-full" />
		</div>

		<button
			class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
			on:click={() => start(sliderValue_s)}>Start</button
		>
	</div>
</div>
