/**
 * Language json
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {

    languages.json = {
        'comment': /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
        'property': {
            pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
            greedy: true
        },
        'string': {
            pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
            greedy: true
        },
        'number': /-?\d+\.?\d*(e[+-]?\d+)?/i,
        'punctuation': /[{}[\],]/,
        'operator': /:/,
        'boolean': /\b(?:true|false)\b/,
        'null': {
            pattern: /\bnull\b/,
            alias: 'keyword'
        }
    };
}