/**
 * Language tap
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.tap = {
        fail: /not ok[^#{\n\r]*/,
        pass: /ok[^#{\n\r]*/,
        pragma: /pragma [+-][a-z]+/,
        bailout: /bail out!.*/i,
        version: /TAP version \d+/i,
        plan: /\d+\.\.\d+(?: +#.*)?/,
        subtest: {
            pattern: /# Subtest(?:: .*)?/,
            greedy: true
        },
        punctuation: /[{}]/,
        directive: /#.*/,
        yamlish: {
            pattern: /(^[^\S\r\n]*)---(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?[^\S\r\n]*\.\.\.$/m,
            lookbehind: true,
            inside: languages.yaml,
            alias: 'language-yaml'
        }
    };
}