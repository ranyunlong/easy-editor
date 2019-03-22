/**
 * Language flow
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import javascript from "./javascript";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.javascript) javascript(languages, hooks, util);
    languages.flow = languages.extend('javascript', {});
    languages.insertBefore('flow', 'keyword', {
        'type': [
            {
                pattern: /\b(?:[Nn]umber|[Ss]tring|[Bb]oolean|Function|any|mixed|null|void)\b/,
                alias: 'tag'
            }
        ]
    });
    languages.flow['function-variable'].pattern = /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)(?:\s*:\s*\w+)?|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i;
    delete languages.flow['parameter'];

    languages.insertBefore('flow', 'operator', {
        'flow-punctuation': {
            pattern: /\{\||\|\}/,
            alias: 'punctuation'
        }
    });

    if (!Array.isArray(languages.flow.keyword)) {
        languages.flow.keyword = [languages.flow.keyword];
    }
    languages.flow.keyword.unshift(
        {
            pattern: /(^|[^$]\b)(?:type|opaque|declare|Class)\b(?!\$)/,
            lookbehind: true
        },
        {
            pattern: /(^|[^$]\B)\$(?:await|Diff|Exact|Keys|ObjMap|PropertyType|Shape|Record|Supertype|Subtype|Enum)\b(?!\$)/,
            lookbehind: true
        }
    );

}