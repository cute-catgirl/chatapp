<script lang="ts">
	import { enhance } from '$app/forms';
	import { createIdGenerator } from 'ai';
	import type { PageServerData } from './$types';
	import { Chat } from '@ai-sdk/svelte';
	import ChatView from '$lib/components/ChatView.svelte';
	import Markdown from '@magidoc/plugin-svelte-marked';

	let { data }: { data: PageServerData } = $props();
</script>

<ChatView newChat></ChatView>