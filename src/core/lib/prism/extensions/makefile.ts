/**
 * Language makefile
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {

    languages.makefile = {
        'comment': {
            pattern: /(^|[^\\])#(?:\\(?:\r\n|[\s\S])|[^\\\r\n])*/,
            lookbehind: true
        },
        'string': {
            pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
            greedy: true
        },

        // Built-in target names
        'builtin': /\.[A-Z][^:#=\s]+(?=\s*:(?!=))/,

        // Targets
        'symbol': {
            pattern: /^[^:=\r\n]+(?=\s*:(?!=))/m,
            inside: {
                'variable': /\$+(?:[^(){}:#=\s]+|(?=[({]))/
            }
        },
        'variable': /\$+(?:[^(){}:#=\s]+|\([@*%<^+?][DF]\)|(?=[({]))/,

        'keyword': [
            // Directives
            /-include\b|\b(?:define|else|endef|endif|export|ifn?def|ifn?eq|include|override|private|sinclude|undefine|unexport|vpath)\b/,
            // Functions
            {
                pattern: /(\()(?:addsuffix|abspath|and|basename|call|dir|error|eval|file|filter(?:-out)?|findstring|firstword|flavor|foreach|guile|if|info|join|lastword|load|notdir|or|origin|patsubst|realpath|shell|sort|strip|subst|suffix|value|warning|wildcard|word(?:s|list)?)(?=[ \t])/,
                lookbehind: true
            }
        ],
        'operator': /(?:::|[?:+!])?=|[|@]/,
        'punctuation': /[:;(){}]/
    };
}