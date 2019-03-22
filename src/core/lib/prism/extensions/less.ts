/**
 * Language less
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import css from "./css";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.css) css(languages, hooks, util);
    /* FIXME :
     :extend() is not handled specifically : its highlighting is buggy.
     Mixin usage must be inside a ruleset to be highlighted.
     At-rules (e.g. import) containing interpolations are buggy.
     Detached rulesets are highlighted as at-rules.
     A comment before a mixin usage prevents the latter to be properly highlighted.
     */

    languages.less = languages.extend('css', {
        'comment': [
            /\/\*[\s\S]*?\*\//,
            {
                pattern: /(^|[^\\])\/\/.*/,
                lookbehind: true
            }
        ],
        'atrule': {
            pattern: /@[\w-]+?(?:\([^{}]+\)|[^(){};])*?(?=\s*\{)/i,
            inside: {
                'punctuation': /[:()]/
            }
        },
        // selectors and mixins are considered the same
        'selector': {
            pattern: /(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\([^{}]*\)|[^{};@])*?(?=\s*\{)/,
            inside: {
                // mixin parameters
                'variable': /@+[\w-]+/
            }
        },

        'property': /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/i,
        'operator': /[+\-*\/]/
    });

    languages.insertBefore('less', 'property', {
        'variable': [
            // Variable declaration (the colon must be consumed!)
            {
                pattern: /@[\w-]+\s*:/,
                inside: {
                    "punctuation": /:/
                }
            },

            // Variable usage
            /@@?[\w-]+/
        ],
        'mixin-usage': {
            pattern: /([{;]\s*)[.#](?!\d)[\w-]+.*?(?=[(;])/,
            lookbehind: true,
            alias: 'function'
        }
    });
}