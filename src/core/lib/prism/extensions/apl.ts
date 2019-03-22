/**
 * Language apl
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.apl = {
        'comment': /(?:⍝|#[! ]).*$/m,
        'string': {
            pattern: /'(?:[^'\r\n]|'')*'/,
            greedy: true
        },
        'number': /¯?(?:\d*\.?\d+(?:e[+¯]?\d+)?|¯|∞)(?:j¯?(?:\d*\.?\d+(?:e[+¯]?\d+)?|¯|∞))?/i,
        'statement': /:[A-Z][a-z][A-Za-z]*\b/,
        'system-function': {
            pattern: /⎕[A-Z]+/i,
            alias: 'function'
        },
        'constant': /[⍬⌾#⎕⍞]/,
        'function': /[-+×÷⌈⌊∣|⍳⍸?*⍟○!⌹<≤=>≥≠≡≢∊⍷∪∩~∨∧⍱⍲⍴,⍪⌽⊖⍉↑↓⊂⊃⊆⊇⌷⍋⍒⊤⊥⍕⍎⊣⊢⍁⍂≈⍯↗¤→]/,
        'monadic-operator': {
            pattern: /[\\\/⌿⍀¨⍨⌶&∥]/,
            alias: 'operator'
        },
        'dyadic-operator': {
            pattern: /[.⍣⍠⍤∘⌸@⌺]/,
            alias: 'operator'
        },
        'assignment': {
            pattern: /←/,
            alias: 'keyword'
        },
        'punctuation': /[\[;\]()◇⋄]/,
        'dfn': {
            pattern: /[{}⍺⍵⍶⍹∇⍫:]/,
            alias: 'builtin'
        }
    };
    
}