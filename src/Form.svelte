<script>
    import 'rdf-form';
    import { onMount } from 'svelte';
    
    const myEngine = Comunica.newEngine();

    export let id;
    export let language;
    export let stored;

    let formLocation;
    let dataLocation;
    let hydra;

    let languages = JSON.stringify({"en": "English", "nl": "Nederlands"});

    async function handlerSubmit(event) {
        let jsonld = event.detail.expanded;
        let jsonldStr = JSON.stringify(jsonld,null,2);

        const response = await fetch(hydra['endpoint'], {
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

            SELECT ?endpoint ?method WHERE  {
                ?id a form:Form ;
                    hydra:endpoint ?endpoint ;
                    hydra:supportedClass [
                        hydra:method ?method 
                    ] .
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

        if (bindings[0].has('?endpoint')) {
            endpoint =  bindings[0].get('?endpoint').value;
        }

        if (bindings[0].has('?method')) {
            method =  bindings[0].get('?method').value;
        }

        console.log(`endpoint: ${endpoint}`);
        console.log(`method: ${method}`);

        return {
            method: method ,
            endpoint: endpoint 
        }
    }

    onMount( async () => {
        let hash = location.hash.substring(1);

        if (hash.includes("#")) {
            let parts = hash.split('#');
            formLocation = parts[0];
            dataLocation = parts[1];
        }
        else {
            formLocation = hash;
        }

        hydra = await fetchFormHydra(formLocation);
    });
</script>

{#if formLocation}
    <rdf-form
           on:submit={handlerSubmit}
           id={id}
           data="{dataLocation}"
           form="{formLocation}"
           ui-languages={languages}
           selected-language={language}
           selected-l10n-language={language}></rdf-form>
{:else}
    <p>Need a form location in the URL</p>
{/if}