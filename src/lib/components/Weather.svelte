<script lang="ts">
	let { temperature, condition, location } = $props();

	import { Sun, Cloud, Snowflake, CloudSun } from '@lucide/svelte';
</script>

<div
	class="rounded-lg border border-neutral-200 bg-white p-6 shadow-md min-w-sm flex flex-col items-center justify-between"
>
	<div class="flex items-center gap-4 mb-4">
		<Sun class="w-12 h-12" />
		<h2 class="text-3xl font-bold">Weather</h2>
	</div>
	<p class="text-lg">{location}</p>
	<p class="text-2xl font-medium">Temperature: {temperature}°C</p>
	<p class="text-base text-gray-600">Condition: {condition}</p>
</div>
