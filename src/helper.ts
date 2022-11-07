import * as Comunica from '@comunica/query-sparql';
import { fetch } from '@inrupt/solid-client-authn-browser';

export type IHydra = {
    title: string ,
    description: string ,
    method: string ,
    endpoint: string ,
    next: string
};

export type IFormParam = {
    formLocation: string ,
    dataLocation: string ,
    hash: string ,
    hydraLocation: string ,
    hydra: IHydra
};

export async function storeResult(data: any, hydra: IHydra) : Promise<boolean> {
    const response = await fetch(hydra.endpoint, {
        method: hydra.method ,
        body: data ,
        headers: {
            "Content-Type": "application/ld+json"
        }
    });

    return response.ok;
}

export async function fetchFormParam(appName: string) : Promise<IFormParam> {
    let result = {};

    // Load the params from cache :P ...
    if (location.search) {
        console.log(`loading form param from params`);

        let params = new URLSearchParams(location.search);

        if (params.get('formLocation')) {
            result['formLocation'] = params.get('formLocation');
        }
        if (params.get('dataLocation')) {
            result['dataLocation'] = params.get('dataLocation');
        }
        if (params.get('hydraLocation')) {
            result['hydraLocation'] = params.get('hydraLocation');
        }

        if (result['hydraLocation']) {
            result['hydra'] = await fetchHydra(result['hydraLocation']);
        }
        else if (result['formLocation']) {
            result['hydra'] = await fetchHydra(result['formLocation']);
        }
    }
    else {
        return undefined;
    }

    return <IFormParam> {...result} ;
}

export async function fetchHydra(url: string) : Promise<IHydra | null> {
    console.log(`loading hydra from: ${url}`);

    const myEngine = new Comunica.QueryEngine();
    const sparql = `
PREFIX hydra: <http://www.w3.org/ns/hydra/core#> 
PREFIX form: <http://rdf.danielbeeke.nl/form/form-dev.ttl#>
PREFIX dc: <http://purl.org/dc/terms/> 

SELECT ?endpoint ?method ?next ?title ?description WHERE  {
    ?id hydra:endpoint ?endpoint ;
        hydra:supportedClass [
            hydra:method ?method 
        ] .
    OPTIONAL { ?id hydra:next ?next . }
    OPTIONAL { ?id dc:title ?title . }
    OPTIONAL { ?id dc:description ?description . }
}
`;
    const bindingsStream = await myEngine.queryBindings(sparql , { 
            sources: [url] ,
            fetch: fetch
    });
    const bindings = await bindingsStream.toArray();

    console.log(`hydra query returned ${bindings.length} result(s)`);

    if (bindings.length < 1) {
        return null;
    }

    let endpoint : string;
    let next     : string;
    let method   : string;
    let title    : string;
    let description : string;

    if (bindings[0].has('endpoint')) {
        endpoint = bindings[0].get('endpoint').value;
    }

    if (bindings[0].has('next')) {
        next = bindings[0].get('next').value;
    }

    if (bindings[0].has('method')) {
        method = bindings[0].get('method').value;
    }

    if (bindings[0].has('title')) {
        title = bindings[0].get('title').value;
    }

    if (bindings[0].has('description')) {
        description =  bindings[0].get('description').value;
    }

    const result : IHydra = {
        title: title ,
        description: description ,
        method: method ,
        endpoint: endpoint ,
        next: next 
    };

    console.log(result);

    return result;
}