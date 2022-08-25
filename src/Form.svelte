<script lang="ts">
    import 'rdf-form';
    import { fetchFormParam, storeResult } from './helper';
    import { onMount } from 'svelte';

    export let appName = "23718gg1";
    export let id;
    export let language;
    export let stored;

    let formParam;

    let isChangeEndpoint = false;
    let isChangeMethod = false;
    let showConnectionDetails = false;

    let languages = JSON.stringify({"en": "English", "nl": "Nederlands"});

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

    onMount( async () => {
        formParam = await fetchFormParam(appName);
        console.log(formParam);
    });
</script>

{#if formParam && formParam.hydra}
  {#if formParam.hydra.title}<h1>{formParam.hydra.title}</h1>{/if}
  {#if formParam.hydra.description}
  <div class="panel panel-default">
    <div class="panel-body">{formParam.hydra.description}</div>
  </div>
  {/if}
{/if}

{#if formParam && formParam.formLocation}
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
    <td><a href="{formParam.formLocation}">{formParam.formLocation}</a></td>
    <th>Endpoint</th>
    <td>
        {#if formParam.hydra}
            {#if !isChangeEndpoint}
            <a href="{formParam.hydra.endpoint}">{formParam.hydra.endpoint}</a>
            <button 
                class="btn btn-primary btn-xs"
                on:click={() => isChangeEndpoint = true}>Change</button>
            {:else}
                <input 
                    on:mouseleave={ () => isChangeEndpoint = false }
                    on:change={(e) => { formParam.hydra.endpoint = e.target.value; isChangeEndpoint = false }}
                    id="endpoint"
                    type="text" value="{ formParam.hydra.endpoint }" size="50">
            {/if}
        {/if}
    </td>
    </tr>
    <tr>
    <th>Data template:</th> 
    <td>{#if formParam.dataLocation}<a href="{ formParam.dataLocation }">{ formParam.dataLocation }</a>{/if}</td>
    <th>Method</th>
    <td>{#if formParam.hydra}
            {#if ! isChangeMethod}
               {formParam.hydra.method}
               <button 
               class="btn btn-primary btn-xs"
               on:click={() => isChangeMethod = true}>Change</button>
            {:else}
               <input 
                on:mouseleave={ () => isChangeMethod = false }
                on:change={(e) => { formParam.hydra.method = e.target.value; isChangeMethod = false }}
                id="endpoint"
                type="text" value="{ formParam.hydra.method }" size="4"> 
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
           data="{ formParam.dataLocation }"
           form="{ formParam.formLocation }"
           ui-languages={languages}
           selected-language={language}
           selected-l10n-language={language}></rdf-form>
{:else}
    <p>Need a form location in the URL</p>
    <p>
        Example <a href="https://formviewer.patrickhochstenbach.net#https://formviewer.patrickhochstenbach.net/book-review.form.ttl">https://formviewer.patrickhochstenbach.net/#https://formviewer.patrickhochstenbach.net/book-review.form.ttl</a>
    </p>
{/if}