/**
 * Language ini
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.ini = {
        'comment': /^[ \t]*[;#].*$/m,
        'selector': /^[ \t]*\[.*?\]/m,
        'constant': /^[ \t]*[^\s=]+?(?=[ \t]*=)/m,
        'attr-value': {
            pattern: /=.*/,
            inside: {
                'punctuation': /^[=]/
            }
        }
    };
}