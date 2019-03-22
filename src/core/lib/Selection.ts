export class Selection {
    public startColumn: number = 0;
    public startLineNumber: number = 0;
    public endColumn: number = 0;
    public endLineNumber: number = 0;
    constructor(
        private selectionStart: number,
        private selectionEnd: number,
        private selectionDirection: string,
        private text: string
    ) {
        
    }

    /**
     * clone selection
     * 复制选区
     */
    public clone(): Selection {
        return new Selection(this.selectionStart, this.selectionEnd, this.selectionDirection, this.text);
    }

    /**
     * containsRange
     * 判断是否包含该选区
     */
    public containsRange(range: IRange): boolean {
        return (
            this.startColumn <= range.endColumn
            &&
            this.startLineNumber <= range.startLineNumber
            &&
            this.endColumn >= range.endColumn
            &&
            this.endLineNumber >= range.endLineNumber
        )
    }

    /**
     * equalsRange
     * 判断是否等于当前选区
     */
    public equalsRange(range: IRange): boolean {
        return (
            this.startColumn === range.startColumn
            &&
            this.startLineNumber === range.startLineNumber
            &&
            this.endColumn === range.endColumn
            &&
            this.endLineNumber === range.endLineNumber
        );
    }

    

    /**
     * equalsSelection
     * 判断是否等于选区
     */
    public equalsSelection(selection: Selection): boolean {
        return this.equalsRange(selection);
    }

    /**
     * getDirection
     * 获取选区方向
     */
    public getDirection() {
        return this.selectionDirection;
    }

    /**
     * plusRange
     * 添加选区范围
     * 将两个范围合并
     */
    public plusRange(range: IRange) {
        
    }

    /**
     * setEndPosition
     * 设置选区结束位置
     */
    public setEndPosition(endLineNumber: number, endColumn: number) {
        this.endColumn = endColumn;
        this.endLineNumber = endLineNumber;
    }

    /**
     * setStartPosition
     * 设置选区起始位置
     */
    public setStartPosition(startLineNumber: number, startColumn: number) {
        this.startColumn = startColumn;
        this.startLineNumber = startLineNumber;
    }

    /**
     * toString
     * 转换为字符串
     */
    public toString(): string {
        return JSON.stringify({
            startColumn: this.startColumn,
            startLineNumber: this.startLineNumber,
            endColumn: this.endColumn,
            endLineNumber: this.endLineNumber,
            selectionDirection: this.selectionDirection
        })
    }

    /**
     * 判断是否为空range
     * @param range 
     */
    public isEmpty(range: IRange): boolean {
        return range.startColumn === range.endColumn && range.startLineNumber === range.endLineNumber;
    }

    /**
     * isRange
     * 判断对象是否为range
     */
    public isRange(obj: any) {
        if (typeof obj === 'object') {
            return (
                typeof obj.startColumn === 'number'
                &&
                typeof obj.endColumn === 'number'
                &&
                typeof obj.startLineNumber === 'number'
                &&
                typeof obj.endLineNumber === 'number'
            )
        }
        return false;
    }

    /**
     * 判断对象是否为Selection
     * @param obj 
     */
    public isSelection(obj: any) {
       return obj instanceof Selection;
    }
}

export interface IRange {
    startColumn: number;
    startLineNumber: number;
    endColumn: number;
    endLineNumber: number;
}