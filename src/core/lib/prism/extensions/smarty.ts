/**
 * Language smarty
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {

    languages.smarty = {
        'comment': /\{\*[\s\S]*?\*\}/,
        'delimiter': {
            pattern: /^\{|\}$/i,
            alias: 'punctuation'
        },
        'string': /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
        'number': /\b0x[\dA-Fa-f]+|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][-+]?\d+)?/,
        'variable': [
            /\$(?!\d)\w+/,
            /#(?!\d)\w+#/,
            {
                pattern: /(\.|->)(?!\d)\w+/,
                lookbehind: true
            },
            {
                pattern: /(\[)(?!\d)\w+(?=\])/,
                lookbehind: true
            }
        ],
        'function': [
            {
                pattern: /(\|\s*)@?(?!\d)\w+/,
                lookbehind: true
            },
            /^\/?(?!\d)\w+/,
            /(?!\d)\w+(?=\()/
        ],
        'attr-name': {
            // Value is made optional because it may have already been tokenized
            pattern: /\w+\s*=\s*(?:(?!\d)\w+)?/,
            inside: {
                "variable": {
                    pattern: /(=\s*)(?!\d)\w+/,
                    lookbehind: true
                },
                "operator": /=/
            }
        },
        'punctuation': [
            /[\[\]().,:`]|->/
        ],
        'operator': [
            /[+\-*\/%]|==?=?|[!<>]=?|&&|\|\|?/,
            /\bis\s+(?:not\s+)?(?:div|even|odd)(?:\s+by)?\b/,
            /\b(?:eq|neq?|gt|lt|gt?e|lt?e|not|mod|or|and)\b/
        ],
        'keyword': /\b(?:false|off|on|no|true|yes)\b/
    };

    // Tokenize all inline Smarty expressions
    hooks.add('before-tokenize', (env) => {
        var smartyPattern = /\{\*[\s\S]*?\*\}|\{[\s\S]+?\}/g;
        var smartyLitteralStart = '{literal}';
        var smartyLitteralEnd = '{/literal}';
        var smartyLitteralMode = false;

        languages['markup-templating'].buildPlaceholders(env, 'smarty', smartyPattern, (match: any) => {
            // Smarty tags inside {literal} block are ignored
            if (match === smartyLitteralEnd) {
                smartyLitteralMode = false;
            }

            if (!smartyLitteralMode) {
                if (match === smartyLitteralStart) {
                    smartyLitteralMode = true;
                }

                return true;
            }
            return false;
        });
    });

    // Re-insert the tokens after tokenizing
    hooks.add('after-tokenize', (env) => {
        languages['markup-templating'].tokenizePlaceholders(env, 'smarty');
    });
}