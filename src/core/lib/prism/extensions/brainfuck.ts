/**
 * Language brainfuck 
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.brainfuck = {
        'pointer': {
            pattern: /<|>/,
            alias: 'keyword'
        },
        'increment': {
            pattern: /\+/,
            alias: 'inserted'
        },
        'decrement': {
            pattern: /-/,
            alias: 'deleted'
        },
        'branching': {
            pattern: /\[|\]/,
            alias: 'important'
        },
        'operator': /[.,]/,
        'comment': /\S+/
    };    
}
