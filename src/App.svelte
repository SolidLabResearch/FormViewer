<script>
	import Form from './Form.svelte';
	import Login from './Login.svelte';
	export let name;
	let webId;
	let stored = false;
</script>

<main>
	<h1>{name}</h1>
	{#if typeof(webId) != "undefined" }
	<p>Logged in as {webId}</p>
	{:else}
	<Login bind:webId={webId}/>
	{/if}
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