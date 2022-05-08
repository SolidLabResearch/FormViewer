<script>
	import Form from './Form.svelte';
	import Login from './Login.svelte';
	export let name;
	let profile;
	let stored = false;
</script>

<nav class="navbar navbar-default">
	<div class="container-fluid">
	  <div class="navbar-header">
		<span class="navbar-brand">{name}</span>
	  </div>
	  <ul class="nav navbar-nav">
		<li>
			{#if typeof(profile) != "undefined" }
				{#if profile.image}
					<img src="{profile.image}" class="img-circle" width="50" height="50" alt="{profile.name}"/>
				{:else}
					<img src="images/unknown.jpeg" width="50" height="50" alt="{profile.name}"/>
				{/if}
			{/if}
		</li>
	  </ul>
	</div>
</nav>

<Login bind:profile={profile}/>

{#if stored} 
	<p>Thank you for your submission!</p>
{:else}
	<Form id="myForm" 
		language="en" 
		bind:stored="{stored}"/>
{/if}
