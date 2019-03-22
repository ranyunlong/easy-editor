/**
 * Language phpdoc
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import javadoclike from "./javadoclike";

export default (languages: Languages, hooks: Hook, util: Util) => {
    var typeExpression = /(?:[a-zA-Z]\w*|[|\\[\]])+/.source;
    if (!languages.javadoclike) javadoclike(languages, hooks, util);
    languages.phpdoc = languages.extend('javadoclike', {
        'parameter': {
            pattern: RegExp('(@(?:global|param|property(?:-read|-write)?|var)\\s+(?:' + typeExpression + '\\s+)?)\\$\\w+'),
            lookbehind: true
        }
    });

    languages.insertBefore('phpdoc', 'keyword', {
        'class-name': [
            {
                pattern: RegExp('(@(?:global|package|param|property(?:-read|-write)?|return|subpackage|throws|var)\\s+)' + typeExpression),
                lookbehind: true,
                inside: {
                    'keyword': /\b(?:callback|resource|boolean|integer|double|object|string|array|false|float|mixed|bool|null|self|true|void|int)\b/,
                    'punctuation': /[|\\[\]()]/
                }
            }
        ],
    });

    languages.javadoclike.addSupport('php', languages.phpdoc);
}