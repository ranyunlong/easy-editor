/**
 * Language hsts
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    /**
     * Original by Scott Helme.
     *
     * Reference: https://scotthelme.co.uk/hsts-cheat-sheet/
     */

    languages.hsts = {
        'directive': {
            pattern: /\b(?:max-age=|includeSubDomains|preload)/,
            alias: 'keyword'
        },
        'safe': {
            pattern: /\d{8,}/,
            alias: 'selector'
        },
        'unsafe': {
            pattern: /\d{1,7}/,
            alias: 'function'
        }
    };
}