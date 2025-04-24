<script lang="ts">
	import type { PageServerData } from '../$types';
	import { Select } from 'bits-ui';

	let { data } = $props();

	let trimmedSystemPrompt = $derived(data.systemPrompt.trim());

	let advancedMode = $state(Boolean(data.simpleMode === 'false'));

	const models = {
		'openai:nano': 'Nano',
		'openai:mini': 'Mini',
		'openai:normal': 'Normal'
	};

	let modelLabel = $derived.by(() => {
		return models[data.defaultModel] || 'Select a model';
	});

	function changeModel(model) {
		data.defaultModel = model;
		modelLabel = models[model];
	}
</script>

<div class="p-2">
	<h1 class="text-2xl font-bold text-neutral-900 mb-2">Settings</h1>

	<form method="POST" action="?/settings" class="flex flex-col gap-6">
		<div class="flex flex-col gap-2">
			<label for="defaultModel" class="text-md font-medium text-neutral-700"> Default Model </label>
			<Select.Root
				type="single"
				name="defaultModel"
				onValueChange={(e) => {
					changeModel(e);
				}}
			>
				<Select.Trigger
					class="p-3 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-start max-w-[200px]"
					name="model"
				>
					{modelLabel}
				</Select.Trigger>

				<Select.Content class="rounded-lg bg-white border border-neutral-200 p-2 flex gap-2">
					<Select.Viewport>
						{#each Object.entries(models) as [key, model]}
							<Select.Item value={key} class="p-2 hover:bg-neutral-100 rounded-lg">
								{model}
							</Select.Item>
						{/each}
					</Select.Viewport>
				</Select.Content>
			</Select.Root>
		</div>
		{#if advancedMode}
			<div class="flex flex-col gap-2">
				<label for="systemPrompt" class="text-md font-medium text-neutral-700">
					System Prompt
				</label>
				<textarea
					id="systemPrompt"
					name="systemPrompt"
					class="p-3 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
					rows="6">{trimmedSystemPrompt}</textarea
				>
			</div>
		{:else}
			<div class="flex flex-col gap-2">
				<label for="name" class="text-md font-medium text-neutral-700">
					What name would you like the AI to call you?
				</label>
				<input
					type="text"
					id="name"
					name="name"
					placeholder="Name"
					value={data.name}
					class="p-3 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div class="flex flex-col gap-2">
				<label for="pronouns" class="text-md font-medium text-neutral-700">
					What pronouns would you like the AI to use?
				</label>
				<input
					type="text"
					id="pronouns"
					name="pronouns"
					placeholder="Pronouns"
					value={data.pronouns}
					class="p-3 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div class="flex flex-col gap-2">
				<label for="info" class="text-md font-medium text-neutral-700">
					What else would you like the AI to know about you?
				</label>
				<textarea
					id="info"
					name="info"
					placeholder="Info"
					class="p-3 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
					rows="6">{data.info}</textarea
				>
			</div>
		{/if}

		<div class="flex items-center gap-2">
			<input
				type="checkbox"
				id="advancedMode"
				name="advancedMode"
				bind:checked={advancedMode}
				class="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500"
			/>
			<label for="advancedMode" class="text-sm text-neutral-700">
				<p>Advanced Mode</p>
				<p class="text-xs text-neutral-500">
					Allows you to customize the AI's system prompt directly.
				</p>
			</label>
		</div>
		<a href="/system-prompt.md" target="_blank" class="text-xs text-blue-500 hover:underline">
			Simple mode prompt reference
		</a>

		<button
			type="submit"
			class="self-start px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
		>
			Save
		</button>
	</form>
</div>
