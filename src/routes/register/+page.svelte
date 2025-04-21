<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="w-screen h-screen flex items-center justify-center">
	<div class="w-96 p-4 border border-neutral-200 rounded-md shadow-md bg-white">
		<div class="flex flex-col gap-4">
			<h1 class="text-xl font-semibold">Register</h1>
			<form method="post" action="?/register" use:enhance class="flex flex-col gap-4">
				<label for="username"> Username </label>
				<input name="username" class="p-2 border border-neutral-300 rounded-lg" />
				<label for="displayname"> Display Name </label>
				<input name="displayname" class="p-2 border border-neutral-300 rounded-lg" />
				<label for="password"> Password </label>
				<input type="password" name="password" class="p-2 border border-neutral-300 rounded-lg" />
				<button class="rounded-xl bg-blue-500 hover:bg-blue-600 py-3 px-2 w-min text-white"
					>Register</button
				>
			</form>
			<p style="color: red">{form?.message ?? ''}</p>
		</div>
	</div>
</div>
