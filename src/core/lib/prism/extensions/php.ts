/**
 * Language php
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import clike from "./clike";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.clike) clike(languages, hooks, util);

    languages.php = languages.extend('clike', {
        'keyword': /\b(?:__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|parent|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield)\b/i,
        'boolean': {
            pattern: /\b(?:false|true)\b/i,
            alias: 'constant'
        },
        'constant': [
            /\b[A-Z_][A-Z0-9_]*\b/,
            /\b(?:null)\b/i,
        ],
        'comment': {
            pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
            lookbehind: true
        }
    });

    languages.insertBefore('php', 'string', {
        'shell-comment': {
            pattern: /(^|[^\\])#.*/,
            lookbehind: true,
            alias: 'comment'
        }
    });

    languages.insertBefore('php', 'comment', {
        'delimiter': {
            pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
            alias: 'important'
        }
    });

    languages.insertBefore('php', 'keyword', {
        'variable': /\$+(?:\w+\b|(?={))/i,
        'package': {
            pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
            lookbehind: true,
            inside: {
                punctuation: /\\/
            }
        }
    });

    // Must be defined after the function pattern
    languages.insertBefore('php', 'operator', {
        'property': {
            pattern: /(->)[\w]+/,
            lookbehind: true
        }
    });

    var string_interpolation = {
        pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[.+?]|->\w+)*)/,
        lookbehind: true,
        inside: {
            rest: languages.php
        }
    };

    languages.insertBefore('php', 'string', {
        'nowdoc-string': {
            pattern: /<<<'([^']+)'(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;/,
            greedy: true,
            alias: 'string',
            inside: {
                'delimiter': {
                    pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
                    alias: 'symbol',
                    inside: {
                        'punctuation': /^<<<'?|[';]$/
                    }
                }
            }
        },
        'heredoc-string': {
            pattern: /<<<(?:"([^"]+)"(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;|([a-z_]\w*)(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\2;)/i,
            greedy: true,
            alias: 'string',
            inside: {
                'delimiter': {
                    pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
                    alias: 'symbol',
                    inside: {
                        'punctuation': /^<<<"?|[";]$/
                    }
                },
                'interpolation': string_interpolation // See below
            }
        },
        'single-quoted-string': {
            pattern: /'(?:\\[\s\S]|[^\\'])*'/,
            greedy: true,
            alias: 'string'
        },
        'double-quoted-string': {
            pattern: /"(?:\\[\s\S]|[^\\"])*"/,
            greedy: true,
            alias: 'string',
            inside: {
                'interpolation': string_interpolation // See below
            }
        }
    });
    // The different types of PHP strings "replace" the C-like standard string
    delete languages.php['string'];

    hooks.add('before-tokenize', (env) => {
        if (!/<\?/.test(env.code)) {
            return;
        }

        var phpPattern = /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#)(?:[^?\n\r]|\?(?!>))*|\/\*[\s\S]*?(?:\*\/|$))*?(?:\?>|$)/ig;
        languages['markup-templating'].buildPlaceholders(env, 'php', phpPattern);
    });

    hooks.add('after-tokenize', (env) => {
        languages['markup-templating'].tokenizePlaceholders(env, 'php');
    });

    languages.insertBefore('php', 'variable', {
        'this': /\$this\b/,
        'global': /\$(?:_(?:SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE)|GLOBALS|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)\b/,
        'scope': {
            pattern: /\b[\w\\]+::/,
            inside: {
                keyword: /static|self|parent/,
                punctuation: /::|\\/
            }
        }
    });
}