/**
 * Language json5
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import json from "./json";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.json) json(languages, hooks, util);
    languages.jsonp = languages.extend('json', {
        'punctuation': /[{}[\]();,.]/
    });

    languages.insertBefore('jsonp', 'punctuation', {
        'function': /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/
    });
}