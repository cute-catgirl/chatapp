<script lang="ts">
	import { Select } from "bits-ui";
    import { ChevronDown } from "@lucide/svelte";

    const models = {
        "openai:nano": "Nano",
        "openai:mini": "Mini",
        "openai:normal": "Normal"
    }

    let { model = $bindable() } = $props();

    $inspect(model);
</script>

<Select.Root type="single" bind:value={model}>
    <Select.Trigger class="hover:bg-neutral-100 rounded-lg p-2 flex items-center gap-2 font-medium">
        {models[model]}
        <ChevronDown class="w-4 h-4" />
    </Select.Trigger>
    <Select.Content class="rounded-lg bg-white border border-neutral-200 p-2 flex flex-col gap-2">
        <Select.Viewport>
            {#each Object.entries(models) as [key, name]}
                <Select.Item
                    value={key}
                    class="hover:bg-neutral-100 rounded-lg p-2 flex items-center gap-2 select-none"
                >
                    {name}
                </Select.Item>
            {/each}
        </Select.Viewport>
    </Select.Content>
</Select.Root>