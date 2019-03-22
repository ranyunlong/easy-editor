import { Prism } from './prism'
import { Token } from './prism/core/Token';

export class Tokenization {
    constructor() {}
    // prism
    private prism = new Prism();
    // 解析队列
    private list: string[] = [];

    private languageId: string | undefined = undefined;

    private tokenIsFinish: boolean = true;

    private tokenList(callback: (value: Array<string | Token>) => void) {
        this.tokenIsFinish = false;
        const value = this.list.pop()
        if (typeof callback !== 'function') return;
        if (value && this.languageId) {
            callback(this.prism.tokenize(value, this.prism.languages[this.languageId]))
            this.tokenList(callback);
        } else {
            this.tokenIsFinish = true;
        }
    }

    /**
     * tokenLines
     * @param value A code strings;
     * @param languageId A string language name;
     */
    public tokenLines(value: string, languageId: string) {
        this.languageId = languageId;
        this.list.push(value);
        // 设置队列长度
        if (this.list.length > 100) {
            this.list.shift();
        }
    }

    
}