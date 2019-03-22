/**
 * Language erb
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.erb = languages.extend('ruby', {});
    languages.insertBefore('erb', 'comment', {
        'delimiter': {
            pattern: /^<%=?|%>$/,
            alias: 'punctuation'
        }
    });

    hooks.add('before-tokenize', (env) => {
        var erbPattern = /<%=?(?:[^\r\n]|[\r\n](?!=begin)|[\r\n]=begin\s[\s\S]*?^=end)+?%>/gm;
        languages['markup-templating'].buildPlaceholders(env, 'erb', erbPattern);
    });

    hooks.add('after-tokenize', (env) => {
        languages['markup-templating'].tokenizePlaceholders(env, 'erb');
    });

}