<script>
    import { onMount } from 'svelte';

    export let webId;
    export let issuer;

    solidClientAuthentication.handleIncomingRedirect({ restorePreviousSession: true })
                                       .then( info => {
        webId = info.webId;

        // Restore hash...
        let formParam = JSON.parse(localStorage.getItem('formParam'));
        window.location.hash = formParam.hash;
    });

    function handleLogin() {
        console.debug(`Login to : ${issuer}`);
        login({
            redirectUrl: window.location.hash,
            oidcIssuer: issuer,
            clientName: "FormViewer"
        });
    }

</script>

<div>
    {#if ! webId}
      <form>
        IDP:
        <input
          size="40"
          type="text"
          bind:value={issuer}
        />
        <button on:click|preventDefault={handleLogin}>Log In</button>
      </form>
    {/if}
</div>