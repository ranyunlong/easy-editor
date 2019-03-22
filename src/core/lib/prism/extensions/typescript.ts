/**
 * Language typescript
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import javascript from "./javascript";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (languages.javascript) javascript(languages, hooks, util);
    languages.typescript = languages.extend('javascript', {
        // From JavaScript Prism keyword list and TypeScript language spec: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#221-reserved-words
        'keyword': /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,
        'builtin': /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/,
    });

    languages.ts = languages.typescript;
}