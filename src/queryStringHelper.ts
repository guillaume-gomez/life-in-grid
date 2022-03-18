import { Period } from "./interfaces";

interface ParsedParamsObjectInterface {
    birthday: string;
    "period-length": number;
    periods: Period[];
}

const regex = /(.*)\[(.*)\]\[(.*)\]/

function is2dimArrayKey(keyObj: string) : boolean {
    return !!keyObj.match(regex);
}

function parseArrayKey(keyObj: string) : [string, string, string] {
    const result = keyObj.match(regex);
    if(!result) {
        return ["", "", ""];
    }
    const [_string, key, index, field] = result;
    return [key, index, field];
}

export function parseParams(params: URLSearchParams, periodLength: number) : ParsedParamsObjectInterface {
    const periodsArray : Period[] = Array(periodLength).fill(0).map((_val , index) => {
      return { name: index.toString(), color: "#131963", start: new Date(), end: new Date(), overlap: false }
    })
    let queryStringObject : any = { birthday: "", periods: periodsArray, "period-length": periodLength };
    for(let pair of Array.from(params.entries())) {
      if(is2dimArrayKey(pair[0])) {
        const [key, index, field] = parseArrayKey(pair[0]);
        queryStringObject[key][index][field] = pair[1];
      } else {
        queryStringObject[pair[0]] = pair[1];
      }
    }
    return queryStringObject;
}