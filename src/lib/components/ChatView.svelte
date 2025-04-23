<script lang="ts">
	import { goto } from '$app/navigation';
	import Message from './Message.svelte';

	import { Chat } from '@ai-sdk/svelte';
	import Markdown from '@magidoc/plugin-svelte-marked';
	import { createIdGenerator } from 'ai';
	import { globalState } from '../../globalData.svelte';

	import { ArrowUp } from '@lucide/svelte';
	import MessageInput from './MessageInput.svelte';
	import ModelPicker from './ModelPicker.svelte';

	let { id = null, initialMessages = [], systemPrompt = '', newChat = false } = $props();

	const chat = $derived(
		new Chat({
			id,
			initialMessages,
			maxSteps: 5,
			generateId: createIdGenerator({
				prefix: 'msgc',
				size: 16
			}),
			body: {
				system: systemPrompt,
				model: globalState.selectedModel,
			},
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
	$inspect(chat);
</script>

<main class="flex flex-col justify-between items-center p-2 gap-2 w-full h-screen bg-white">
	<header class="flex justify-start w-full">
		<ModelPicker bind:model={globalState.selectedModel} />
	</header>
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
