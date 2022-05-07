<script>
    import * as N3 from 'n3';
    export let webId;
    export let issuer;
    export let profile;

    let showConnect = true;

    const onConnect = (ev) => { showConnect = false };
    const cancelConnect = (ev) => { showConnect = true };

    solidClientAuthentication.handleIncomingRedirect({ restorePreviousSession: true })
                                       .then( async info => {
        webId = info.webId;

        profile = await fetchUserProfile(webId);

        // Restore hash...
        let formParam = JSON.parse(localStorage.getItem('formParam'));
        window.location.hash = formParam.hash;
    });

    function handleLogin() {
        console.log(`Login to : ${issuer}`);
        solidClientAuthentication.login({
            oidcIssuer: issuer,
            redirectUrl: window.location.href,
            clientName: "FormViewer"
        });
    }

    // From https://github.com/ewingson/nox
    async function readSolidDocument(url) {
        try {
            const response = await solidClientAuthentication.fetch(url, { headers: { Accept: 'text/turtle' } });

            if (!isSuccessfulStatusCode(response.status))
                return null;

            const data = await response.text();
            const parser = new N3.Parser({ baseIRI: url });

            return parser.parse(data);
        } catch (error) {
            return null;
        }
    }

    function isSuccessfulStatusCode(statusCode) {
        return Math.floor(statusCode / 100) === 2;
    }

    async function fetchUserProfile(webId) {
        const profileQuads = await readSolidDocument(webId);
        const givenNameQuad 
              = profileQuads.find(quad => quad.predicate.value === 'http://xmlns.com/foaf/0.1/givenName');
        const familyNameQuad 
              = profileQuads.find(quad => quad.predicate.value === 'http://xmlns.com/foaf/0.1/familyName');
        const nameQuad  
              = profileQuads.find(quad => quad.predicate.value === 'http://xmlns.com/foaf/0.1/name');
        const imageQuad 
              = profileQuads.find(quad => quad.predicate.value === 'http://xmlns.com/foaf/0.1/img');

        return {
            webId: webId ,
            givenName: givenNameQuad?.object.value ,
            familyName: familyNameQuad?.object.value ,
            name:  nameQuad?.object.value ,
            image: imageQuad?.object.value,
        };
    }

</script>

<div>
    {#if ! webId}
      {#if showConnect}
      <button 
        class="btn"
        on:click|preventDefault={onConnect}>Connect to Solid</button> 
      {:else}
        <form>
          <label for="inputsm">What is your Solid IDP (e.g. http://[name].inrupt.net)</label>
          <input
            class="form-control input-sm"
            style="max-width: 300px; align: right"
            id="inputsm"
            type="text"
            bind:value={issuer} />
          <button 
            class="btn btn-success"
            on:click|preventDefault={handleLogin}>Log In</button>
          <button 
            class="btn btn-danger"
            on:click|preventDefault={cancelConnect}>Cancel</button> 
        </form>
      {/if}
    {/if}
</div>