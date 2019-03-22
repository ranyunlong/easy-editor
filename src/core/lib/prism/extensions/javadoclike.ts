/**
 * Language javaDocLike
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    var javaDocLike: any = languages.javadoclike = {
        'parameter': {
            pattern: /(^\s*(?:\/{3}|\*|\/\*\*)\s*@(?:param|arg|arguments)\s+)\w+/m,
            lookbehind: true
        },
        'keyword': {
            // keywords are the first word in a line preceded be an `@` or surrounded by curly braces.
            // @word, {@word}
            pattern: /(^\s*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,
            lookbehind: true
        },
        'punctuation': /[{}]/
    };

    /**
     * Adds doc comment support to the given language and calls a given callback on each doc comment pattern.
     *
     * @param {string} lang the language add doc comment support to.
     * @param {(pattern: {inside: {rest: undefined}}) => void} callback the function called with each doc comment pattern as argument.
     */
    function docCommentSupport(lang: string, callback: (pattern: { inside: { rest: undefined } }) => void) {
        var tokenName = 'doc-comment';

        var grammar = languages[lang];
        if (!grammar) {
            return;
        }
        var token = grammar[tokenName];

        if (!token) {
            // add doc comment: /** */
            var definition: any = {};
            definition[tokenName] = {
                pattern: /(^|[^\\])\/\*\*[^/][\s\S]*?(?:\*\/|$)/,
                alias: 'comment'
            };

            grammar = languages.insertBefore(lang, 'comment', definition);
            token = grammar[tokenName];
        }

        if (token instanceof RegExp) { // convert regex to object
            token = grammar[tokenName] = { pattern: token };
        }

        if (Array.isArray(token)) {
            for (var i = 0, l = token.length; i < l; i++) {
                if (token[i] instanceof RegExp) {
                    token[i] = { pattern: token[i] };
                }
                callback(token[i]);
            }
        } else {
            callback(token);
        }
    }

    /**
     * Adds doc-comment support to the given languages for the given documentation language.
     *
     * @param {string[]|string} languages
     * @param {Object} docLanguage
     */
    function addSupport(languages: string | string[], docLanguage: object) {
        if (typeof languages === 'string') {
            languages = [languages];
        }

        languages.forEach((lang) => {
            docCommentSupport(lang, (pattern: any) => {
                if (!pattern.inside) {
                    pattern.inside = {};
                }
                pattern.inside.rest = docLanguage;
            });
        });
    }

    Object.defineProperty(javaDocLike, 'addSupport', { value: addSupport });

    javaDocLike.addSupport(['java', 'javascript', 'php'], javaDocLike);
}