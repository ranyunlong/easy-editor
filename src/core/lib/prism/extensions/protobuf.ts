/**
 * Language protobuf
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import clike from "./clike";

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.clike) clike(languages, hooks, util);
    languages.protobuf = languages.extend('clike', {
        keyword: /\b(?:package|import|message|enum)\b/,
        builtin: /\b(?:required|repeated|optional|reserved)\b/,
        primitive: {
            pattern: /\b(?:double|float|int32|int64|uint32|uint64|sint32|sint64|fixed32|fixed64|sfixed32|sfixed64|bool|string|bytes)\b/,
            alias: 'symbol'
        }
    });
}