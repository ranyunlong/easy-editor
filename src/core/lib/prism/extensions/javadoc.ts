/**
 * Language javadoc
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import javadoclike from "./javadoclike";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {

    var codeLines = {
        'code': {
            pattern: /(^(\s*(?:\*\s*)*)).*[^*\s].+$/m,
            lookbehind: true,
            inside: languages.java,
            alias: 'language-java'
        }
    };

    if (!languages['javadoclike']) javadoclike(languages, hooks, util);

    languages.javadoc = languages.extend('javadoclike', {});
    languages.insertBefore('javadoc', 'keyword', {
        'class-name': [
            {
                pattern: /(@(?:exception|throws|see|link|linkplain|value)\s+(?:[a-z\d]+\.)*)[A-Z](?:\w*[a-z]\w*)?(?:\.[A-Z](?:\w*[a-z]\w*)?)*/,
                lookbehind: true,
                inside: {
                    'punctuation': /\./
                }
            },
            {
                // @param <T> the first generic type parameter
                pattern: /(@param\s+)<[A-Z]\w*>/,
                lookbehind: true,
                inside: {
                    'punctuation': /[.<>]/
                }
            }
        ],
        'namespace': {
            pattern: /(@(?:exception|throws|see|link|linkplain)\s+)(?:[a-z\d]+\.)+/,
            lookbehind: true,
            inside: {
                'punctuation': /\./
            }
        },
        'code-section': [
            {
                pattern: /(\{@code\s+)(?:[^{}]|\{[^{}]*\})+?(?=\s*\})/,
                lookbehind: true,
                inside: codeLines
            },
            {
                pattern: /(<(code|tt)>\s*)[\s\S]+?(?=\s*<\/\2>)/,
                lookbehind: true,
                inside: codeLines
            }
        ],
        'tag': languages.markup.tag,
    });

    languages.javadoclike.addSupport('java', languages.javadoc);
}