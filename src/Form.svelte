<script>
    import 'rdf-form';
    import { onMount } from 'svelte';
    
    const myEngine = Comunica.newEngine();

    export let appName = "23718gg1";
    export let id;
    export let language;
    export let stored;

    let formLocation;
    let dataLocation;
    let hydra;
    let isChangeEndpoint = false;
    let isChangeMethod = false;
    let showConnectionDetails = false;

    let languages = JSON.stringify({"en": "English", "nl": "Nederlands"});

    async function handleSubmit(event) {
        let jsonld = event.detail.expanded;
        let jsonldStr = JSON.stringify(jsonld,null,2);

        const response = await solidClientAuthentication.fetch(hydra['endpoint'], {
            method: hydra['method'] ,
            body: jsonldStr ,
            headers: {
                "Content-Type": "application/ld+json"
            }
        });

        if (! response.ok) {
            console.error("Request failed: ${response.status}");
            alert("Failed to post results");
        }
        else {
            console.log("Stored!");
            stored = true;
        }
    }

    async function fetchFormHydra(url)  {
        myEngine.invalidateHttpCache();

        const result = await myEngine.query(`
            PREFIX hydra: <http://www.w3.org/ns/hydra/core#> 
            PREFIX form: <http://rdf.danielbeeke.nl/form/form-dev.ttl#>
            PREFIX dc: <http://purl.org/dc/terms/> 

            SELECT ?endpoint ?method ?title ?description WHERE  {
                ?id hydra:endpoint ?endpoint ;
                    hydra:supportedClass [
                        hydra:method ?method 
                    ] .
                OPTIONAL { ?id dc:title ?title . }
                OPTIONAL { ?id dc:description ?description . }
            }
        ` , {
            sources: [url]
        });

        const bindings = await result.bindings();

        console.log(`found: ${bindings.length} results`);

        if (bindings.length < 1) {
            return undefined;
        }

        let endpoint;
        let method;
        let title;
        let description;

        if (bindings[0].has('?endpoint')) {
            endpoint = bindings[0].get('?endpoint').value;
        }

        if (bindings[0].has('?method')) {
            method =  bindings[0].get('?method').value;
        }

        if (bindings[0].has('?title')) {
            title =  bindings[0].get('?title').value;
        }

        if (bindings[0].has('?description')) {
            description =  bindings[0].get('?description').value;
        }

        console.log(`endpoint: ${endpoint}`);
        console.log(`method: ${method}`);

        return {
            title: title ,
            description: description ,
            method: method ,
            endpoint: endpoint , 
        }
    }

    onMount( async () => {
        if (!location.hash) {
            let formParam = JSON.parse(localStorage.getItem(appName));
            formLocation = formParam.formLocation;
            dataLocation = formParam.dataLocation;
            hydra        = formParam.hydra;
        }
        else {
            let hash = location.hash.substring(1);
            let hydraLocation;

            if (hash.includes("#")) {
                let parts = hash.split('#');
                formLocation = parts[0];
                dataLocation = parts[1];
                hydraLocation = parts[2];
            }
            else {
                formLocation = hash;
            }

            hydra = await fetchFormHydra(hydraLocation ? hydraLocation : formLocation);

            localStorage.setItem(appName, JSON.stringify(
               {
                   formLocation: formLocation ,
                   dataLocation: dataLocation ,
                   hydra : hydra ,
                   hash : window.location.hash
               } 
            ));
        }
    });
</script>

{#if hydra}
  {#if hydra.title}<h1>{hydra.title}</h1>{/if}
  {#if hydra.description}
  <div class="panel panel-default">
    <div class="panel-body">{hydra.description}</div>
  </div>
  {/if}
{/if}

{#if formLocation}
    {#if showConnectionDetails}
    <button on:click|preventDefault={() => showConnectionDetails = false}>Hide details</button> 
    <table class="table table-condensed">
    <thead>
        <tr>
            <th colspan="4">Connection details</th>
        </tr>
    </thead>
    <tbody>
    <tr>
    <th>Form template:</th>
    <td><a href="{formLocation}">{formLocation}</a></td>
    <th>Endpoint</th>
    <td>
        {#if hydra}
            {#if !isChangeEndpoint}
            <a href="{hydra.endpoint}">{hydra.endpoint}</a>
            <button 
                class="btn btn-primary btn-xs"
                on:click={() => isChangeEndpoint = true}>Change</button>
            {:else}
                <input 
                    on:mouseleave={ () => isChangeEndpoint = false }
                    on:change={(e) => { hydra.endpoint = e.target.value; isChangeEndpoint = false }}
                    id="endpoint"
                    type="text" value="{hydra.endpoint}" size="50">
            {/if}
        {/if}
    </td>
    </tr>
    <tr>
    <th>Data template:</th> 
    <td>{#if dataLocation}<a href="{dataLocation}">{dataLocation}</a>{/if}</td>
    <th>Method</th>
    <td>{#if hydra}
            {#if ! isChangeMethod}
               {hydra.method}
               <button 
               class="btn btn-primary btn-xs"
               on:click={() => isChangeMethod = true}>Change</button>
            {:else}
               <input 
                on:mouseleave={ () => isChangeMethod = false }
                on:change={(e) => { hydra.method = e.target.value; isChangeMethod = false }}
                id="endpoint"
                type="text" value="{hydra.method}" size="4"> 
            {/if}
        {/if}
    </td>
    </tr>
    </tbody>
    </table>
    {:else}
    <button on:click|preventDefault={() => showConnectionDetails = true}>Show details</button> 
    {/if}

    <rdf-form
           on:submit={handleSubmit}
           id={id}
           data="{dataLocation}"
           form="{formLocation}"
           ui-languages={languages}
           selected-language={language}
           selected-l10n-language={language}></rdf-form>
{:else}
    <p>Need a form location in the URL</p>
    <p>
        Example <a href="https://purl.org/acmeForms/app/#https://purl.org/acmeForms/book-review.form.ttl">https://purl.org/acmeForms/app/#https://purl.org/acmeForms/book-review.form.ttl</a>
    </p>
{/if}