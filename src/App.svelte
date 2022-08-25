<script lang="ts">
	import Form from './Form.svelte';
	import Login from './Login.svelte';
	import Logout from './Logout.svelte';
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
			<Logout bind:profile={profile}/>
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
