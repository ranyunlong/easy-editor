/**
 * Language javascript
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import clike from "./clike";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.clike) clike(languages, hooks, util);
    languages.javascript = languages.extend('clike', {
        'class-name': [
            languages.clike['class-name'],
            {
                pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
                lookbehind: true
            }
        ],
        'keyword': [
            {
                pattern: /((?:^|})\s*)(?:catch|finally)\b/,
                lookbehind: true
            },
            {
                pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
                lookbehind: true
            },
        ],
        'number': /\b(?:(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+)n?|\d+n|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
        // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
        'function': /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
        'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
    });

    languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

    languages.insertBefore('javascript', 'keyword', {
        'regex': {
            pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
            lookbehind: true,
            greedy: true
        },
        // This must be declared before keyword because we use "function" inside the look-forward
        'function-variable': {
            pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
            alias: 'function'
        },
        'parameter': [
            {
                pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
                lookbehind: true,
                inside: languages.javascript
            },
            {
                pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
                inside: languages.javascript
            },
            {
                pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
                lookbehind: true,
                inside: languages.javascript
            },
            {
                pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
                lookbehind: true,
                inside: languages.javascript
            }
        ],
        'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    });

    languages.insertBefore('javascript', 'string', {
        'template-string': {
            pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
            greedy: true,
            inside: {
                'interpolation': {
                    pattern: /\${[^}]+}/,
                    inside: {
                        'interpolation-punctuation': {
                            pattern: /^\${|}$/,
                            alias: 'punctuation'
                        },
                        rest: languages.javascript
                    }
                },
                'string': /[\s\S]+/
            }
        }
    });

    if (languages.markup) {
        languages.markup.tag.addInlined('script', 'javascript');
    }

    languages.js = languages.javascript;

    languages.insertBefore('javascript', 'function-variable', {
        'method-variable': {
            pattern: RegExp('(\\.\\s*)' + languages.javascript['function-variable'].pattern.source),
            lookbehind: true,
            alias: ['function-variable', 'method', 'function', 'property-access']
        }
    });

    languages.insertBefore('javascript', 'function', {
        'method': {
            pattern: RegExp('(\\.\\s*)' + languages.javascript['function'].source),
            lookbehind: true,
            alias: ['function', 'property-access']
        }
    });

    languages.insertBefore('javascript', 'constant', {
        'known-class-name': [
            {
                // standard built-ins
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
                pattern: /\b(?:(?:(?:Uint|Int)(?:8|16|32)|Uint8Clamped|Float(?:32|64))?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|(?:Weak)?(?:Set|Map)|WebAssembly)\b/,
                alias: 'class-name'
            },
            {
                // errors
                pattern: /\b(?:[A-Z]\w*)Error\b/,
                alias: 'class-name'
            }
        ]
    });

    languages.javascript['keyword'].unshift(
        {
            pattern: /\b(?:as|default|export|from|import)\b/,
            alias: 'module'
        },
        {
            pattern: /\bnull\b/,
            alias: ['null', 'nil']
        },
        {
            pattern: /\bundefined\b/,
            alias: 'nil'
        }
    );

    languages.insertBefore('javascript', 'operator', {
        'spread': {
            pattern: /\.{3}/,
            alias: 'operator'
        },
        'arrow': {
            pattern: /=>/,
            alias: 'operator'
        }
    });

    languages.insertBefore('javascript', 'punctuation', {
        'property-access': {
            pattern: /(\.\s*)[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*/,
            lookbehind: true
        },
        'maybe-class-name': {
            pattern: /(^|[^$\w\xA0-\uFFFF])[A-Z][$\w\xA0-\uFFFF]+/,
            lookbehind: true
        },
        'dom': {
            // this contains only a few commonly used DOM variables
            pattern: /\b(?:document|location|navigator|performance|(?:local|session)Storage|window)\b/,
            alias: 'variable'
        },
        'console': {
            pattern: /\bconsole(?=\s*\.)/,
            alias: 'class-name'
        }
    });

    // add 'maybe-class-name' to tokens which might be a class name
    var maybeClassNameTokens = ['function', 'function-variable', 'method', 'method-variable', 'property-access'];

    for (var i = 0; i < maybeClassNameTokens.length; i++) {
        var token = maybeClassNameTokens[i];
        var value = languages.javascript[token];

        // convert regex to object
        if (util.type(value) === 'RegExp') {
            value = languages.javascript[token] = {
                pattern: value
            };
        }

        // keep in mind that we don't support arrays

        var inside = value.inside || {};
        value.inside = inside;

        inside['maybe-class-name'] = /^[A-Z][\s\S]*/;
    }
}
