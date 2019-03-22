/**
 * Language tsx
 */
import { Languages } from "../core/Languages";
import { Hook } from "../core/Hook";
import { Util } from "../core/Util";
import jsx from "./jsx";
import typescriptL from './typescript';

export default (languages: Languages, hooks: Hook, util: Util) => {
    if (!languages.typescript) typescriptL(languages, hooks, util);
    if (!languages.jsx) jsx(languages, hooks, util);
    var typescript = util.clone(languages.typescript);
    languages.tsx = languages.extend('jsx', typescript);
}