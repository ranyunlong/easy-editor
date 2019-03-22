/**
 * Language scala
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import java from "./java";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.java) java(languages, hooks, util);
    languages.scala = languages.extend('java', {
        'keyword': /<-|=>|\b(?:abstract|case|catch|class|def|do|else|extends|final|finally|for|forSome|if|implicit|import|lazy|match|new|null|object|override|package|private|protected|return|sealed|self|super|this|throw|trait|try|type|val|var|while|with|yield)\b/,
        'string': [
            {
                pattern: /"""[\s\S]*?"""/,
                greedy: true
            },
            {
                pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
                greedy: true
            }
        ],
        'builtin': /\b(?:String|Int|Long|Short|Byte|Boolean|Double|Float|Char|Any|AnyRef|AnyVal|Unit|Nothing)\b/,
        'number': /\b0x[\da-f]*\.?[\da-f]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e\d+)?[dfl]?/i,
        'symbol': /'[^\d\s\\]\w*/
    });
    delete languages.scala['class-name'];
    delete languages.scala['function'];
}