<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import { TextSearch } from '@lucide/svelte';
	import Markdown from '@magidoc/plugin-svelte-marked';
	import { tool } from 'ai';

	let { message } = $props();

	let roleText = {
		user: 'User',
		assistant: 'Assistant'
	};
</script>

<div
	class={[
		'flex flex-col gap-2 rounded-xl px-4 py-2 mb-2 w-max',
		message.role === 'user' ? 'ml-auto bg-neutral-100' : 'mr-auto'
	]}
>
	<div>
		{#each message.parts as part, partIndex (partIndex)}
			{#if part.type === 'text'}
				<div class="prose"><Markdown source={part.text}></Markdown></div>
			{:else if part.type === 'tool-invocation'}
				{#if part.toolInvocation.toolName === 'retrieveResourceTool'}
					<div class="flex items-center gap-2">
						<TextSearch class="inline-block" />
						<span class="font-semibold">Searching knowledge base...</span>
					</div>
				{/if}
			{:else if part.type === 'tool-result'}
				{#if part.toolName === 'retrieveResourceTool'}
					<div class="flex items-center gap-2">
						<TextSearch class="inline-block" />
						<span class="font-semibold">Searching knowledge base...</span>
					</div>
				{/if}
			{/if}
		{/each}
	</div>
</div>
