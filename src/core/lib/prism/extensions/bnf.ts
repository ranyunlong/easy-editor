/**
 * Language bnf
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.bnf = {
        'string': {
            pattern: /"[^\r\n"]*"|'[^\r\n']*'/
        },
        'definition': {
            pattern: /<[^<>\r\n\t]+>(?=\s*::=)/,
            alias: ['rule', 'keyword'],
            inside: {
                'punctuation': /^<|>$/
            }
        },
        'rule': {
            pattern: /<[^<>\r\n\t]+>/,
            inside: {
                'punctuation': /^<|>$/
            }
        },
        'operator': /::=|[|()[\]{}*+?]|\.{3}/
    };

    languages.rbnf = languages.bnf;
}
