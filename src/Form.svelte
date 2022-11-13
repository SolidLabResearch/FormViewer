<script lang="ts">
    import 'rdf-form';
    import { type IFormParam, fetchFormParam, storeResult } from './helper';
    import Header from './Header.svelte';
    import Details from './Details.svelte';
    import Help from './Help.svelte';
    import Redirect from './Redirect.svelte';
    import { onMount } from 'svelte';

    export let id : string;
    export let language : string;

    let formParam : IFormParam ;
    let stored  = false;

    let languages = JSON.stringify({"en": "English", "nl": "Nederlands"});

    async function loadForm() {
        formParam = await fetchFormParam();
    }

    async function handleSubmit(event) {
        let jsonld = event.detail.expanded;
        let jsonldStr = JSON.stringify(jsonld,null,2);

        if (storeResult(jsonldStr, formParam.hydra)) {
            console.log("Stored!");
            stored = true;
        }
        else {
            console.error("Request failed: ${response.status}");
            alert("Failed to post results");
        }
    }

    onMount( async () => { loadForm() });
</script>

{#if stored}
    <Redirect bind:formParam/>
{:else}
    {#if formParam && formParam.formLocation}
        <Header bind:formParam/>
        <Details bind:formParam/>
        <rdf-form
            on:submit={handleSubmit}
            id={id}
            data="{ formParam.dataLocation }"
            form="{ formParam.formLocation }"
            ui-languages={languages}
            selected-language={language}
            selected-l10n-language={language}></rdf-form>
    {:else}
        <Help on:updateForm={(evt) => { formParam = evt.detail }}/>
    {/if}
{/if}