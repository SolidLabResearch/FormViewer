<script>
    import 'rdf-form';
import { onMount } from 'svelte';
    
    export let id;
    export let language="nl";
    export let endpoint="https://bellow2.ugent.be/test/dev/form/inbox/"
    export let stored;

    let languages = JSON.stringify({"en": "English", "nl": "Nederlands"});

    let formLocation = location.hash.substr(1)

    async function handlerSubmit(event) {
        let jsonld = event.detail.expanded;
        let jsonldStr = JSON.stringify(jsonld,null,2);

        const response = await fetch(endpoint, {
            method: 'POST' ,
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
</script>

{#if formLocation}
<rdf-form
   on:submit={handlerSubmit}
   id={id}
   form="{formLocation}"
   ui-languages={languages}
   selected-language={language}
   selected-l10n-language={language}></rdf-form>
{:else}
    <p>Need a form location in the URL</p>
{/if}