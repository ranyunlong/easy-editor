/**
 * Language smalltalk
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {

    languages.smalltalk = {
        'comment': /"(?:""|[^"])*"/,
        'string': /'(?:''|[^'])*'/,
        'symbol': /#[\da-z]+|#(?:-|([+\/\\*~<>=@%|&?!])\1?)|#(?=\()/i,
        'block-arguments': {
            pattern: /(\[\s*):[^\[|]*\|/,
            lookbehind: true,
            inside: {
                'variable': /:[\da-z]+/i,
                'punctuation': /\|/
            }
        },
        'temporary-variables': {
            pattern: /\|[^|]+\|/,
            inside: {
                'variable': /[\da-z]+/i,
                'punctuation': /\|/
            }
        },
        'keyword': /\b(?:nil|true|false|self|super|new)\b/,
        'character': {
            pattern: /\$./,
            alias: 'string'
        },
        'number': [
            /\d+r-?[\dA-Z]+(?:\.[\dA-Z]+)?(?:e-?\d+)?/,
            /\b\d+(?:\.\d+)?(?:e-?\d+)?/
        ],
        'operator': /[<=]=?|:=|~[~=]|\/\/?|\\\\|>[>=]?|[!^+\-*&|,@]/,
        'punctuation': /[.;:?\[\](){}]/
    };
}