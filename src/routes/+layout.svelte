<script>
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Chat</title>
</svelte:head>
{@render children()}
