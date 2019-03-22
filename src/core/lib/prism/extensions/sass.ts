/**
 * Language sass
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import css from "./css";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.css) css(languages, hooks, util);
    languages.sass = languages.extend('css', {
        // Sass comments don't need to be closed, only indented
        'comment': {
            pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t]+.+)*/m,
            lookbehind: true
        }
    });

    languages.insertBefore('sass', 'atrule', {
        // We want to consume the whole line
        'atrule-line': {
            // Includes support for = and + shortcuts
            pattern: /^(?:[ \t]*)[@+=].+/m,
            inside: {
                'atrule': /(?:@[\w-]+|[+=])/m
            }
        }
    });
    delete languages.sass.atrule;

    var variable = /\$[-\w]+|#\{\$[-\w]+\}/;
    var operator = [
        /[+*\/%]|[=!]=|<=?|>=?|\b(?:and|or|not)\b/,
        {
            pattern: /(\s+)-(?=\s)/,
            lookbehind: true
        }
    ];

    languages.insertBefore('sass', 'property', {
        // We want to consume the whole line
        'variable-line': {
            pattern: /^[ \t]*\$.+/m,
            inside: {
                'punctuation': /:/,
                'variable': variable,
                'operator': operator
            }
        },
        // We want to consume the whole line
        'property-line': {
            pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s]+.*)/m,
            inside: {
                'property': [
                    /[^:\s]+(?=\s*:)/,
                    {
                        pattern: /(:)[^:\s]+/,
                        lookbehind: true
                    }
                ],
                'punctuation': /:/,
                'variable': variable,
                'operator': operator,
                'important': languages.sass.important
            }
        }
    });
    delete languages.sass.property;
    delete languages.sass.important;

    // Now that whole lines for other patterns are consumed,
    // what's left should be selectors
    languages.insertBefore('sass', 'punctuation', {
        'selector': {
            pattern: /([ \t]*)\S(?:,?[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,?[^,\r\n]+)*)*/,
            lookbehind: true
        }
    });
}