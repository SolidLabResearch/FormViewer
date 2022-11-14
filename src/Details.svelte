<script lang="ts">
    export let formParam;

    let isChangeEndpoint      = false;
    let isChangeMethod        = false;
    let showConnectionDetails = false;

    function clearForm() {
        formParam = undefined;
    }
</script>

{#if showConnectionDetails}
<button on:click|preventDefault={() => showConnectionDetails = false}>Hide details</button> 
<button on:click|preventDefault={clearForm}>New Form</button> 
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
    <button on:click|preventDefault={clearForm}>New Form</button> 
{/if}