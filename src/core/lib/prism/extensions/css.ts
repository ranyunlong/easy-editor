/**
 * Language latex
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;

    languages.css = {
        'comment': /\/\*[\s\S]*?\*\//,
        'atrule': {
            pattern: /@[\w-]+?[\s\S]*?(?:;|(?=\s*\{))/i,
            inside: {
                'rule': /@[\w-]+/
                // See rest below
            }
        },
        'url': RegExp('url\\((?:' + string.source + '|.*?)\\)', 'i'),
        'selector': RegExp('[^{}\\s](?:[^{};"\']|' + string.source + ')*?(?=\\s*\\{)'),
        'string': {
            pattern: string,
            greedy: true
        },
        'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
        'important': /!important\b/i,
        'function': /[-a-z0-9]+(?=\()/i,
        'punctuation': /[(){};:,]/
    };

    languages.css['atrule'].inside.rest = languages.css;


    var markup = languages.markup;
    if (markup) {
        markup.tag.addInlined('style', 'css');

        languages.insertBefore('inside', 'attr-value', {
            'style-attr': {
                pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
                inside: {
                    'attr-name': {
                        pattern: /^\s*style/i,
                        inside: markup.tag.inside
                    },
                    'punctuation': /^\s*=\s*['"]|['"]\s*$/,
                    'attr-value': {
                        pattern: /.+/i,
                        inside: languages.css
                    }
                },
                alias: 'language-css'
            }
        }, markup.tag);
    }

    languages.css.selector = {
        pattern: languages.css.selector,
        inside: {
            'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
            'pseudo-class': /:[-\w]+/,
            'class': /\.[-:.\w]+/,
            'id': /#[-:.\w]+/,
            'attribute': {
                pattern: /\[(?:[^[\]"']|("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1)*\]/,
                greedy: true,
                inside: {
                    'punctuation': /^\[|\]$/,
                    'case-sensitivity': {
                        pattern: /(\s)[si]$/i,
                        lookbehind: true,
                        alias: 'keyword'
                    },
                    'namespace': {
                        pattern: /^(\s*)[-*\w\xA0-\uFFFF]*\|(?!=)/,
                        lookbehind: true,
                        inside: {
                            'punctuation': /\|$/
                        }
                    },
                    'attribute': {
                        pattern: /^(\s*)[-\w\xA0-\uFFFF]+/,
                        lookbehind: true
                    },
                    'value': [
                        /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
                        {
                            pattern: /(=\s*)[-\w\xA0-\uFFFF]+(?=\s*$)/,
                            lookbehind: true
                        }
                    ],
                    'operator': /[|~*^$]?=/
                }
            },
            'n-th': {
                pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
                lookbehind: true,
                inside: {
                    'number': /[\dn]+/,
                    'operator': /[+-]/
                }
            },
            'punctuation': /[()]/
        }
    };

    languages.insertBefore('css', 'property', {
        'variable': {
            pattern: /(^|[^-\w\xA0-\uFFFF])--[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*/i,
            lookbehind: true
        }
    });

    languages.insertBefore('css', 'function', {
        'operator': {
            pattern: /(\s)[+\-*\/](?=\s)/,
            lookbehind: true
        },
        'hexcode': /#[\da-f]{3,8}/i,
        'entity': /\\[\da-f]{1,8}/i,
        'unit': {
            pattern: /(\d)(?:%|[a-z]+)/,
            lookbehind: true
        },
        'number': /-?[\d.]+/
    });
}

