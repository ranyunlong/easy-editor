import React, { Component, MouseEvent, KeyboardEvent } from 'react'
import { EditorLinesContent } from './EditorLinesContent';
import { EditorCursor } from './EditorCursor';
import { EditorInputarea, InputareaEvent } from './EditorInputarea';
import calculateSize from 'calculate-size'

interface IEditorProps {
    value?: string;
    setting?: {
        fontFamily?: string;
        fontSize?: number;
    }
}

interface IEditorDefaultProps {
    value: string;
    setting: {
        fontFamily: string;
        fontSize: number;
    }
}

type IEditorState = Readonly<{
    isFocus: boolean;
    value: string;
    nativeTextAreaElement: HTMLTextAreaElement | null;
    activeLine: number;
    editorSelection: {
        selectionStart: number;
        selectionEnd: number;
    }
    cursorAndInputPosition: {
        x: number;
        y: number;
    }
}>

export class Editor extends Component<IEditorProps, IEditorState> {

    readonly state: IEditorState = {
        isFocus: false,
        value: this.props.value || '',
        nativeTextAreaElement: null,
        activeLine: 0,
        editorSelection: {
            selectionStart: 0,
            selectionEnd: 0
        },
        cursorAndInputPosition: {
            x: 0,
            y: 0
        }
    }

    static defaultProps: IEditorDefaultProps = {
        value: '',
        setting: {
            fontFamily: `Consolas, "Courier New", monospace`,
            fontSize: 16
        }
    }

    componentDidMount() {
        this.setState({
            nativeTextAreaElement: (this.refs.inputarea as EditorInputarea).getElement()
        })
        window.addEventListener('click', this.handleEditorBlur.bind(this))
        // const linesContent = this.refs['lines-content'] as HTMLDivElement
        // document.addEventListener('selectionchange', this.onSelection.bind(this))
    }

    // 处理父组件传递的更新
    componentWillReceiveProps(...args: any[]) {
        // console.log(args)
    }
    
    // 处理编辑器失去焦点
    handleEditorBlur() {
        this.setState({
            isFocus: false
        })
    }

    // 处理编辑器获取焦点
    handleEditorFocus(e: MouseEvent) {
        e.stopPropagation()
        this.setState({
            isFocus: true
        })
    }

    // 处理编辑器输入更新
    handleEditorInput(detail: InputareaEvent) {
        const { value, nativeTextAreaElement } = detail
        this.setState({value, nativeTextAreaElement})
        this.computeCursionPosition()
    }

    // 处理编辑器键盘事件
    handleEditorKeyDown(e: KeyboardEvent) {
        setTimeout(() => {
            this.computeCursionPosition() 
        }, 1);
    }

    /**
     * 处理单行代码被选中
     * @param event 
     * @param selectlineNumber 
     * @param selectLineValue 
     */
    handleSelectLine(event: MouseEvent ,selectlineNumber: number, selectLineValue: string) {
        const { nativeEvent } = event
        const { setting } = this.props as IEditorDefaultProps
        const maxWidth = this.getFontsWidth(selectLineValue).width
        if (nativeEvent.offsetX > maxWidth) {
            this.setSelection({
                startColumn: selectLineValue.length,
                endColumn: selectLineValue.length,
                startLineNumber: selectlineNumber + 1,
                endLineNumber: selectlineNumber + 1
            })
        } else {
            const result = selectLineValue.split('').map((str, index) => {
                const { width } = this.getFontsWidth(selectLineValue.substr(0, index))
                return {
                    index,
                    width,
                    difference: Math.abs(nativeEvent.offsetX - width)
                }
            }).sort((a, b) => {
                return a.difference - b.difference
            })[0]

            this.setSelection({
                startColumn: result.index,
                endColumn: result.index,
                startLineNumber: selectlineNumber + 1,
                endLineNumber: selectlineNumber + 1
            })
        }
    }

    /**
     * 处理编辑器空白部位点击事件
     * @param event 
     */
    handleSelectBlankContent(event: MouseEvent) {
        const { value } = this.state
        const len =  value.split('\n').length
        this.setSelection({
            startColumn: value.length,
            endColumn: value.length,
            startLineNumber: len + 1,
            endLineNumber: len + 1
        })
    }

    /**
     * 获取编辑器选区位置
     */
    getSelection(): IRange {
        const { nativeTextAreaElement } = this.state
        const { value, selectionStart, selectionEnd, selectionDirection } = nativeTextAreaElement as HTMLTextAreaElement
        const selectionStartText = value.substr(0, selectionStart)
        const selectionEndText = value.substr(0, selectionEnd)
        const startStrSplit = selectionStartText.split('\n')
        const startStrSplitLast = startStrSplit[startStrSplit.length - 1]
        const endStrSplit = selectionEndText.split('\n')
        const endStrSplitLast = endStrSplit[endStrSplit.length - 1]
        return {
            startLineNumber: selectionStart !== 0 ? startStrSplit.length : 0,
            endLineNumber: selectionEnd !== 0 ? endStrSplit.length: 0,
            startColumn: startStrSplitLast ? startStrSplitLast.length: 0,
            endColumn: endStrSplitLast ? endStrSplitLast.length: 0,
            selectionDirection
        }
    }
    
    /**
     * 设置编辑器选区位置
     * @param range 
     */
    setSelection(range: IRange) {
        const nativeTextAreaElement = this.state.nativeTextAreaElement as HTMLTextAreaElement
        const { value } = nativeTextAreaElement
        const startText = value.split('\n').slice(0, range.startLineNumber)
        const endText =  value.split('\n').slice(0, range.endLineNumber)
        const startLastText = startText.pop()
        const endLastText = endText.pop()
        if (startLastText && range.startColumn) {
            startText.push(startLastText.substr(0, range.startColumn))
        } else {
            startText.push('')
        }
        if (endLastText && range.endColumn) {
            endText.push(endLastText.substr(0, range.endColumn))
        } else {
            endText.push('')
        }
        nativeTextAreaElement.selectionStart = startText.join('\n').length
        nativeTextAreaElement.selectionEnd = endText.join('\n').length

        this.computeCursionPosition()
    }

    /**
     * 根据原生textarea计算自动计算 Cursor和Input的坐标位置
     */
    computeCursionPosition() {
        const { nativeTextAreaElement } = this.state
        const { value, selectionStart } = nativeTextAreaElement as HTMLTextAreaElement
        const { setting } = this.props as IEditorDefaultProps
        const range = this.getSelection()
        const selectionStartText = value.substr(0, selectionStart)
        const lastLine = selectionStartText.split('\n').pop()
        const { width } = this.getFontsWidth(lastLine || '')
        this.setState({
            activeLine: range.startLineNumber - 1
        })
        this.setCursorAndInputPosition(width, (range.startLineNumber - 1) * (setting.fontSize * 1.3))
    }

    /**
     * 设置 Cursor和Input的坐标位置
     * @param { Number } x 
     * @param { Number } y 
     */
    setCursorAndInputPosition(x: number, y: number) {
        if (y < 0) y = 0
        this.setState({cursorAndInputPosition: { x, y}});
    }

    /**
     * 根据文字计算长度
     * @param { String } text 
     */
    getFontsWidth(text: string) {
        const { setting } = this.props as IEditorDefaultProps
        return calculateSize(text.replace(/\s/g, '0'), {
            font: setting.fontFamily,
            fontSize: setting.fontSize + 'px'
        })
    }

    render() {
        const { isFocus, value, cursorAndInputPosition, activeLine } = this.state
        const { setting } = this.props as IEditorDefaultProps
        const { fontSize, fontFamily } = setting
        return (
            <div 
                className={'easy-editor' + isFocus ? ' focused' : ''}
                ref="editor"
                onClick={this.handleEditorFocus.bind(this)}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'pink',
                    overflow: 'hidden'
                }}
            >
                <EditorLinesContent
                    activeLine={activeLine}
                    onSelectLine={this.handleSelectLine.bind(this)}
                    onSelectBlankContent={this.handleSelectBlankContent.bind(this)}
                    value={value}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    lineHeight={fontSize * 1.3}
                >
                    <EditorCursor
                        height={fontSize * 1.3}
                        show={isFocus}
                        position={cursorAndInputPosition}
                    />
                </EditorLinesContent>
                <EditorInputarea
                    ref="inputarea"
                    value={value}
                    position={cursorAndInputPosition}
                    onInput={this.handleEditorInput.bind(this)}
                    onBlur={() => this.setState({isFocus: false})}
                    onKeyDown={this.handleEditorKeyDown.bind(this)}
                    focused={isFocus}
                />
            </div>
        )
    }

}

export interface IRange {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    selectionDirection?: string;
    endColumn: number;
}