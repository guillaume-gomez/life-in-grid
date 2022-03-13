const regex = /(.*)\[(.*)\]\[(.*)\]/

export function is2dimArrayKey(keyObj: string) : boolean {
    return !!keyObj.match(regex);
}

export function parseArrayKey(keyObj: string) : [string, string, string] {
    const result = keyObj.match(regex);
    if(!result) {
        return ["", "", ""];
    }
    const [_string, key, index, field] = result;
    return [key, index, field];
}
