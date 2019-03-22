import { Hook, Environment } from "./Hook";
import { Token } from "./Token";
import { Util } from "./Util";
import { Languages } from "./Languages";
import extensions from '../extensions'
import themes from '../themes'

export const hooks = new Hook();
export const util = new Util();
export const lang = /\blang(?:uage)?-([\w-]+)\b/i;
export const languages = new Languages();
export let uniqueId = 0;


export class Prism {

    public hooks: Hook;
    public util: Util;
    public languages: Languages = languages;
    public Token = Token;
    public plugins = {};
    public Worker!: Worker;
    public filename!: string;
    public themes: { [key: string]: Theme } = themes;
    constructor() {
        this.hooks = hooks;
        this.util = util;
        this.loadLanguages();
        this.loadTheme('default')
    }

    public loadTheme(themeId: string) {
        const theme = this.themes[themeId];
        const id = 'code-theme';
        if (theme) {
            let ele = document.getElementById(id)
            if (!ele) {
                ele = document.createElement('style');
                ele.id = id
            }
            const str = theme.tokenColors.map((key) => {
                const value: any = {}
                if (key.background) {
                    value.background = key.background;
                }
                if (key.cursor) {
                    value.cursor = key.cursor;
                }
                if (key.fontWeight) {
                    value['font-weight'] = key.fontWeight;
                }
                if (key.fontstyle) {
                    value['font-style'] = key.fontstyle;
                }
                if (key.foreground) {
                    value.color = key.foreground;
                }
                return `${key.tokens.map((k) => `.token.${k}`).join(',\n')} ${JSON.stringify(value, null, 4).replace(/\"/g, '')}`
            }).join('\n\n');

            ele.innerHTML = str;
            document.head.appendChild(ele);
        }
    }

    /**
     * Used to highlight all elements on current website. Calls Prism.highlightAllUnder on `document`.
     *
     * @see highlightAllUnder
     * @param async Whether to use Web Workers to improve performance and avoid blocking the UI when highlighting
     * very large chunks of code. False by default.
     * @param callback An optional callback to be invoked after the highlighting is done. Mostly useful when async
     * is true, since in that case, the highlighting is done asynchronously.
     */
    public highlightAll(async?: boolean, callback?: (element: Element) => void): void {
        this.highlightAllUnder(document, async, callback);
    }

    /**
     * This is the most high-level function in Prism’s API. It fetches all the elements inside `container` that
     * have a .language-xxxx class and then calls Prism.highlightElement() on each one of them.
     *
     * @param container The element which contains elements containing code.
     * @param async Whether to use Web Workers to improve performance and avoid blocking the UI when highlighting
     * very large chunks of code. False by default.
     * @param callback An optional callback to be invoked after the highlighting is done. Mostly useful when async
     * is true, since in that case, the highlighting is done asynchronously.
     */
    public highlightAllUnder(
        container: Element | Document,
        async?: boolean,
        callback?: (element: Element) => void
    ): void {
        var env = {
            callback,
            selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };

        hooks.run("before-highlightall", env as any);

        var elements = (env as any).elements || container.querySelectorAll(env.selector);

        for (var i = 0, element; element = elements[i++];) {
            this.highlightElement(element, async === true, (env as any).callback);
        }
    }

    /**
     * Highlights the code inside a single element.
     *
     * @param element The element containing the code. It must have a class of language-xxxx to be processed,
     * where xxxx is a valid language identifier.
     * @param async Whether to use Web Workers to improve performance and avoid blocking the UI when
     * highlighting very large chunks of code. False by default.
     * @param callback An optional callback to be invoked after the highlighting is done.
     * Mostly useful when async is true, since in that case, the highlighting is done asynchronously.
     */
    public highlightElement(element: Element, async?: boolean, callback?: (element?: Element) => void): void {
        // Find language
        var language, grammar, parent = element;

        while (parent && !lang.test(parent.className)) {
            parent = parent.parentNode as Element;
        }

        if (parent) {
            language = (parent.className.match(lang) as string[] || [, ""])[1].toLowerCase();
            grammar = languages[language];
        }

        // Set language on the element, if not present
        element.className = element.className.replace(lang, "").replace(/\s+/g, " ") + "  language-" + language;

        if (element.parentNode) {
            // Set language on the parent, for styling
            parent = element.parentNode as Element;

            if (/pre/i.test(parent.nodeName)) {
                parent.className = parent.className.replace(lang, " ").replace(/\s+/g, " ") + " language-" + language;
            }
        }

        var code = element.textContent;

        var env: any = {
            element,
            language,
            grammar,
            code
        };

        var insertHighlightedCode = (highlightedCode: any) => {
            env.highlightedCode = highlightedCode;

            hooks.run("before-insert", env);

            env.element.innerHTML = env.highlightedCode;

            hooks.run("after-highlight", env);
            hooks.run("complete", env);
            callback && callback.call(env.element);
        };

        hooks.run("before-sanity-check", env);

        if (!env.code) {
            hooks.run("complete", env);
            return;
        }

        hooks.run("before-highlight", env);

        if (!env.grammar) {
            insertHighlightedCode(util.encode(env.code));
            return;
        }

        if (async && this.Worker) {
            var worker = new Worker(this.filename);

            worker.onmessage = (evt) => {
                insertHighlightedCode(evt.data);
            };

            worker.postMessage(JSON.stringify({
                language: env.language,
                code: env.code,
                immediateClose: true
            }));
        } else {
            insertHighlightedCode(this.highlight(env.code, env.grammar, env.language));
        }
    }

    /**
     * Low-level function, only use if you know what you’re doing. It accepts a string of text as input and the language
     * definitions to use, and returns a string with the HTML produced.
     *
     * @param text A string with the code to be highlighted.
     * @param grammar - An object containing the tokens to use. Usually a language definition like
     * Prism.languages.markup
     * @returns The highlighted HTML
     */
    public highlight(code: string, grammar: Grammar, language?: Grammar): string {
        var env: Environment = {
            code,
            grammar,
            language
        };
        hooks.run("before-tokenize", env);
        env.tokens = this.tokenize(env.code as string, grammar);
        hooks.run("after-tokenize", env);
        return Token.stringify(util.encode(env.tokens as any), env.language as any);
    }

    /**
     * This is the heart of Prism, and the most low-level function you can use.
     * It accepts a string of text as input and the
     * language definitions to use, and returns an array with the tokenized code. When the language definition includes
     * nested tokens, the function is called recursively on each of these tokens. This method could be useful in other
     * contexts as well, as a very crude parser.
     *
     * @param text A string with the code to be highlighted.
     * @param grammar An object containing the tokens to use. Usually a language definition like
     * Prism.languages.markup
     * @returns An array of strings, tokens (class Prism.Token) and other arrays.
     */
    public tokenize(text: string, grammar: Grammar): Array<Token | string> {
        var strarr = [text];

        var rest = grammar.rest;

        if (rest) {
            for (var token in rest) {
                grammar[token as keyof Grammar] = rest[token];
            }

            delete grammar.rest;
        }

        this.matchGrammar(text, strarr, grammar, 0, 0, false);

        return strarr;
    }

    public matchGrammar(
        text: string,
        strarr: string[],
        grammar: Grammar,
        index: number,
        startPos: number,
        oneshot: any,
        target?: any
    ) {
        for (var t in grammar) {
            const token = t as keyof Grammar;
            if (!grammar.hasOwnProperty(token) || !grammar[token]) {
                continue;
            }

            if (token === target) {
                return;
            }

            let patterns: any = grammar[token];
            patterns = (util.type(patterns) === "Array") ? patterns : [patterns];

            for (var j = 0; j < patterns.length; ++j) {
                var pattern = patterns[j],
                    inside = pattern.inside,
                    lookbehind = !!pattern.lookbehind,
                    greedy = !!pattern.greedy,
                    lookbehindLength = 0,
                    alias = pattern.alias;

                if (greedy && !pattern.pattern.global) {
                    // Without the global flag, lastIndex won't work
                    var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
                    pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
                }

                pattern = pattern.pattern || pattern;

                // Don’t cache length as it changes during the loop

                for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

                    var str: any = strarr[i];

                    if (strarr.length > text.length) {
                        // Something went terribly wrong, ABORT, ABORT!
                        return;
                    }

                    if (str instanceof Token) {
                        continue;
                    }

                    if (greedy && i !== strarr.length - 1) {
                        pattern.lastIndex = pos;
                        var match = pattern.exec(text);
                        if (!match) {
                            break;
                        }

                        var from = match.index + (lookbehind ? match[1].length : 0),
                            to = match.index + match[0].length,
                            k = i,
                            p = pos;

                        for (
                            var len = strarr.length;
                            k < len && (p < to || (!(strarr[k] as any).type && !(strarr[k - 1] as any).greedy));
                            ++k
                        ) {
                            p += strarr[k].length;
                            // Move the index i to the element in strarr that is closest to from
                            if (from >= p) {
                                ++i;
                                pos = p;
                            }
                        }

                        // If strarr[i] is a Token, then the match starts inside another Token, which is invalid
                        if ((strarr[i] as any) instanceof Token) {
                            continue;
                        }

                        // Number of tokens to delete and replace with the new match
                        delNum = k - i;
                        str = text.slice(pos, p);
                        match.index -= pos;
                    } else {
                        pattern.lastIndex = 0;

                        var match = pattern.exec(str),
                            delNum = 1;
                    }

                    if (!match) {
                        if (oneshot) {
                            break;
                        }

                        continue;
                    }

                    if (lookbehind) {
                        lookbehindLength = match[1] ? match[1].length : 0;
                    }

                    var from = match.index + lookbehindLength,
                        match = match[0].slice(lookbehindLength),
                        to = from + match.length,
                        before = str.slice(0, from),
                        after = str.slice(to);

                    var args = [i, delNum];

                    if (before) {
                        ++i;
                        pos += before.length;
                        args.push(before);
                    }

                    var wrapped = new Token(token as string, inside ? this.tokenize(match, inside) : match, alias, match, greedy);

                    args.push(wrapped as any);

                    if (after) {
                        args.push(after);
                    }

                    Array.prototype.splice.apply(strarr, args as any);

                    if (delNum !== 1)
                        this.matchGrammar(text, strarr, grammar, i, pos, true, token);

                    if (oneshot)
                        break;
                }
            }
        }
    }

    /**
     * loadLanguages
     * load definition languages
     */
    public loadLanguages() {
        for (const key in extensions) {
            extensions[key](languages, hooks, util);
        }
    }

    /**
     * addLanguage
     * @param languageId A string language name
     * @param grammer An object containing the tokens to use. Usually a language definition like
     * Prism.languages.markup
     * @param extend Extend a language definition
     */
    public addLanguage(languageId: string, grammer: Grammar, extend?: string): Grammar {
        if (languages[languageId]) return grammer;
        if (extend) {
            return languages[languageId] = languages.extend(extend, grammer); 
        }
        return languages[languageId] = grammer;
    }
}

export default Prism;

export interface Grammar {
    keyword?: RegExp | Grammar;
    number?: RegExp | Grammar;
    function?: RegExp | Grammar;
    string?: RegExp | Grammar;
    boolean?: RegExp | Grammar;
    operator?: RegExp | Grammar;
    punctuation?: RegExp | Grammar;
    atrule?: RegExp | Grammar;
    url?: RegExp | Grammar;
    selector?: RegExp | Grammar;
    property?: RegExp | Grammar;
    important?: RegExp | Grammar;
    style?: RegExp | Grammar;

    /**
     * This option can be used to define one or more aliases for the matched token. The result will be, that the styles
     * of the token and its aliases are combined. This can be useful, to combine the styling of a well known token,
     * which is already supported by most of the themes, with a semantically correct token name. The option can be
     * set to a string literal or an array of string literals. In the following example the token name latex-equation
     * is not supported by any theme, but it will be highlighted the same as a string.
     */
    alias?: string;

    pattern?: RegExp;

    /**
     * This option mitigates JavaScript’s lack of lookbehind. When set to true, the first capturing group in the regex
     * pattern is discarded when matching this token, so it effectively behaves as if it was lookbehind
     */
    lookbehind?: boolean;

    /**
     * This property accepts another object literal, with tokens that are allowed to be nested in this token.
     * This makes it easier to define certain languages. However, keep in mind that they’re slower and if coded poorly,
     * can even result in infinite recursion. For an example of nested tokens, check out the Markup language definition
     */
    inside?: Grammar;

    /**
     * Accepts an object literal with tokens and appends them to the end of the current object literal.
     */
    rest?: Token[];
    [key: string]: any;
}

export interface Theme {
    tokenColors: Array<{
        tokens: string[];
        foreground?: string;
        background?: string;
        fontstyle?: string;
        cursor?: string;
        fontWeight?: string;
    }>;
}