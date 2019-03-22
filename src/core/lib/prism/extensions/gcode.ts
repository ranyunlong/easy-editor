/**
 * Language gcode
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";

import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.gcode = {
        'comment': /;.*|\B\(.*?\)\B/,
        'string': {
            pattern: /"(?:""|[^"])*"/,
            greedy: true
        },
        'keyword': /\b[GM]\d+(?:\.\d+)?\b/,
        'property': /\b[A-Z]/,
        'checksum': {
            pattern: /\*\d+/,
            alias: 'punctuation'
        },
        // T0:0:0
        'punctuation': /:/
    };
    
}