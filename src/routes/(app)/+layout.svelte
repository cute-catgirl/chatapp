<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { Plus } from '@lucide/svelte';
	import { page } from '$app/state';
	import UserCard from '$lib/components/UserCard.svelte';
	import { DropdownMenu } from 'bits-ui';

	let { children, data } = $props();
</script>

<svelte:head>
	<title>Chat</title>
</svelte:head>

<div class="w-screen min-h-screen bg-white text-zinc-950 flex">
	<Sidebar>
		<a
			href="/"
			class={[
				'flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors',
				page.url.pathname === '/' ? 'bg-neutral-100 hover:bg-neutral-200' : ''
			]}
		>
			<Plus class="w-6 h-6" />
			<span>New Chat</span>
		</a>
		{#each data.chats as chat}
			<a
				href={`/chat/${chat.id}`}
				class={[
					'flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors',
					page.url.pathname === `/chat/${chat.id}` ? 'bg-neutral-100 hover:bg-neutral-200' : ''
				]}
			>
				<span>{chat.name}</span>
			</a>
		{/each}
		{#snippet footer()}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class="w-full text-left">
					<UserCard username={data.user.username} displayName={data.user.displayName} />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					class="w-48 border border-neutral-200 bg-white rounded-lg shadow-md p-2 flex flex-col gap-2"
				>
					<DropdownMenu.Item>
						<a href="/settings" class="block w-full p-2 hover:bg-neutral-100 rounded-lg">Settings</a
						>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<a href="/logout" class="block w-full p-2 hover:bg-neutral-100 rounded-lg">Logout</a>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/snippet}
	</Sidebar>
	{@render children()}
</div>
