import { Grammar, hooks } from ".";
import { Environment } from "./Hook";

export class Token {
    public length: number;
    constructor(
        /**
         * The type of the token
         */
        public type: string,
         /**
          * The content of the token
          */
        public content: TokenNode,
        /**
         * Aliases for the current token (added as classes to this token's HTML)
         */
        public alias: string | null,
        /**
         * The matched string that generated this token
         */
        matchedStr?: string,
        /**
         * Value that determines whether or not this token was generated using a greedy parsing algorithm
         */
        public greedy?: boolean,
    ) {
        // Copy of the full string this token was created from
        this.length = (matchedStr || "").length|0;
        this.greedy = !!greedy;
    }

    public static stringify(token: TokenNode, language: Grammar, parent?: HTMLPreElement): string {
        if (typeof token == 'string') {
            return token;
        }
    
        if (Array.isArray(token)) {
            return token.map(function(element) {
                return Token.stringify(element, language, token as any);
            }).join('');
        }
    
        var env: any = {
            type: token.type,
            content: Token.stringify(token.content, language, parent),
            tag: 'span',
            classes: ['token', token.type],
            attributes: {},
            language: language,
            parent: parent
        };
    
        if (token.alias) {
            var aliases = Array.isArray(token.alias) ? token.alias : [token.alias];
            Array.prototype.push.apply(env.classes, aliases);
        }
    
        hooks.run('wrap', env);
    
        var attributes = Object.keys(env.attributes).map(function(name) {
            return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
        }).join(' ');
    
        return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
    }
}

export type TokenNode = Token | string | Array<Token | string>;
