<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		const textarea = document.getElementById('your-textarea-id') as HTMLTextAreaElement;
		textarea.addEventListener('keydown', function (e: KeyboardEvent) {
			if (e.key === 'Tab' && !e.shiftKey) {
				e.preventDefault(); // Prevent default tab behavior
				const start: number = this.selectionStart;
				const end: number = this.selectionEnd;
				const text: string = this.value;

				// Handle multiple lines when selecting
				const selectedLines: string[] = text.substring(start, end).split('\n');
				const indentedLines: string[] = selectedLines.map((line: string) => {
					return '\t' + line;
				});
				const newText: string = indentedLines.join('\n');

				// Insert the indented text back into the textarea
				this.value = text.substring(0, start) + newText + text.substring(end);

				// Adjust cursor position based on the indentation
				if (start === end) {
					this.selectionStart = this.selectionEnd = start + 1;
				} else {
					this.selectionStart = start;
					this.selectionEnd = end + newText.length - selectedLines.join('\n').length;
				}
			} else if (e.key === 'Tab' && e.shiftKey) {
				e.preventDefault(); // Prevent default shift+tab behavior
				const start: number = this.selectionStart;
				const end: number = this.selectionEnd;
				const text: string = this.value;

				// Handle multiple lines when selecting
				const selectedLines: string[] = text.substring(start, end).split('\n');
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
				this.value = text.substring(0, start) + newText + text.substring(end);

				// Adjust cursor position based on the outdentation
				if (start === end) {
					this.selectionStart = this.selectionEnd = start;
				} else {
					this.selectionStart = start;
					this.selectionEnd = end - selectedLines.join('\n').length + newText.length;
				}
			}
		});
	});
</script>

<textarea id="your-textarea-id" class="w-full h-full bg-gray-100" />
