import { Grammar, util } from ".";

export class Languages {
    /**
     * Extend a language definition
     * @param id The language definition to extend
     * @param redef The new language definition to extend the original
     */
    public extend(id: string, redef: Grammar): Grammar {
        const lang = util.clone(this[id]);
        for (const key in redef) {
            lang[key as keyof Grammar] = redef[key as keyof Grammar];
        }
        return lang;
    }

    /**
     * Insert a token before another token in a language literal
     * As this needs to recreate the object (we cannot actually insert before keys in object literals),
     * we cannot just provide an object, we need anobject and a key.
     * @param inside The key (or language id) of the parent
     * @param before The key to insert before. If not provided, the function appends instead.
     * @param insert Object with the key/value pairs to insert
     * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
     */
    public insertBefore(inside: string, before: string, insert: Grammar, root?: Grammar | Languages): Grammar {
        root = root || this;
        const  grammar = root[inside as keyof Grammar];
        const ret: any = {};

        for (const token in grammar as Grammar) {
            if ((grammar as Grammar).hasOwnProperty(token)) {

                if (token === before) {
                    for (const newToken in insert) {
                        if (insert.hasOwnProperty(newToken)) {
                            ret[newToken] = insert[newToken as keyof Grammar];
                        }
                    }
                }

                // Do not insert token which also occur in insert. See #1525
                if (!insert.hasOwnProperty(token)) {
                    ret[token] = (grammar as Grammar)[token as keyof Grammar];
                }
            }

            const old = root[inside as keyof Grammar];
            root[inside as keyof Grammar] = ret;

            // Update references in other language definitions
            this.DFS(this, (key, value) => {
                if (value === old && key !== inside) {
                    this[key] = ret;
                }
            });
        }

        return insert;
    }

    public DFS(o: Languages, callback: (key: string, value: any, type?: any) => void, type?: any, visited?: any) {
        visited = visited || {};
        const objId = util.objId;

        for (const i in o) {
            if (o.hasOwnProperty(i)) {
                callback(i, o[i], type || i);

                const property = o[i];
                const propertyType = util.type(property);

                if (propertyType === "Object" && !visited[objId(property) as any]) {
                    visited[objId(property) as any] = true;
                    this.DFS(property, callback, null, visited);
                } else if (propertyType === "Array" && !visited[objId(property) as any]) {
                    visited[objId(property) as any] = true;
                    this.DFS(property, callback, i, visited);
                }
            }
        }
    }

    [key: string]: Grammar | any;
}