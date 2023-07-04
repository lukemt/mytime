<script lang="ts">
	export let value: string;
	export let placeholder: string = '';
	import { onMount } from 'svelte';

	let textareaEl: HTMLTextAreaElement;

	function listener(e: KeyboardEvent) {
		const el = e.target as HTMLTextAreaElement;

		if (e.key === 'Tab' && !e.shiftKey) {
			e.preventDefault(); // Prevent default tab behavior
			const start: number = el.selectionStart;
			const end: number = el.selectionEnd;
			const text: string = el.value;

			// expand selection to include entire lines
			const startLine = text.lastIndexOf('\n', start - 1) + 1;

			// Handle multiple lines when selecting
			const selectedLines: string[] = text.substring(startLine, end).split('\n');
			const indentedLines: string[] = selectedLines.map((line: string) => {
				return '\t' + line;
			});
			const newText: string = indentedLines.join('\n');

			// Insert the indented text back into the textarea
			el.value = text.substring(0, startLine) + newText + text.substring(end);

			// Adjust cursor position based on the indentation
			if (start === end) {
				el.selectionStart = el.selectionEnd = start + 1;
			} else {
				el.selectionStart = start;
				el.selectionEnd = end + newText.length - selectedLines.join('\n').length;
			}
		} else if (e.key === 'Tab' && e.shiftKey) {
			e.preventDefault(); // Prevent default shift+tab behavior
			const start: number = el.selectionStart;
			const end: number = el.selectionEnd;
			const text: string = el.value;

			// expand selection to include entire lines
			const startLine = text.lastIndexOf('\n', start - 1) + 1;

			// Handle multiple lines when selecting
			const selectedLines: string[] = text.substring(startLine, end).split('\n');
			const outdentedLines: string[] = selectedLines.map((line: string) => {
				if (line.startsWith('\t')) {
					return line.substring(1);
				} else if (line.startsWith('    ')) {
					return line.substring(4);
				}
				return line;
			});
			const newText: string = outdentedLines.join('\n');

			// Insert the outdented text back into the textarea
			el.value = text.substring(0, startLine) + newText + text.substring(end);

			// Adjust cursor position based on the outdentation
			if (start === end) {
				el.selectionStart = el.selectionEnd = start;
			} else {
				el.selectionStart = start;
				el.selectionEnd = end - selectedLines.join('\n').length + newText.length;
			}
		}
	}

	onMount(() => {
		textareaEl.addEventListener('keydown', listener);

		return () => textareaEl.removeEventListener('keydown', listener);
	});
</script>

<textarea
	bind:this={textareaEl}
	class="w-full h-32 border border-gray-300 rounded p-5 m-4 bg-gray-100"
	{placeholder}
	bind:value
/>
