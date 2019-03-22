/**
 * Language ejs
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.ejs = {
        'delimiter': {
            pattern: /^<%[-_=]?|[-_]?%>$/,
            alias: 'punctuation'
        },
        'comment': /^#[\s\S]*/,
        'language-javascript': {
            pattern: /[\s\S]+/,
            inside: languages.javascript
        }
    };
    
    hooks.add('before-tokenize', (env) => {
        var ejsPattern = /<%(?!%)[\s\S]+?%>/g;
        languages['markup-templating'].buildPlaceholders(env, 'ejs', ejsPattern);
    });
    
    hooks.add('after-tokenize', (env) => {
        languages['markup-templating'].tokenizePlaceholders(env, 'ejs');
    });
}
