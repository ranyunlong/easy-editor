/**
 * Language xeora
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import markup from "./markup";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.markup) markup(languages, hooks, util);
    languages.xeora = languages.extend('markup', {
        'constant': {
            pattern: /\$(?:DomainContents|PageRenderDuration)\$/,
            inside: {
                'punctuation': {
                    pattern: /\$/
                }
            }
        },
        'variable': {
            pattern: /\$@?(?:#+|[-+*~=^])?[\w.]+\$/,
            inside: {
                'punctuation': {
                    pattern: /[$.]/
                },
                'operator': {
                    pattern: /#+|[-+*~=^@]/
                }
            }
        },
        'function-inline': {
            pattern: /\$F:[-\w.]+\?[-\w.]+(?:,(?:\|?(?:[-#.^+*~]*(?:[\w+][^$]*)|=(?:[\S+][^$]*)|@[-#]*(?:\w+.)[\w+.]+)?)*)?\$/,
            inside: {
                'variable': {
                    pattern: /(?:[,|])@?(?:#+|[-+*~=^])?[\w.]+/,
                    inside: {
                        'punctuation': {
                            pattern: /[,.|]/
                        },
                        'operator': {
                            pattern: /#+|[-+*~=^@]/
                        }
                    }
                },
                'punctuation': {
                    pattern: /\$\w:|[$:?.,|]/
                }
            },
            alias: 'function'
        },
        'function-block': {
            pattern: /\$XF:{[-\w.]+\?[-\w.]+(?:,(?:\|?(?:[-#.^+*~]*(?:[\w+][^$]*)|=(?:[\S+][^$]*)|@[-#]*(?:\w+.)[\w+.]+)?)*)?}:XF\$/,
            inside: {
                'punctuation': {
                    pattern: /[$:{}?.,|]/
                }
            },
            alias: 'function'
        },
        'directive-inline': {
            pattern: /\$\w(?:#\d+\+?)?(?:\[[-\w.]+])?:[-\/\w.]+\$/,
            inside: {
                'punctuation': {
                    pattern: /\$(?:\w:|C(?:\[|#\d))?|[:{[\]]/,
                    inside: {
                        'tag': {
                            pattern: /#\d/
                        }
                    }
                }
            },
            alias: 'function'
        },
        'directive-block-open': {
            pattern: /\$\w+:{|\$\w(?:#\d+\+?)?(?:\[[-\w.]+])?:[-\w.]+:{(![A-Z]+)?/,
            inside: {
                'punctuation': {
                    pattern: /\$(?:\w:|C(?:\[|#\d))?|[:{[\]]/,
                    inside: {
                        'tag': {
                            pattern: /#\d/
                        }
                    }
                },
                'attribute': {
                    pattern: /![A-Z]+$/,
                    inside: {
                        'punctuation': {
                            pattern: /!/
                        }
                    },
                    alias: 'keyword'
                }
            },
            alias: 'function'
        },
        'directive-block-separator': {
            pattern: /}:[-\w.]+:{/,
            inside: {
                'punctuation': {
                    pattern: /[:{}]/
                }
            },
            alias: 'function'
        },
        'directive-block-close': {
            pattern: /}:[-\w.]+\$/,
            inside: {
                'punctuation': {
                    pattern: /[:{}$]/
                }
            },
            alias: 'function'
        }
    });

    languages.insertBefore('inside', 'punctuation', {
        'variable': languages.xeora['function-inline'].inside['variable']
    }, languages.xeora["function-block"]);

    languages.xeoracube = languages.xeora;
}