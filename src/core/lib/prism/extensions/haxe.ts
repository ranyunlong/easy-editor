/**
 * Language haxe
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import clike from "./clike";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.clike) clike(languages, hooks, util);
    languages.haxe = languages.extend('clike', {
        // Strings can be multi-line
        'string': {
            pattern: /(["'])(?:(?!\1)[^\\]|\\[\s\S])*\1/,
            greedy: true,
            inside: {
                'interpolation': {
                    pattern: /(^|[^\\])\$(?:\w+|\{[^}]+\})/,
                    lookbehind: true,
                    inside: {
                        'interpolation': {
                            pattern: /^\$\w*/,
                            alias: 'variable'
                        }
                        // See rest below
                    }
                }
            }
        },
        // The final look-ahead prevents highlighting of keywords if expressions such as "haxe.macro.Expr"
        'keyword': /\bthis\b|\b(?:abstract|as|break|case|cast|catch|class|continue|default|do|dynamic|else|enum|extends|extern|from|for|function|if|implements|import|in|inline|interface|macro|new|null|override|public|private|return|static|super|switch|throw|to|try|typedef|using|var|while)(?!\.)\b/,
        'operator': /\.{3}|\+\+?|-[->]?|[=!]=?|&&?|\|\|?|<[<=]?|>[>=]?|[*\/%~^]/
    });
    languages.insertBefore('haxe', 'class-name', {
        'regex': {
            pattern: /~\/(?:[^\/\\\r\n]|\\.)+\/[igmsu]*/,
            greedy: true
        }
    });
    languages.insertBefore('haxe', 'keyword', {
        'preprocessor': {
            pattern: /#\w+/,
            alias: 'builtin'
        },
        'metadata': {
            pattern: /@:?\w+/,
            alias: 'symbol'
        },
        'reification': {
            pattern: /\$(?:\w+|(?=\{))/,
            alias: 'variable'
        }
    });
    languages.haxe['string'].inside['interpolation'].inside.rest = languages.haxe;
    delete languages.haxe['class-name'];    
}
