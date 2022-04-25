<script>
	import Form from './Form.svelte';
	let stored = false;
</script>

<main>
	<h1>Acme Form Viewer</h1>
</main>

	{#if stored} 
		<p>Thank you for your submission!</p>
	{:else}
		<Form id="myForm" 
			  language="en" 
			  bind:stored="{stored}"/>
	{/if}


<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>