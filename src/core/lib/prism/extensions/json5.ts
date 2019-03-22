/**
 * Language json5
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import json from "./json";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.json) json(languages, hooks, util);

    var string = /("|')(?:\\(?:\r\n?|\n|.)|(?!\1)[^\\\r\n])*\1/;

    languages.json5 = languages.extend('json', {
        'property': [
            {
                pattern: RegExp(string.source + '(?=\\s*:)'),
                greedy: true
            },
            {
                pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*:)/,
                alias: 'unquoted'
            }
        ],
        'string': {
            pattern: string,
            greedy: true
        },
        'number': /[+-]?(?:NaN|Infinity|0x[a-fA-F\d]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/
    });
}