<script lang="ts">
     export let formParam;
</script>

{#if formParam.hydra.title}<h1>{formParam.hydra.title}</h1>{/if}
{#if formParam.hydra.description}
    <div class="panel panel-default">
        <div class="panel-body">{formParam.hydra.description}</div>
    </div>
{/if}