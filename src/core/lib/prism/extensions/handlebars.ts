/**
 * Language hanlebars
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.handlebars = {
        'comment': /\{\{![\s\S]*?\}\}/,
        'delimiter': {
            pattern: /^\{\{\{?|\}\}\}?$/i,
            alias: 'punctuation'
        },
        'string': /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
        'number': /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
        'boolean': /\b(?:true|false)\b/,
        'block': {
            pattern: /^(\s*~?\s*)[#\/]\S+?(?=\s*~?\s*$|\s)/i,
            lookbehind: true,
            alias: 'keyword'
        },
        'brackets': {
            pattern: /\[[^\]]+\]/,
            inside: {
                punctuation: /\[|\]/,
                variable: /[\s\S]+/
            }
        },
        'punctuation': /[!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]/,
        'variable': /[^!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~\s]+/
    };

    hooks.add('before-tokenize', (env) => {
        var handlebarsPattern = /\{\{\{[\s\S]+?\}\}\}|\{\{[\s\S]+?\}\}/g;
        languages['markup-templating'].buildPlaceholders(env, 'handlebars', handlebarsPattern);
    });

    hooks.add('after-tokenize', (env) => {
        languages['markup-templating'].tokenizePlaceholders(env, 'handlebars');
    });

}