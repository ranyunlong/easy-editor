/**
 * Language gedcom
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.gedcom = {
        'line-value': {
            // Preceded by level, optional pointer, and tag
            pattern: /(^\s*\d+ +(?:@\w[\w!"$%&'()*+,\-./:;<=>?[\\\]^`{|}~\x80-\xfe #]*@ +)?\w+ +).+/m,
            lookbehind: true,
            inside: {
                'pointer': {
                    pattern: /^@\w[\w!"$%&'()*+,\-./:;<=>?[\\\]^`{|}~\x80-\xfe #]*@$/,
                    alias: 'variable'
                }
            }
        },
        'tag': {
            // Preceded by level and optional pointer
            pattern: /(^\s*\d+ +(?:@\w[\w!"$%&'()*+,\-./:;<=>?[\\\]^`{|}~\x80-\xfe #]*@ +)?)\w+/m,
            lookbehind: true,
            alias: 'string'
        },
        'level': {
            pattern: /(^\s*)\d+/m,
            lookbehind: true,
            alias: 'number'
        },
        'pointer': {
            pattern: /@\w[\w!"$%&'()*+,\-./:;<=>?[\\\]^`{|}~\x80-\xfe #]*@/,
            alias: 'variable'
        }
    };
    
}