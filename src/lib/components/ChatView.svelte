<script lang="ts">
	import { goto } from '$app/navigation';
	import Message from './Message.svelte';

	import { Chat } from '@ai-sdk/svelte';
	import Markdown from '@magidoc/plugin-svelte-marked';
	import { createIdGenerator } from 'ai';

	import { ArrowUp } from '@lucide/svelte';
	import MessageInput from './MessageInput.svelte';

	let { id = null, initialMessages = [], newChat = false } = $props();

	const chat = $derived(
		new Chat({
			id,
			initialMessages,
			maxSteps: 5,
			generateId: createIdGenerator({
				prefix: 'msgc',
				size: 16
			}),
			sendExtraMessageFields: true,
			onFinish: async (message) => {
				if (newChat) {
					try {
						await goto(`/chat/${chat.id}`, { invalidateAll: true });
					} catch (error) {
						console.error('Error navigating to new chat:', error);
					}
				}
			}
		})
	);
</script>

<main class="flex flex-col justify-between items-center p-4 gap-2 w-full h-screen bg-white">
	<div class="overflow-y-scroll w-full flex m-auto">
		<div class="w-full max-w-3xl m-auto">
			{#each chat.messages as message, messageIndex (messageIndex)}
				<Message {message}></Message>
			{/each}
		</div>
	</div>
	<form class="w-full max-w-3xl">
		<MessageInput bind:message={chat.input} send={chat.handleSubmit} />
	</form>
</main>
