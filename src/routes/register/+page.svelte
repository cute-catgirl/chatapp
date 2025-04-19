<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<h1>Register</h1>
<form method="post" action="?/register" use:enhance>
	<label>
		Username
		<input name="username" />
	</label>
	<label>
		Display Name
		<input name="displayname" />
	</label>
	<label>
		Password
		<input type="password" name="password" />
	</label>
	<button>Register</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
