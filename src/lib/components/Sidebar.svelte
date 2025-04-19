<script lang="ts">
    let { children } = $props();
</script>
<aside class="border-r border-neutral-200 bg-white w-72 h-screen flex flex-col gap-2 p-4 overflow-scroll">
    {@render children?.()}
</aside>