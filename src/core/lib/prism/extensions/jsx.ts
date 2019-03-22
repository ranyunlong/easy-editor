/**
 * Language json5
 */
import { Token } from "../core/Token";
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import jsLang from './javascript';
import markup from './markup';
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.javascript) jsLang(languages, hooks, util);
    if (!languages.markup) markup(languages, hooks, util);
    var javascript = util.clone(languages.javascript);

    languages.jsx = languages.extend('markup', javascript);
    languages.jsx.tag.pattern = /<\/?(?:[\w.:-]+\s*(?:\s+(?:[\w.:-]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s{'">=]+|\{(?:\{(?:\{[^}]*\}|[^{}])*\}|[^{}])+\}))?|\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}))*\s*\/?)?>/i;

    languages.jsx.tag.inside['tag'].pattern = /^<\/?[^\s>\/]*/i;
    languages.jsx.tag.inside['attr-value'].pattern = /=(?!\{)(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">]+)/i;
    languages.jsx.tag.inside['tag'].inside['class-name'] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;

    languages.insertBefore('inside', 'attr-name', {
        'spread': {
            pattern: /\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}/,
            inside: {
                'punctuation': /\.{3}|[{}.]/,
                'attr-value': /\w+/
            }
        }
    }, languages.jsx.tag);

    languages.insertBefore('inside', 'attr-value', {
        'script': {
            // Allow for two levels of nesting
            pattern: /=(\{(?:\{(?:\{[^}]*\}|[^}])*\}|[^}])+\})/i,
            inside: {
                'script-punctuation': {
                    pattern: /^=(?={)/,
                    alias: 'punctuation'
                },
                rest: languages.jsx
            },
            'alias': 'language-javascript'
        }
    }, languages.jsx.tag);

    // The following will handle plain text inside tags
    var stringifyToken = (token: any) => {
        if (!token) {
            return '';
        }
        if (typeof token === 'string') {
            return token;
        }
        if (typeof token.content === 'string') {
            return token.content;
        }
        return token.content.map(stringifyToken).join('');
    };

    var walkTokens = (tokens: any) => {
        var openedTags = [];
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var notTagNorBrace = false;

            if (typeof token !== 'string') {
                if (token.type === 'tag' && token.content[0] && token.content[0].type === 'tag') {
                    // We found a tag, now find its kind

                    if (token.content[0].content[0].content === '</') {
                        // Closing tag
                        if (openedTags.length > 0 && openedTags[openedTags.length - 1].tagName === stringifyToken(token.content[0].content[1])) {
                            // Pop matching opening tag
                            openedTags.pop();
                        }
                    } else {
                        if (token.content[token.content.length - 1].content === '/>') {
                            // Autoclosed tag, ignore
                        } else {
                            // Opening tag
                            openedTags.push({
                                tagName: stringifyToken(token.content[0].content[1]),
                                openedBraces: 0
                            });
                        }
                    }
                } else if (openedTags.length > 0 && token.type === 'punctuation' && token.content === '{') {

                    // Here we might have entered a JSX context inside a tag
                    openedTags[openedTags.length - 1].openedBraces++;

                } else if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces > 0 && token.type === 'punctuation' && token.content === '}') {

                    // Here we might have left a JSX context inside a tag
                    openedTags[openedTags.length - 1].openedBraces--;

                } else {
                    notTagNorBrace = true;
                }
            }
            if (notTagNorBrace || typeof token === 'string') {
                if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces === 0) {
                    // Here we are inside a tag, and not inside a JSX context.
                    // That's plain text: drop any tokens matched.
                    var plainText = stringifyToken(token);

                    // And merge text with adjacent text
                    if (i < tokens.length - 1 && (typeof tokens[i + 1] === 'string' || tokens[i + 1].type === 'plain-text')) {
                        plainText += stringifyToken(tokens[i + 1]);
                        tokens.splice(i + 1, 1);
                    }
                    if (i > 0 && (typeof tokens[i - 1] === 'string' || tokens[i - 1].type === 'plain-text')) {
                        plainText = stringifyToken(tokens[i - 1]) + plainText;
                        tokens.splice(i - 1, 1);
                        i--;
                    }

                    tokens[i] = new Token('plain-text', plainText, null, plainText);
                }
            }

            if (token.content && typeof token.content !== 'string') {
                walkTokens(token.content);
            }
        }
    };

    hooks.add('after-tokenize', (env: any) => {
        if (env.language !== 'jsx' && env.language !== 'tsx') {
            return;
        }
        walkTokens(env.tokens);
    });
}