/**
 * Language processing
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import clike from "./clike";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.clike) clike(languages, hooks, util);
    languages.processing = languages.extend('clike', {
        'keyword': /\b(?:break|catch|case|class|continue|default|else|extends|final|for|if|implements|import|new|null|private|public|return|static|super|switch|this|try|void|while)\b/,
        'operator': /<[<=]?|>[>=]?|&&?|\|\|?|[%?]|[!=+\-*\/]=?/
    });
    languages.insertBefore('processing', 'number', {
        // Special case: XML is a type
        'constant': /\b(?!XML\b)[A-Z][A-Z\d_]+\b/,
        'type': {
            pattern: /\b(?:boolean|byte|char|color|double|float|int|XML|[A-Z]\w*)\b/,
            alias: 'variable'
        }
    });

    // Spaces are allowed between function name and parenthesis
    languages.processing['function'].pattern = /\w+(?=\s*\()/;

    // Class-names is not styled by default
    languages.processing['class-name'].alias = 'variable';
}