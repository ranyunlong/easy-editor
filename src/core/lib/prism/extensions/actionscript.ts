/**
 * Language actionscript
 */

import { Languages } from "../core/Languages";
import javascript from './javascript'
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages['javascript']) {
        javascript(languages, hooks, util)
    }
    languages.actionscript = languages.extend('javascript', {
        'keyword': /\b(?:as|break|case|catch|class|const|default|delete|do|else|extends|finally|for|function|if|implements|import|in|instanceof|interface|internal|is|native|new|null|package|private|protected|public|return|super|switch|this|throw|try|typeof|use|var|void|while|with|dynamic|each|final|get|include|namespace|native|override|set|static)\b/,
        'operator': /\+\+|--|(?:[+\-*\/%^]|&&?|\|\|?|<<?|>>?>?|[!=]=?)=?|[~?@]/
    });
    languages.actionscript['class-name'].alias = 'function';
    
    if (languages.markup) {
        languages.insertBefore('actionscript', 'string', {
            'xml': {
                pattern: /(^|[^.])<\/?\w+(?:\s+[^\s>\/=]+=("|')(?:\\[\s\S]|(?!\2)[^\\])*\2)*\s*\/?>/,
                lookbehind: true,
                inside: {
                    rest: languages.markup
                }
            }
        });
    }    
}