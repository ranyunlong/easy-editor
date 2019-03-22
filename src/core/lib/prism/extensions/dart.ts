/**
 * Language dart
 */
import clike from './clike';
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.clike) clike(languages, hooks, util);
    languages.dart = languages.extend('clike', {
        'string': [
            {
                pattern: /r?("""|''')[\s\S]*?\1/,
                greedy: true
            },
            {
                pattern: /r?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
                greedy: true
            }
        ],
        'keyword': [
            /\b(?:async|sync|yield)\*/,
            /\b(?:abstract|assert|async|await|break|case|catch|class|const|continue|default|deferred|do|dynamic|else|enum|export|external|extends|factory|final|finally|for|get|if|implements|import|in|library|new|null|operator|part|rethrow|return|set|static|super|switch|this|throw|try|typedef|var|void|while|with|yield)\b/
        ],
        'operator': /\bis!|\b(?:as|is)\b|\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?/
    });
    
    languages.insertBefore('dart', 'function', {
        'metadata': {
            pattern: /@\w+/,
            alias: 'symbol'
        }
    });    
}
