/**
 * Language aspnet
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import markup from "./markup";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.markup) markup(languages, hooks, util);
    languages.aspnet = languages.extend('markup', {
        'page-directive tag': {
            pattern: /<%\s*@.*%>/i,
            inside: {
                'page-directive tag': /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
                rest: languages.markup.tag.inside
            }
        },
        'directive tag': {
            pattern: /<%.*%>/i,
            inside: {
                'directive tag': /<%\s*?[$=%#:]{0,2}|%>/i,
                rest: languages.csharp
            }
        }
    });
    // Regexp copied from prism-markup, with a negative look-ahead added
    languages.aspnet.tag.pattern = /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i;
    
    // match directives of attribute value foo="<% Bar %>"
    languages.insertBefore('inside', 'punctuation', {
        'directive tag': languages.aspnet['directive tag']
    }, languages.aspnet.tag.inside["attr-value"]);
    
    languages.insertBefore('aspnet', 'comment', {
        'asp comment': /<%--[\s\S]*?--%>/
    });
    
    // script runat="server" contains csharp, not javascript
    languages.insertBefore('aspnet', languages.javascript ? 'script' : 'tag', {
        'asp script': {
            pattern: /(<script(?=.*runat=['"]?server['"]?)[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
            lookbehind: true,
            inside: languages.csharp || {}
        }
    });
}
