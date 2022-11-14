import * as Communica from '@comunica/query-sparql';
import * as n3 from 'n3';
import { fetch } from '@inrupt/solid-client-authn-browser';

const myEngine = new Communica.QueryEngine();

export const UNKNOWN_TYPE    = 0x00;
export const RDF_FORM_TYPE   = 0x01;
export const SOLID_FORM_TYPE = 0x02;
export const SHACL_FORM_TYPE = 0x03;

// Helper function to return a rdf-forms Tutle layout (with nicely formatted
// lists, correct prefix definitions, etc..). This shouldn't be needed when
// RDF forms can parse any general input format.
export async function alignResource(resource: string) : Promise<string | null> {
    const rdf      = await fetchResource(resource);

    if (isRdfFormTurtle(rdf)) {
        console.log('form already in rdf-form format...');
        return rdf;
    }
    else {
        console.log('form not in rdf-form format, we will try to transform...');
    }

    const store    = await getRdfjsResourceFromString(rdf);

    const formType = await detectFormType(store);
    
    console.log(`detectFormType(${resource}) -> ${formType}`);

    switch (formType) {
        case UNKNOWN_TYPE:
            return null;
        case RDF_FORM_TYPE:
            return alignRdfFormResource(store);
        case SOLID_FORM_TYPE:
            // Not yet implemented...we could add schema alignment for solid forms here
            return null;
        case SHACL_FORM_TYPE:
            // Not yet implemented...we could add schema alignment for shacl forms here
            return null;
    }
}

// Check if the Turtle is already in the rdf-form format...
function isRdfFormTurtle(rdf:string) : boolean {
    if (rdf.match(/@prefix\s+form:\s+<http:\/\/rdf\.danielbeeke\.nl/) ) {
        return true;
    }   
    else {
        return false;
    }
}

export async function detectFormType(store: n3.Store) : Promise<number> {
    if (await askComunica(store, rdfFormMatch() )) {
        return RDF_FORM_TYPE;
    }
    else if (await askComunica(store, solidFormMatch())) {
        return SOLID_FORM_TYPE;
    }
    else if (await askComunica(store, shaclFormMatch())) {
        return SHACL_FORM_TYPE;
    }
    else {
        return UNKNOWN_TYPE;
    }
}

function rdfFormMatch() : string {
    return `
PREFIX form:  <http://rdf.danielbeeke.nl/form/form-dev.ttl#> 
ASK { ?subject a form:Form  }
`;
}

function solidFormMatch() : string {
    return `
PREFIX ui: <http://www.w3.org/ns/ui#> 
ASK { ?subject a ui:Form }
`
}

function shaclFormMatch() : string {
    return `
PREFIX sh: <http://www.w3.org/ns/shacl#> 
ASK { ?subject a sh:NodeShape }
`
}

async function askComunica(store: n3.Store, query: string) : Promise<boolean> {
    const hasMatches = await myEngine.queryBoolean(query, {
        sources: [ { type: 'rdfjsSource'  , value: store } ] ,
    });
    return hasMatches;
}

async function alignRdfFormResource(store: n3.Store) : Promise<string | null> {
    return new Promise<string>( (resolve,reject ) => {
        const { namedNode } = n3.DataFactory;
        const writer = new n3.Writer({ 
                prefixes: { 
                    rdf:  'http://www.w3.org/1999/02/22-rdf-syntax-ns#' ,
                    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
                    form: 'http://rdf.danielbeeke.nl/form/form-dev.ttl#' 
                } 
        });

        const RDF_FIRST = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#first';
        const RDF_REST  = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#rest';
        const RDF_NIL   = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#nil';
        const FORM_OPTION = 'http://rdf.danielbeeke.nl/form/form-dev.ttl#option'; 

        const rdfLister = (store,sourceQ) => {
            let values = [];

            let d = store.getQuads(sourceQ.subject,sourceQ.predicate,null);
                
            let tFirst : any[];
            let tRest  : any[];
            let tMember : any[];
            let tSubject = d[0].object;

            do {
                tMember = store.getQuads(tSubject,null,null,null);
                tFirst = tMember.filter( (q) => q.predicate.value === RDF_FIRST);
                tRest  = tMember.filter( (q) => q.predicate.value === RDF_REST);

                if (tFirst && tFirst.length) {
                    let tMemberItem = store.getQuads(
                            tFirst[0].object, null, null, null
                    ); 
                    values.push(
                        writer.blank(tMemberItem)
                    );
                    for (const q of tMemberItem) {
                        store.delete(q);
                    }
                    store.delete(tFirst[0]);
                }
                if (tRest && tRest.length) {
                    tSubject = tRest[0].object;
                    store.delete(tRest[0]);
                }
            } while (
                tRest && 
                tRest.length && 
                tRest[0].object.value !== RDF_NIL
            );

            return values;
        };

        let optionLists = {};
        const optionQuads = store.getQuads(null, namedNode(FORM_OPTION), null, null);

        for (const q of optionQuads) {
            const members = rdfLister(store, q);
            optionLists[q.subject.value] = members;
        }

        for (const q of store) {
            if (q.predicate.value === FORM_OPTION) {
                writer.addQuad(
                    q.subject,
                    q.predicate,
                    writer.list(
                        optionLists[q.subject.value]
                    )
                );
            }
            else {
                writer.addQuad(q);
            }
        }

        writer.end((error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}

async function fetchResource(resource:string) : Promise<string | null> {
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

async function getRdfjsResourceFromString(rdf: string) : Promise <n3.Store> {
    const parser = new n3.Parser();
    const store  = new n3.Store();

    return new Promise <n3.Store>( (resolve,reject) => {
        parser.parse(rdf, (error, quad) => {
            if (error) {
                reject(error);
            }
            else if (quad) {
                store.add(quad);
            }
            else {
                resolve(store);
            } 
        });
    });
}