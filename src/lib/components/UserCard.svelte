<script lang="ts">
    let { username, displayName } = $props();

    let initials = $derived.by(() => {
        if (displayName) {
            return displayName
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase();
        }
        return "";
    });
</script>

<div class="flex items-center gap-2 hover:bg-neutral-100 rounded-lg p-2 transition-colors select-none">
    <div class="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-white font-bold">
        {#if initials}
            {initials}
        {:else}
            {username[0]}
        {/if}
    </div>
    <div class="flex flex-col">
        <p class="text-md font-semibold">{displayName}</p>
        <p class="text-sm text-neutral-500">@{username}</p>
    </div>
</div>