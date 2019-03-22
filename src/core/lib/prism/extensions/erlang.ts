/**
 * Language erlang
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.erlang = {
        'comment': /%.+/,
        'string': {
            pattern: /"(?:\\.|[^\\"\r\n])*"/,
            greedy: true
        },
        'quoted-function': {
            pattern: /'(?:\\.|[^\\'\r\n])+'(?=\()/,
            alias: 'function'
        },
        'quoted-atom': {
            pattern: /'(?:\\.|[^\\'\r\n])+'/,
            alias: 'atom'
        },
        'boolean': /\b(?:true|false)\b/,
        'keyword': /\b(?:fun|when|case|of|end|if|receive|after|try|catch)\b/,
        'number': [
            /\$\\?./,
            /\d+#[a-z0-9]+/i,
            /(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i
        ],
        'function': /\b[a-z][\w@]*(?=\()/,
        'variable': {
            // Look-behind is used to prevent wrong highlighting of atoms containing "@"
            pattern: /(^|[^@])(?:\b|\?)[A-Z_][\w@]*/,
            lookbehind: true
        },
        'operator': [
            /[=\/<>:]=|=[:\/]=|\+\+?|--?|[=*\/!]|\b(?:bnot|div|rem|band|bor|bxor|bsl|bsr|not|and|or|xor|orelse|andalso)\b/,
            {
                // We don't want to match <<
                pattern: /(^|[^<])<(?!<)/,
                lookbehind: true
            },
            {
                // We don't want to match >>
                pattern: /(^|[^>])>(?!>)/,
                lookbehind: true
            }
        ],
        'atom': /\b[a-z][\w@]*/,
        'punctuation': /[()[\]{}:;,.#|]|<<|>>/

    };
}
