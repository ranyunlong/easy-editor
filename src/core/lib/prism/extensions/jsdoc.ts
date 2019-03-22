/**
 * Language jsdoc
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import javadoclike from "./javadoclike";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {

    var javascript = languages.javascript;

    var type = /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})+}/.source;
    var parameterPrefix = '(@(?:param|arg|argument|property)\\s+(?:' + type + '\\s+)?)';
    if (!languages.javadoclike) javadoclike(languages, hooks, util);
    languages.jsdoc = languages.extend('javadoclike', {
        'parameter': {
            // @param {string} foo - foo bar
            pattern: RegExp(parameterPrefix + /[$\w\xA0-\uFFFF.]+(?=\s|$)/.source),
            lookbehind: true,
            inside: {
                'punctuation': /\./
            }
        }
    });

    languages.insertBefore('jsdoc', 'keyword', {
        'optional-parameter': {
            // @param {string} [baz.foo="bar"] foo bar
            pattern: RegExp(parameterPrefix + /\[[$\w\xA0-\uFFFF.]+(?:=[^[\]]+)?\](?=\s|$)/.source),
            lookbehind: true,
            inside: {
                'parameter': {
                    pattern: /(^\[)[$\w\xA0-\uFFFF\.]+/,
                    lookbehind: true,
                    inside: {
                        'punctuation': /\./
                    }
                },
                'code': {
                    pattern: /(=)[\s\S]*(?=\]$)/,
                    lookbehind: true,
                    inside: javascript,
                    alias: 'language-javascript'
                },
                'punctuation': /[=[\]]/
            }
        },
        'class-name': [
            {
                pattern: RegExp('(@[a-z]+\\s+)' + type),
                lookbehind: true,
                inside: {
                    'punctuation': /[.,:?=<>|{}()[\]]/
                }
            },
            {
                pattern: /(@(?:augments|extends|class|interface|memberof!?|this)\s+)[A-Z]\w*(?:\.[A-Z]\w*)*/,
                lookbehind: true,
                inside: {
                    'punctuation': /\./
                }
            }
        ],
        'example': {
            pattern: /(@example\s+)[^@]+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,
            lookbehind: true,
            inside: {
                'code': {
                    pattern: /^(\s*(?:\*\s*)?).+$/m,
                    lookbehind: true,
                    inside: javascript,
                    alias: 'language-javascript'
                }
            }
        }
    });

    languages.javadoclike.addSupport('javascript', languages.jsdoc);
}