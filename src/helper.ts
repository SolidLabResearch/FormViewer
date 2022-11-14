import * as Comunica from '@comunica/query-sparql';
import { fetch } from '@inrupt/solid-client-authn-browser';
import { alignResource } from './alignment';
import rdfParser from "rdf-parse";
import rdfSerializer from "rdf-serialize";

const streamifyString = require('streamify-string');
const stringifyStream = require('stream-to-string');

export type IHydra = {
    description: string ,
    endpoint: string ,
    method: string ,
    next: string ,
    subject: string ,
    title: string 
};

export type IFormParam = {
    formLocation: string ,
    formData : string ,
    dataLocation: string ,
    dataData : string,
    hydraLocation: string ,
    hydra: IHydra
};

export async function storeResult(json: string, formParam: IFormParam) : Promise<boolean> {

    // Remove the @id to force generating a blank node...
    delete json['@id']; 

    let jsonldStr = JSON.stringify(json,null,2);

    const turtle = await rdfFromTo(jsonldStr, 'application/ld+json','text/turtle');

    console.log(`
${formParam.hydra.endpoint} ${formParam.hydra.method}   
${turtle}
`);

    const response = await fetch(formParam.hydra.endpoint, {
        method: formParam.hydra.method ,
        body: turtle ,
        headers: {
            "Content-Type": "text/turtle"
        }
    });

    return response.ok;
}

export async function fetchResource(resource:string) : Promise<string | null> {
    const response = await fetch(resource, {
        method: 'GET',
        headers: {
            "Accept": "text/turtle"
        }
    });  

    if (response.ok) {
        return await response.text();
    }
    else {
        return null;
    }
}

export async function fetchFormParam(data?: IFormParam) : Promise<IFormParam> {
    let result = {};

    if (data) {
        result = {...data};
    }
    else if (location.search) {
        console.log(`loading form param from params`);

        let params = new URLSearchParams(location.search);
        
        if (params.get('rft.form')) {
            result['formLocation'] = params.get('rft.form');
        }
        if (params.get('rft.data')) {
            result['dataLocation'] = params.get('rft.data');
        }
        if (params.get('rft.hydra')) {
            result['hydraLocation'] = params.get('rft.hydra');
        }
    }
    else {
        return undefined;
    }

    if (result['hydraLocation']) {
        result['hydra'] = await fetchHydra(result['hydraLocation']);
    }
    else if (result['formLocation']) {
        result['hydra'] = await fetchHydra(result['formLocation']);
    }
    else {
        // No extra hydra location provided
    }

    if (result['formLocation']) {
        const formData = await alignResource(result['formLocation']);

        if (formData) {
            result['formData'] = formData;
        }
    }

    if (result['dataLocation']) {
        const dataData = await fetchResource(result['dataLocation']);

        if (dataData) {
            result['dataData'] = dataData;
        }
        else {
            result['dataData'] = '@prefix ex: <https://example.org> .';
        }
    }

    return <IFormParam> {...result} ;
}

async function fetchHydra(url: string) : Promise<IHydra | null> {
    console.log(`loading hydra from: ${url}`);

    const myEngine = new Comunica.QueryEngine();
    const sparql = `
PREFIX hydra: <http://www.w3.org/ns/hydra/core#> 
PREFIX form: <http://rdf.danielbeeke.nl/form/form-dev.ttl#>
PREFIX dc: <http://purl.org/dc/terms/> 

SELECT ?id ?endpoint ?method ?next ?title ?description WHERE  {
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

    let subject  : string;
    let endpoint : string;
    let next     : string;
    let method   : string;
    let title    : string;
    let description : string;

    if (bindings[0].has('id')) {
        subject = bindings[0].get('id').value;
    }

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
        description: description ,
        endpoint: endpoint ,
        method: method ,
        next: next ,
        subject: subject ,
        title: title 
    };

    return result;
}

async function rdfFromTo(data: string, inType: string, outType: string) : Promise<string> {
    const inStream = streamifyString(data);
    const quadStream = rdfParser.parse(inStream, { contentType: inType });
    const outStream = rdfSerializer.serialize(quadStream, { contentType: outType });
    const result = await stringifyStream(outStream);
    return result;
}
