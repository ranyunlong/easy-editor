/**
 * Language diff
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";

export default (languages: Languages, hooks: Hook, util: Util) => {
    languages.diff = {
        'coord': [
            // Match all kinds of coord lines (prefixed by "+++", "---" or "***").
            /^(?:\*{3}|-{3}|\+{3}).*$/m,
            // Match "@@ ... @@" coord lines in unified diff.
            /^@@.*@@$/m,
            // Match coord lines in normal diff (starts with a number).
            /^\d+.*$/m
        ],
    
        // Match inserted and deleted lines. Support both +/- and >/< styles.
        'deleted': /^[-<].*$/m,
        'inserted': /^[+>].*$/m,
    
        // Match "different" lines (prefixed with "!") in context diff.
        'diff': {
            'pattern': /^!(?!!).+$/m,
            'alias': 'important'
        }
    };    
}
