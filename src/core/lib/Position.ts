export class Position {
    constructor(
        public lineNumber: number,
        public column: number
    ) {}

    /**
     * clone
     * 复制定位
     */
    public clone(): Position {
        return new Position(this.lineNumber, this.column);
    }

    /**
     * toString
     * 转换为字符串
     */
    public toString(): string {
        return JSON.stringify({
            lineNumber: this.lineNumber,
            column: this.column
        })
    }

    /**
     * 判断当前位置是否等于position
     */
    public equals(position: Position): boolean;
    /**
     * 判断位置positionA 是否等于positionB
     */
    public equals(positionA: Position, positionB: Position): boolean;
    public equals(...args: Position[]): boolean {
        if (args.length === 1) {
            const [ position ] = args
            return (
                this.lineNumber < position.lineNumber
                &&
                this.column < position.column
            )
        } else {
            const [a, b] = args;
            return (
                a.lineNumber === b.lineNumber
                &&
                a.column === b.column
            )
        }
    }

    /**
     * isBefore
     * 检测position是否在当前位置之前
     * @param position 
     */
    public isBefore(position: Position): boolean;
    /**
     * isBefore
     * 检测positionA 是否在positionB之前
     */
    public isBefore(positionA: Position, positionB: Position): boolean;
    public isBefore(...args: Position[]): boolean {
        if (args.length === 1) {
            const [position] = args;
            return (
                this.lineNumber < position.lineNumber
                &&
                this.column < position.column
            )
        } else {
            const [a, b] = args;
            return (
                a.lineNumber < b.lineNumber
                &&
                a.column < b.column
            )
        }
    }

    /**
     * isBeforeOrEqual
     * 检测position是否在当前位置之前或等于position
     * @param position 
     */
    public isBeforeOrEqual(position: Position): boolean;
    /**
     * isBeforeOrEqual
     * 检测positionA 是否在positionB之前或等于positionB
     */
    public isBeforeOrEqual(positionA: Position, positionB: Position): boolean;
    public isBeforeOrEqual(...args: Position[]): boolean {
        if (args.length === 1) {
            const position = args[0]
            return (
                this.lineNumber <= position.lineNumber
                &&
                this.column <= position.column
            )
        } else {
            const [ a, b ] = args;
            return (
                a.lineNumber <= b.lineNumber
                &&
                a.column <= b.column
            )
        }
    }

    /**
     * with 
     * 从此位置创建新位置
     */
    public with(newLineNumber: number, newColumn: number): Position {
        this.lineNumber = newLineNumber;
        this.column = newColumn;
        return this;
    }

    /**
     * isPosition
     * 判断对象是否为位置
     */
    public isPosition(obj: any) {
        return obj instanceof Position
    }
}