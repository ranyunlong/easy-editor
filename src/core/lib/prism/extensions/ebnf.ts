/**
 * Language ebnf
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.ebnf = {
        'comment': /\(\*[\s\S]*?\*\)/,
        'string': {
            pattern: /"[^"\r\n]*"|'[^'\r\n]*'/,
            greedy: true
        },
        'special': {
            pattern: /\?[^?\r\n]*\?/,
            greedy: true,
            alias: 'class-name'
        },
    
        'definition': {
            pattern: /^(\s*)[a-z]\w*(?:[ \t]+[a-z]\w*)*(?=\s*=)/im,
            lookbehind: true,
            alias: ['rule', 'keyword']
        },
        'rule': /[a-z]\w*(?:[ \t]+[a-z]\w*)*/i,
    
        'punctuation': /\([:/]|[:/]\)|[.,;()[\]{}]/,
        'operator': /[-=|*/!]/
    };
    
}