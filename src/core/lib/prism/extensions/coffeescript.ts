/**
 * Language coffeescript
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    // Ignore comments starting with { to privilege string interpolation highlighting
    var comment = /#(?!\{).+/,
        interpolation = {
            pattern: /#\{[^}]+\}/,
            alias: 'variable'
        };

    languages.coffeescript = languages.extend('javascript', {
        'comment': comment,
        'string': [

            // Strings are multiline
            {
                pattern: /'(?:\\[\s\S]|[^\\'])*'/,
                greedy: true
            },

            {
                // Strings are multiline
                pattern: /"(?:\\[\s\S]|[^\\"])*"/,
                greedy: true,
                inside: {
                    'interpolation': interpolation
                }
            }
        ],
        'keyword': /\b(?:and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/,
        'class-member': {
            pattern: /@(?!\d)\w+/,
            alias: 'variable'
        }
    });

    languages.insertBefore('coffeescript', 'comment', {
        'multiline-comment': {
            pattern: /###[\s\S]+?###/,
            alias: 'comment'
        },

        // Block regexp can contain comments and interpolation
        'block-regex': {
            pattern: /\/{3}[\s\S]*?\/{3}/,
            alias: 'regex',
            inside: {
                'comment': comment,
                'interpolation': interpolation
            }
        }
    });

    languages.insertBefore('coffeescript', 'string', {
        'inline-javascript': {
            pattern: /`(?:\\[\s\S]|[^\\`])*`/,
            inside: {
                'delimiter': {
                    pattern: /^`|`$/,
                    alias: 'punctuation'
                },
                rest: languages.javascript
            }
        },

        // Block strings
        'multiline-string': [
            {
                pattern: /'''[\s\S]*?'''/,
                greedy: true,
                alias: 'string'
            },
            {
                pattern: /"""[\s\S]*?"""/,
                greedy: true,
                alias: 'string',
                inside: {
                    interpolation
                }
            }
        ]

    });

    languages.insertBefore('coffeescript', 'keyword', {
        // Object property
        'property': /(?!\d)\w+(?=\s*:(?!:))/
    });

    delete languages.coffeescript['template-string'];

    languages.coffee = languages.coffeescript;
}
