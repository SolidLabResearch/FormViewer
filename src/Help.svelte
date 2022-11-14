<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { type IFormParam, fetchFormParam } from './helper';

    const dispatch = createEventDispatcher();

    async function updateForm(e) {
        const formData = new FormData(e.target);
        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }
        let path = window.location.href.split('?')[0] + "?ctx_ver=Z39.88-2004&rft_val_fmt=http://formviewer.patrickhochstenbach.net";
        if (data['formLocation']) {
            path += '&rft.form=' + encodeURIComponent(data['formLocation']);
        }
        if (data['dataLocation']) {
            path += '&rft.data=' + encodeURIComponent(data['dataLocation']);
        }
        if (data['hydraLocation']) {
            path += '&rft.hydra=' + encodeURIComponent(data['hydraLocation']);
        }
        window.history.pushState({},undefined,path);
        let formParam : IFormParam = await fetchFormParam(<IFormParam> data);

        dispatch('updateForm',formParam);
    }

</script>

<h3>We need a form</h3>
<p>
    The ACME Form Viewer is a Solid App to generate RDF Forms and store
    the results in a Solid Pod.
</p>

<form method="GET" on:submit|preventDefault={updateForm}>
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
    <li>https://formviewer.patrickhochstenbach.net/book-review.form.ttl</li>
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

<style>
    label {
        width: 200px;
    }
</style>