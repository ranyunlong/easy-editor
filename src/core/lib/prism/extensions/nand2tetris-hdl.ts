/**
 * Language nand2tetris-hdl
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages['nand2tetris-hdl'] = {
        'comment': /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
        'keyword': /\b(?:CHIP|IN|OUT|PARTS|BUILTIN|CLOCKED)\b/,
        'boolean': /\b(?:true|false)\b/,
        'function': /[A-Za-z][A-Za-z0-9]*(?=\()/,
        'number': /\b\d+\b/,
        'operator': /=|\.\./,
        'punctuation': /[{}[\];(),:]/
    };
}
