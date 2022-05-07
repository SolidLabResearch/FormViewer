<script>
	import Form from './Form.svelte';
	import Login from './Login.svelte';
	export let name;
	let profile;
	let stored = false;
</script>

<Login bind:profile={profile}/>
<main>
	<h1>{name}</h1>
	{#if typeof(profile) != "undefined" }
		{#if profile.image}
			<img src="{profile.image}" width="50" height="50" alt="{profile.name}"/>
		{:else}
			<img src="images/unknown.jpeg" width="50" height="50" alt="{profile.name}"/>
		{/if}
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