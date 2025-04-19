<script lang="ts">
	import Chat from "$lib/components/ChatView.svelte";

    let { data } = $props();
</script>
<Chat id={data.chatId} initialMessages={data.messages}></Chat>