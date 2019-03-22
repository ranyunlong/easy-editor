/**
 * Language roboconf
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {

    languages.roboconf = {
        'comment': /#.*/,
        'keyword': {
            'pattern': /(^|\s)(?:(?:facet|instance of)(?=[ \t]+[\w-]+[ \t]*\{)|(?:external|import)\b)/,
            lookbehind: true
        },
        'component': {
            pattern: /[\w-]+(?=[ \t]*\{)/,
            alias: 'variable'
        },
        'property': /[\w.-]+(?=[ \t]*:)/,
        'value': {
            pattern: /(=[ \t]*)[^,;]+/,
            lookbehind: true,
            alias: 'attr-value'
        },
        'optional': {
            pattern: /\(optional\)/,
            alias: 'builtin'
        },
        'wildcard': {
            pattern: /(\.)\*/,
            lookbehind: true,
            alias: 'operator'
        },
        'punctuation': /[{},.;:=]/
    };
}