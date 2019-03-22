/**
 * Language opencl
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.parigp = {
        'comment': /\/\*[\s\S]*?\*\/|\\\\.*/,
        'string': {
            pattern: /"(?:[^"\\\r\n]|\\.)*"/,
            greedy: true
        },
        // PARI/GP does not care about white spaces at all
        // so let's process the keywords to build an appropriate regexp
        // (e.g. "b *r *e *a *k", etc.)
        'keyword': ((() => {
            var keywords: any = [
                'breakpoint', 'break', 'dbg_down', 'dbg_err', 'dbg_up', 'dbg_x',
                'forcomposite', 'fordiv', 'forell', 'forpart', 'forprime',
                'forstep', 'forsubgroup', 'forvec', 'for', 'iferr', 'if',
                'local', 'my', 'next', 'return', 'until', 'while'
            ];
            keywords = keywords.map((keyword: any) => {
                return keyword.split('').join(' *');
            }).join('|');
            return RegExp('\\b(?:' + keywords + ')\\b');
        })()),
        'function': /\w[\w ]*?(?= *\()/,
        'number': {
            // The lookbehind and the negative lookahead prevent from breaking the .. operator
            pattern: /((?:\. *\. *)?)(?:\d(?: *\d)*(?: *(?!\. *\.)\.(?: *\d)*)?|\. *\d(?: *\d)*)(?: *e *[+-]? *\d(?: *\d)*)?/i,
            lookbehind: true
        },
        'operator': /\. *\.|[*\/!](?: *=)?|%(?: *=|(?: *#)?(?: *')*)?|\+(?: *[+=])?|-(?: *[-=>])?|<(?:(?: *<)?(?: *=)?| *>)?|>(?: *>)?(?: *=)?|=(?: *=){0,2}|\\(?: *\/)?(?: *=)?|&(?: *&)?|\| *\||['#~^]/,
        'punctuation': /[\[\]{}().,:;|]/
    };
}