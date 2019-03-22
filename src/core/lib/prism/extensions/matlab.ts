/**
 * Language matlab
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.matlab = {
        'comment': [
            /%\{[\s\S]*?\}%/,
            /%.+/
        ],
        'string': {
            pattern: /\B'(?:''|[^'\r\n])*'/,
            greedy: true
        },
        // FIXME We could handle imaginary numbers as a whole
        'number': /(?:\b\d+\.?\d*|\B\.\d+)(?:[eE][+-]?\d+)?(?:[ij])?|\b[ij]\b/,
        'keyword': /\b(?:break|case|catch|continue|else|elseif|end|for|function|if|inf|NaN|otherwise|parfor|pause|pi|return|switch|try|while)\b/,
        'function': /(?!\d)\w+(?=\s*\()/,
        'operator': /\.?[*^\/\\']|[+\-:@]|[<>=~]=?|&&?|\|\|?/,
        'punctuation': /\.{3}|[.,;\[\](){}!]/
    };
}