<script lang="ts">
    import 'rdf-form';
    import { type IFormParam, fetchFormParam, storeResult } from './helper';
    import { onMount } from 'svelte';

    export let appName = "23718gg1";
    export let id : string;
    export let language : string;

    let formParam : IFormParam ;
    let timeout               = 3000;
    let stored                = false;
    let isChangeEndpoint      = false;
    let isChangeMethod        = false;
    let showConnectionDetails = false;

    let languages = JSON.stringify({"en": "English", "nl": "Nederlands"});

    function pageRedirect(url: string) {
        window.setTimeout(function(){
            window.location.href = url;
        }, timeout);
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

        if (formParam && formParam.hydra.next) {
            pageRedirect(formParam.hydra.next);
        }
    }

    onMount( async () => {
        formParam = await fetchFormParam(appName);
        console.log(formParam);
    });
</script>

{#if stored}
    <p>Thank you for your submission :)!</p>
    {#if formParam && formParam.hydra.next} 
        <p>
            Redirecting to <a href="{formParam.hydra.next}">{formParam.hydra.next}</a>
            in {timeout} seconds.
        </p>
    {/if}
{:else}
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
        <h3>We need a form</h3>
        <p>
            The ACME Form Viewer is a Solid App to generate RDF Forms and store
            the results in a Solid Pod.
        </p>
        <form method="GET">
            <div class="form-group">
                <label for="formLocation">Form Location</label><br>
                <input type="text" name="formLocation" size="80" aria-describedby="formHelp"><br>
                <small id="formHelp" class="form-text text-muted">
                    Fill in the location of an RDF Form definition. <br>
                    E.g. https://formviewer.patrickhochstenbach.net/book-review.form.ttl
                </small>
            </div>
            <div class="form-group">
                <label for="dataLocation">Data Location</label><br>
                <input type="text" name="dataLocation" size="80" aria-describedby="dataHelp"><br>
                <small id="dataHelp" class="form-text text-muted">
                    Optional, provide the location of JSON-LD input data.
                </small>
            </div>
            <div class="form-group">
                <label for="hydraLocation">Hydra Location</label><br>
                <input type="text" name="hydraLocation" size="80" aria-describedby="hydraHelp"><br>
                <small id="hydraHelp" class="form-text text-muted">
                    Optional, provide the location of a Hydra description where to send the results.
                    <br> E.g. https://formviewer.patrickhochstenbach.net/hydra.ttl
                </small>
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
        </form>

        <h3>Some example forms</h3>
        
        <ul>
            <li>https://formviewer.patrickhochstenbach.net/book-review.ttl</li>
            <li>https://formviewer.patrickhochstenbach.net/confirm.form.ttl</li>
            <li>https://formviewer.patrickhochstenbach.net/doodle.form.ttl</li>
            <li>https://formviewer.patrickhochstenbach.net/journalArticle.form.ttl</li>
            <li>https://formviewer.patrickhochstenbach.net/recipe.form.ttl</li>
            <li>https://formviewer.patrickhochstenbach.net/todo.form.ttl</li>
            <li>https://formviewer.patrickhochstenbach.net/wysiwyg.form.ttl</li>
        </ul>

        <p>
            The source code of this Solid App is available at: <a href="https://github.com/phochste/FormViewer">GitHub</a>.
        </p>
    {/if}
{/if}

<style>
    label {
        width: 200px;
    }
</style>