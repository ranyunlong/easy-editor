import { Grammar } from ".";
import { Token } from "./Token";

export class Hook {
    public all: Hooks = {};
    public add(name: AvailableHooks | string, callback: HookCallback) {
        const hooks = this.all;
        hooks[name] = hooks[name] || [];
        hooks[name].push(callback);
    }
    public run(name: AvailableHooks | string, env: Environment) {
        const callbacks = this.all[name];
        if (!callbacks || !callbacks.length) return;
        callbacks.forEach((callback) => {
            callback(env);
        });
    }
}

export interface Hooks {
    [name: string]: HookCallback[];
}

export type HookCallback = (env: Environment) => void;

export type AvailableHooks
    = "before-highlightall"
    | "before-sanity-check"
    | "before-highlight"
    | "before-insert"
    | "after-highlight"
    | "complete"
    | "wrap";

export interface Environment {
    element?: Element;
    language?: Grammar;
    grammar?: any;
    code?: any;
    highlightedCode?: any;
    type?: string;
    content?: string | any;
    tag?: string;
    classes?: string[];
    attributes?: any;
    parent?: Element;
    tokens?: Array<Token | string>;
}