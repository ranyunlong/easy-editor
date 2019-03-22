/**
 * Language n4jsd n4js
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import javascript from "./javascript";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.javascript) javascript(languages, hooks, util);
    languages.n4js = languages.extend('javascript', {
        // Keywords from N4JS language spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html
        'keyword': /\b(?:any|Array|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|module|new|null|number|package|private|protected|public|return|set|static|string|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/
    });

    languages.insertBefore('n4js', 'constant', {
        // Annotations in N4JS spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html#_annotations
        'annotation': {
            pattern: /@+\w+/,
            alias: 'operator'
        }
    });

    languages.n4jsd = languages.n4js;
}