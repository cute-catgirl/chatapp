<script lang="ts">
	let { children, footer } = $props();
</script>

<aside
	class="border-r border-neutral-200 bg-white min-w-64 h-screen flex flex-col justify-between gap-2 p-4"
>
	<div class="flex flex-col gap-2 overflow-scroll">
		{@render children?.()}
	</div>
	<div>
		{@render footer?.()}
	</div>
</aside>
