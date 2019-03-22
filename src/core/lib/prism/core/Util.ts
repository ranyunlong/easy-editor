import { TokenNode, Token } from "./Token";
import { Grammar } from ".";
export let uniqueId = 0;

export class Util {
    /**
     * Encode raw strings in tokens in preparation to display as HTML
     */
    public encode(tokens: TokenNode): TokenNode {
        if (tokens instanceof Token) {
            return new Token(tokens.type, this.encode(tokens.content), tokens.alias);
        } else if (Array.isArray(tokens)) {
            return tokens.map(this.encode.bind(this) as any);
        } else {
            return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
        }
    }

    /**
     * Determine the type of the object
     */
    public type(o: any): string {
        return Object.prototype.toString.call(o).slice(8, -1);
    }

    /**
     * Get the unique id of this object or give it one if it does not have one
     */
    public objId(obj: any): Identifier {
        if (!obj["__id"]) {
            Object.defineProperty(obj, "__id", { value: ++uniqueId });
        }
        return obj["__id"];
    }

    /**
     * Deep clone a language definition (e.g. to extend it)
     */
    public clone(o: Grammar, visited?: any): Grammar {
        let clone: Grammar | Grammar[];
        let id: Identifier;
        const type: string = this.type(o);
        visited = visited || {};

        switch (type) {
            case "Object":
                id = this.objId(o);
                if (visited[id as any]) {
                    return visited[id as any];
                }
                clone = {};
                visited[id as any] = clone;

                for (const key in o) {
                    if (o.hasOwnProperty(key)) {
                        clone[key as keyof Grammar] = this.clone(o[key as keyof Grammar] as Grammar, visited);
                    }
                }

                return clone;

            case "Array":
                id = this.objId(o);
                if (visited[id as any]) {
                    return visited[id as any];
                }
                clone = [];
                visited[id as any] = clone;

                (o as Grammar[]).forEach((v, i) => {
                    (clone as Grammar[])[i] = this.clone(v, visited);
                });

                return clone as Grammar;

            default:
                return o;
        }
    }
}

export interface Identifier {
    value: number;
}
