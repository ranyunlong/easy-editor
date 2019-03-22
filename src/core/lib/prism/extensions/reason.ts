/**
 * Language reason
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import clike from "./clike";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.clike) clike(languages, hooks, util);
    languages.reason = languages.extend('clike', {
        'comment': {
            pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
            lookbehind: true
        },
        'string': {
            pattern: /"(?:\\(?:\r\n|[\s\S])|[^\\\r\n"])*"/,
            greedy: true
        },
        // 'class-name' must be matched *after* 'constructor' defined below
        'class-name': /\b[A-Z]\w*/,
        'keyword': /\b(?:and|as|assert|begin|class|constraint|do|done|downto|else|end|exception|external|for|fun|function|functor|if|in|include|inherit|initializer|lazy|let|method|module|mutable|new|nonrec|object|of|open|or|private|rec|sig|struct|switch|then|to|try|type|val|virtual|when|while|with)\b/,
        'operator': /\.{3}|:[:=]|\|>|->|=(?:==?|>)?|<=?|>=?|[|^?'#!~`]|[+\-*\/]\.?|\b(?:mod|land|lor|lxor|lsl|lsr|asr)\b/
    });
    languages.insertBefore('reason', 'class-name', {
        'character': {
            pattern: /'(?:\\x[\da-f]{2}|\\o[0-3][0-7][0-7]|\\\d{3}|\\.|[^'\\\r\n])'/,
            alias: 'string'
        },
        'constructor': {
            // Negative look-ahead prevents from matching things like String.capitalize
            pattern: /\b[A-Z]\w*\b(?!\s*\.)/,
            alias: 'variable'
        },
        'label': {
            pattern: /\b[a-z]\w*(?=::)/,
            alias: 'symbol'
        }
    });

    // We can't match functions property, so let's not even try.
    delete languages.reason.function;
}