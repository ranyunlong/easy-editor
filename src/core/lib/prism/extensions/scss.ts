/**
 * Language scss
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import css from "./css";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.css) css(languages, hooks, util);
    languages.scss = languages.extend('css', {
        'comment': {
            pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
            lookbehind: true
        },
        'atrule': {
            pattern: /@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,
            inside: {
                'rule': /@[\w-]+/
                // See rest below
            }
        },
        // url, compassified
        'url': /(?:[-a-z]+-)*url(?=\()/i,
        // CSS selector regex is not appropriate for Sass
        // since there can be lot more things (var, @ directive, nesting..)
        // a selector must start at the end of a property or after a brace (end of other rules or nesting)
        // it can contain some characters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
        // the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
        // can "pass" as a selector- e.g: proper#{$erty})
        // this one was hard to do, so please be careful if you edit this one :)
        'selector': {
            // Initial look-ahead is used to prevent matching of blank selectors
            pattern: /(?=\S)[^@;{}()]?(?:[^@;{}()]|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}]+[:{][^}]+))/m,
            inside: {
                'parent': {
                    pattern: /&/,
                    alias: 'important'
                },
                'placeholder': /%[-\w]+/,
                'variable': /\$[-\w]+|#\{\$[-\w]+\}/
            }
        },
        'property': {
            pattern: /(?:[\w-]|\$[-\w]+|#\{\$[-\w]+\})+(?=\s*:)/,
            inside: {
                'variable': /\$[-\w]+|#\{\$[-\w]+\}/
            }
        }
    });

    languages.insertBefore('scss', 'atrule', {
        'keyword': [
            /@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,
            {
                pattern: /( +)(?:from|through)(?= )/,
                lookbehind: true
            }
        ]
    });

    languages.insertBefore('scss', 'important', {
        // var and interpolated vars
        'variable': /\$[-\w]+|#\{\$[-\w]+\}/
    });

    languages.insertBefore('scss', 'function', {
        'placeholder': {
            pattern: /%[-\w]+/,
            alias: 'selector'
        },
        'statement': {
            pattern: /\B!(?:default|optional)\b/i,
            alias: 'keyword'
        },
        'boolean': /\b(?:true|false)\b/,
        'null': {
            pattern: /\bnull\b/,
            alias: 'keyword'
        },
        'operator': {
            pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,
            lookbehind: true
        }
    });

    languages.scss['atrule'].inside.rest = languages.scss;
}