<script lang="ts">
    export let formParam;
    
    let timeout = 3000;

    function pageRedirect(url: string) {
        window.setTimeout(function(){
            window.location.href = url;
        }, timeout);
    }

    if (formParam && formParam.hydra.next) {
        pageRedirect(formParam.hydra.next);
    }
</script>

<p>Thank you for your submission :)!</p>

{#if formParam && formParam.hydra.next} 
    <p>
        Redirecting to <a href="{formParam.hydra.next}">{formParam.hydra.next}</a>
        in {timeout / 1000} seconds.
    </p>
{/if}