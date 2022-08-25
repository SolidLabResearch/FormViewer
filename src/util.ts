import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { getSolidDataset, 
         getStringByLocaleAll, 
         getStringEnglish, 
         getStringNoLocale, 
         getThing,
         getUrl, 
         type SolidDataset , 
         type Thing
} from '@inrupt/solid-client';
import { FOAF } from '@inrupt/vocab-common-rdf';

/* 
 * See: https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/authenticate-browser/
 * for documentation on Inrupt Solid Authn API
 */

export function isLoggedIn() : boolean {
    return getDefaultSession().info.isLoggedIn;
}

export type ProfileType = {
    webId: string,
    givenName: string | null,
    familyName: string | null,
    name: string | null,
    img: string | null,
    data?: SolidDataset
};

export function getString(thing: Thing, property: string) : string | null {
    let value = getStringNoLocale(thing,property);

    if (value) {
        return value;
    }

    value = getStringEnglish(thing, property);

    if (value) {
        return value;
    }

    let map = getStringByLocaleAll(thing, property);

    if (map) {
        return map.values().next().value[0];
    }
    
    return null;
}

export async function fetchUserProfile(webId: string) : Promise<ProfileType> {
    const dataset      = await getSolidDataset(webId);
    const me           = getThing(dataset,webId);
    const givenName    = getString(me,FOAF.givenName);
    const familyName   = getString(me,FOAF.familyName);
    const name         = getString(me,FOAF.name);
    const img          = getUrl(me,FOAF.img);

    return {
        webId: webId ,
        givenName: givenName,
        familyName: familyName, 
        name:  name,
        img: img ,
        data: dataset
    };
}