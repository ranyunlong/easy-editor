/**
 * Language django
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.django = {
        'comment': /^{#[\s\S]*?#}$/,
        'tag': {
            pattern: /(^{%[+-]?\s*)\w+/,
            lookbehind: true,
            alias: 'keyword'
        },
        'delimiter': {
            pattern: /^{[{%][+-]?|[+-]?[}%]}$/,
            alias: 'punctuation'
        },
        'string': {
            pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
            greedy: true
        },
        'filter': {
            pattern: /(\|)\w+/,
            lookbehind: true,
            alias: 'function'
        },
        'test': {
            pattern: /(\bis\s+(?:not\s+)?)(?!not\b)\w+/,
            lookbehind: true,
            alias: 'function'
        },
        'function': /\b[a-z_]\w+(?=\s*\()/i,
        'keyword': /\b(?:and|as|by|else|for|if|import|in|is|loop|not|or|recursive|with|without)\b/,
        'operator': /[-+*/%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
        'number': /\b\d+(?:\.\d+)?\b/,
        'boolean': /[Tt]rue|[Ff]alse|[Nn]one/,
        'variable': /\b\w+?\b/,
        'punctuation': /[{}[\](),.:;]/
    };
    
    var pattern = /{{[\s\S]*?}}|{%[\s\S]*?%}|{#[\s\S]*?#}/g;
    var markupTemplating = languages['markup-templating'];
    
    hooks.add('before-tokenize', (env) => {
        markupTemplating.buildPlaceholders(env, 'django', pattern);
    });
    hooks.add('after-tokenize', (env) => {
        markupTemplating.tokenizePlaceholders(env, 'django');
    });
    
    // Add an Jinja2 alias
    languages.jinja2 = languages.django;
    hooks.add('before-tokenize', (env) => {
        markupTemplating.buildPlaceholders(env, 'jinja2', pattern);
    });
    hooks.add('after-tokenize', (env) => {
        markupTemplating.tokenizePlaceholders(env, 'jinja2');
    });    
}
