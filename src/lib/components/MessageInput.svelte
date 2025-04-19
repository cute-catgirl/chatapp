<script lang="ts">
    import { Button } from "bits-ui";
    import { SendHorizontal } from "@lucide/svelte";

    let { send, message = $bindable() } = $props();
    
    let disabled = $state(false);
    let textarea: HTMLElement;

    function onKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            send();
            textarea.style.height = "auto";
        }
    }

    function onInput(event: Event) {
        textarea.style.height = "auto";  
        textarea.style.height = `${textarea.scrollHeight}px`; 
    }
</script>

<div
    class="flex gap-2 border rounded-xl border-neutral-200 bg-white justify-between items-start shadow w-full"
>
    <textarea
        bind:value={message}
        bind:this={textarea}
        oninput={onInput}
        onkeydown={onKeyDown}
        placeholder="Type a message..."
        class="resize-none outline-none border-none w-full h-full min-h-12 field-sizing-content overflow-auto m-4"
        rows="1"
    ></textarea>
    <Button.Root 
        onclick={send}
        disabled={!message.trim() || disabled}
        class="p-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed m-4"
    >
        <SendHorizontal size={20} />
    </Button.Root>
</div>
