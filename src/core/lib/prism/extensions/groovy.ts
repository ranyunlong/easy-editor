/**
 * Language groovy
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import clike from "./clike";
import Prism from "../core";

import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.clike) clike(languages, hooks, util);
    languages.groovy = languages.extend('clike', {
        'keyword': /\b(?:as|def|in|abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|trait|transient|try|void|volatile|while)\b/,
        'string': [
            {
                pattern: /("""|''')[\s\S]*?\1|(?:\$\/)(?:\$\/\$|[\s\S])*?\/\$/,
                greedy: true
            },
            {
                pattern: /(["'\/])(?:\\.|(?!\1)[^\\\r\n])*\1/,
                greedy: true
            }
        ],
        'number': /\b(?:0b[01_]+|0x[\da-f_]+(?:\.[\da-f_p\-]+)?|[\d_]+(?:\.[\d_]+)?(?:e[+-]?[\d]+)?)[glidf]?\b/i,
        'operator': {
            pattern: /(^|[^.])(?:~|==?~?|\?[.:]?|\*(?:[.=]|\*=?)?|\.[@&]|\.\.<|\.{1,2}(?!\.)|-[-=>]?|\+[+=]?|!=?|<(?:<=?|=>?)?|>(?:>>?=?|=)?|&[&=]?|\|[|=]?|\/=?|\^=?|%=?)/,
            lookbehind: true
        },
        'punctuation': /\.+|[{}[\];(),:$]/
    });
    
    languages.insertBefore('groovy', 'string', {
        'shebang': {
            pattern: /#!.+/,
            alias: 'comment'
        }
    });
    
    languages.insertBefore('groovy', 'punctuation', {
        'spock-block': /\b(?:setup|given|when|then|and|cleanup|expect|where):/
    });
    
    languages.insertBefore('groovy', 'function', {
        'annotation': {
            alias: 'punctuation',
            pattern: /(^|[^.])@\w+/,
            lookbehind: true
        }
    });
    
    // Handle string interpolation
    hooks.add('wrap',  (env) => {
        if ((env as any).language === 'groovy' && env.type === 'string') {
            var delimiter = env.content[0];
    
            if (delimiter !== "'") {
                var pattern = /([^\\])(?:\$(?:\{.*?\}|[\w.]+))/;
                if (delimiter === '$') {
                    pattern = /([^\$])(?:\$(?:\{.*?\}|[\w.]+))/;
                }
    
                // To prevent double HTML-encoding we have to decode env.content first
                env.content = env.content.replace(/&lt;/g, '<').replace(/&amp;/g, '&');
    
                env.content = new Prism().highlight(env.content, {
                    'expression': {
                        pattern,
                        lookbehind: true,
                        inside: languages.groovy
                    }
                });
    
                (env as any).classes.push(delimiter === '/' ? 'regex' : 'gstring');
            }
        }
    });    
}
