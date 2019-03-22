/**
 * Language arff
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.arff = {
        'comment': /%.*/,
        'string': {
            pattern: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
            greedy: true
        },
        'keyword': /@(?:attribute|data|end|relation)\b/i,
        'number': /\b\d+(?:\.\d+)?\b/,
        'punctuation': /[{},]/
    };    
}
