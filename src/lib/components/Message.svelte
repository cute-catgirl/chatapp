<script lang="ts">
    import { Chat } from "@ai-sdk/svelte";
	import Markdown from "@magidoc/plugin-svelte-marked";
	import Weather from "./Weather.svelte";
	import { tool } from "ai";

    let { message } = $props();

    let roleText = {
        "user": "User",
        "assistant": "Assistant"
    }
</script>

<div class={["flex flex-col gap-2 rounded-xl px-4 py-2 mb-4 w-max", message.role === "user" ? "ml-auto bg-neutral-100" : "mr-auto"]}>
    <div>
    {#each message.parts as part, partIndex (partIndex)}
        {part.type}
        {#if part.type === 'text'}
        <div class="prose"><Markdown source={part.text}></Markdown></div>
        {:else if part.type === 'tool-invocation'}
            {part.toolInovcation.toolName}
            {#if part.toolInvocation.toolName === 'displayWeather'}
                <Weather temperature=20 condition="Sunny" location="New York"></Weather>
            {/if}
        {:else if part.type === 'tool-result'}
            {part.toolName}
            {#if part.toolName === 'displayWeather'}
                <Weather temperature=20 condition="Sunny" location="New York"></Weather>
            {/if}
        {/if}
    {/each}
    </div>
</div>

