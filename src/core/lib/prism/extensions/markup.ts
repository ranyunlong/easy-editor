/**
 * Language markup xml html mathml svg
 */

import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import { Token } from "../core/Token";
import Prism from "../core";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.markup = {
        'comment': /<!--[\s\S]*?-->/,
        'prolog': /<\?[\s\S]+?\?>/,
        'doctype': /<!DOCTYPE[\s\S]+?>/i,
        'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
        'tag': {
            pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
            greedy: true,
            inside: {
                'tag': {
                    pattern: /^<\/?[^\s>\/]+/i,
                    inside: {
                        'punctuation': /^<\/?/,
                        'namespace': /^[^\s>\/:]+:/
                    }
                },
                'attr-value': {
                    pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
                    inside: {
                        'punctuation': [
                            /^=/,
                            {
                                pattern: /^(\s*)["']|["']$/,
                                lookbehind: true
                            }
                        ]
                    }
                },
                'punctuation': /\/?>/,
                'attr-name': {
                    pattern: /[^\s>\/]+/,
                    inside: {
                        'namespace': /^[^\s>\/:]+:/
                    }
                }

            }
        },
        'entity': /&#?[\da-z]{1,8};/i
    };

    languages.markup['tag'].inside['attr-value'].inside['entity'] =
        languages.markup['entity'];

    // Plugin to make entity title show the real entity, idea by Roman Komarov
    hooks.add('wrap', (env: any) => {

        if (env.type === 'entity') {
            env.attributes['title'] = env.content.replace(/&amp;/, '&');
        }
    });

    Object.defineProperty(languages.markup.tag, 'addInlined', {
        /**
         * Adds an inlined language to markup.
         *
         * An example of an inlined language is CSS with `<style>` tags.
         *
         * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
         * case insensitive.
         * @param {string} lang The language key.
         * @example
         * addInlined('style', 'css');
         */
        value: function addInlined(tagName: string, lang: string) {
            var includedCdataInside: any = {};
            includedCdataInside['language-' + lang] = {
                pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
                lookbehind: true,
                inside: languages[lang]
            };
            includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

            var inside: any = {
                'included-cdata': {
                    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                    inside: includedCdataInside
                }
            };
            inside['language-' + lang] = {
                pattern: /[\s\S]+/,
                inside: languages[lang]
            };

            var def: any = {};
            def[tagName] = {
                pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(/__/g, tagName), 'i'),
                lookbehind: true,
                greedy: true,
                inside
            };

            languages.insertBefore('markup', 'cdata', def);
        }
    });

    languages.xml = languages.extend('markup', {});
    languages.html = languages.markup;
    languages.mathml = languages.markup;
    languages.svg = languages.markup;
    /**
     * Returns the placeholder for the given language id and index.
     *
     * @param {string} language
     * @param {string|number} index
     * @returns {string}
     */
    function getPlaceholder(language: string, index: string | number) {
        return '___' + language.toUpperCase() + index + '___';
    }

    Object.defineProperties(languages['markup-templating'] = {}, {
        buildPlaceholders: {
            /**
             * Tokenize all inline templating expressions matching `placeholderPattern`.
             *
             * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns
             * `true` will be replaced.
             *
             * @param {object} env The environment of the `before-tokenize` hook.
             * @param {string} language The language id.
             * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
             * @param {(match: string) => boolean} [replaceFilter]
             */
            value: (env: any, language: string, placeholderPattern: RegExp, replaceFilter: (match: string) => boolean) => {
                if (env.language !== language) {
                    return;
                }

                var tokenStack: any[] = env.tokenStack = [];

                env.code = env.code.replace(placeholderPattern, (match: any) => {
                    if (typeof replaceFilter === 'function' && !replaceFilter(match)) {
                        return match;
                    }
                    var i = tokenStack.length;
                    var placeholder;

                    // Check for existing strings
                    while (env.code.indexOf(placeholder = getPlaceholder(language, i)) !== -1)
                        ++i;

                    // Create a sparse array
                    tokenStack[i] = match;

                    return placeholder;
                });

                // Switch the grammar to markup
                env.grammar = languages.markup;
            }
        },
        tokenizePlaceholders: {
            /**
             * Replace placeholders with proper tokens after tokenizing.
             *
             * @param {object} env The environment of the `after-tokenize` hook.
             * @param {string} language The language id.
             */
            value: (env: any, language: string) => {
                if (env.language !== language || !env.tokenStack) {
                    return;
                }

                // Switch the grammar back
                env.grammar = languages[language];

                var j = 0;
                var keys = Object.keys(env.tokenStack);

                function walkTokens(tokens: any) {
                    for (var i = 0; i < tokens.length; i++) {
                        // all placeholders are replaced already
                        if (j >= keys.length) {
                            break;
                        }

                        var token = tokens[i];
                        if (typeof token === 'string' || (token.content && typeof token.content === 'string')) {
                            var k = keys[j];
                            var t = env.tokenStack[k];
                            var s = typeof token === 'string' ? token : token.content;
                            var placeholder = getPlaceholder(language, k);

                            var index = s.indexOf(placeholder);
                            if (index > -1) {
                                ++j;

                                var before = s.substring(0, index);
                                var middle = new Token(language, new Prism().tokenize(t, env.grammar), 'language-' + language, t);
                                var after = s.substring(index + placeholder.length);

                                var replacement: any[] = [];
                                if (before) {
                                    replacement.push.apply(replacement, walkTokens([before]));
                                }
                                replacement.push(middle);
                                if (after) {
                                    replacement.push.apply(replacement, walkTokens([after]));
                                }

                                if (typeof token === 'string') {
                                    tokens.splice.apply(tokens, [i, 1].concat(replacement));
                                } else {
                                    token.content = replacement;
                                }
                            }
                        } else if (token.content /* && typeof token.content !== 'string' */) {
                            walkTokens(token.content);
                        }
                    }

                    return tokens;
                }

                walkTokens(env.tokens);
            }
        }
    });

}