/**
 * Language t4s
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    function createBlock(prefix: any, inside: any, contentAlias?: any) {
        return {
            pattern: RegExp('<#' + prefix + '[\\s\\S]*?#>'),
            alias: 'block',
            inside: {
                'delimiter': {
                    pattern: RegExp('^<#' + prefix + '|#>$'),
                    alias: 'important'
                },
                'content': {
                    pattern: /[\s\S]+/,
                    inside,
                    alias: contentAlias
                }
            }
        };
    }
    
    function createT4(insideLang: any) {
        var grammar = languages[insideLang];
        var className = 'language-' + insideLang;
    
        return {
            'block': {
                pattern: /<#[\s\S]+?#>/,
                inside: {
                    'directive': createBlock('@', {
                        'attr-value': {
                            pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/,
                            inside: {
                                'punctuation': /^=|^["']|["']$/
                            }
                        },
                        'keyword': /\w+(?=\s)/,
                        'attr-name': /\w+/
                    }),
                    'expression': createBlock('=', grammar, className),
                    'class-feature': createBlock('\\+', grammar, className),
                    'standard': createBlock('', grammar, className)
                }
            }
        };
    }
    
    languages['t4-templating'] = Object.defineProperty({}, 'createT4', { value: createT4 });
    
    languages.t4 = languages['t4-cs'] = languages['t4-templating'].createT4('csharp');
    languages['t4-vb'] = languages['t4-templating'].createT4('visual-basic');
}