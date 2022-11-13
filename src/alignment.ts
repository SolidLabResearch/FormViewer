import * as Communica from '@comunica/query-sparql';
import * as n3 from 'n3';
import { fetch } from '@inrupt/solid-client-authn-browser';

const myEngine = new Communica.QueryEngine();

export const UNKNOWN_TYPE    = 0x00;
export const RDF_FORM_TYPE   = 0x01;
export const SOLID_FORM_TYPE = 0x02;
export const SHACL_FORM_TYPE = 0x03;

export async function alignResource(resource: string) : Promise<string | null> {
    const formType = await detectFormType(resource);
    
    console.log(`detectFormType(${resource}) -> ${formType}`);

    switch (formType) {
        case UNKNOWN_TYPE:
            return null;
        case RDF_FORM_TYPE:
            return makeString(resource);
        case SOLID_FORM_TYPE:
            // Not yet implemented...
            return null;
        case SHACL_FORM_TYPE:
            // Not yet implemented...
            return null;
    }
}

export async function detectFormType(resource: string) : Promise<number> {
    if (await askComunica(resource, rdfFormMatch() )) {
        return RDF_FORM_TYPE;
    }
    else if (await askComunica(resource, solidFormMatch())) {
        return SOLID_FORM_TYPE;
    }
    else if (await askComunica(resource, shaclFormMatch())) {
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

async function askComunica(resource: string, query: string) : Promise<boolean> {
    const hasMatches = await myEngine.queryBoolean(query, {
        sources: [ resource ] ,
        fetch: fetch
    });
    return hasMatches;
}

async function makeString(resource: string) : Promise<string | null> {
    const response = await fetch(resource, {
        method: 'GET',
        headers: {
            "Accept": "text/turtle"
        }
    }); 

    if (! response.ok) {
        return null;
    }
    const rdf = await response.text();

    return new Promise<string>( (resolve,reject ) => {
        const { namedNode } = n3.DataFactory;
        const parser = new n3.Parser();
        const store = new n3.Store();
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

        parser.parse(rdf, (error, quad) => {
            // Retrieve an List Container from a store
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

            if (error) {
                reject(error);
            }
            else if (quad) {
                store.add(quad);
            }
            else {
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
            }
        });
    });
}