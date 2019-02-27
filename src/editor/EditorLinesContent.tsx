import React, { Component, MouseEvent, UIEvent } from 'react';
import PropTypes from 'prop-types';
import './EditorLinesContent.scss'

interface IEditorLinesContentProps {
    fontSize: number;
    value: string;
    fontFamily: string;
    lineHeight: number;
    activeLine: number;
    onSelectBlankContent?: (event: MouseEvent) => void;
    onSelectLine?: (event: MouseEvent ,selectlineNumber: number, selectLineValue: string) => void;
    codeParseProvider?: (value: string) => string[];
}

type IEditorLinesContentState = Readonly<{
    contentHeight: number;
    scrollHeight: number;
    scrollTop: number;   
}>

export class EditorLinesContent extends Component<IEditorLinesContentProps, IEditorLinesContentState> {

    readonly state: IEditorLinesContentState = {
        contentHeight: 0,
        scrollHeight: 0,
        scrollTop: 0
    }
    static propTypes = {
        fontSize: PropTypes.number,
        fontFamily: PropTypes.string,
        value: PropTypes.string,
        codeParseProvider: PropTypes.func,
        lineHeight:PropTypes.number,
        activeLine: PropTypes.number
    }

    /**
     * handleSelectLine
     * @param { MouseEvent } event 原生html事件
     * @param { Number } selectlineNumber 选中的行
     * @param { String } selectLineValue 选中行的内容
     */
    public handleSelectLine(event: MouseEvent ,selectlineNumber: number, selectLineValue: string) {
        if (typeof this.props.onSelectLine !== 'function') return;
        this.props.onSelectLine(event, selectlineNumber, selectLineValue)
    }

    public handleSelectBlankContent(event: MouseEvent) {
        if (typeof this.props.onSelectBlankContent !== 'function') return;
        if (event.target !== this.refs['lines-content']) return;
        this.props.onSelectBlankContent(event)
    }

    componentDidMount() {
        const element = this.refs['lines-content'] as HTMLDivElement
        this.setState({
            contentHeight: element.clientHeight,
            scrollHeight: element.scrollHeight,
            scrollTop: element.scrollTop
        })
    }



    public render() {
        const { contentHeight, scrollHeight, scrollTop } = this.state
        const { value, codeParseProvider, fontSize, fontFamily, lineHeight, activeLine } = this.props
        const maxLineNumber = contentHeight / lineHeight
        // console.log(maxLineNumber)
        // console.log(scrollTop)
        return (
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    fontFamily,
                    fontSize,
                    lineHeight: lineHeight + 'px',
                    cursor: 'text',
                    width: '100%',
                    height: '100%',
                    overflow: "hidden scroll"
                }}
                onScroll={(e: UIEvent) => {
                    console.log(e)
                    // this.setState({
                    //     scrollTop: e.nati
                    // })
                }}
                ref="lines-content"
                onClick={this.handleSelectBlankContent.bind(this)}
                className="lines-content editor-background"
            >
                {
                    typeof codeParseProvider === 'function'
                        ? codeParseProvider(value).map((v: string, index: number) => (
                            <div
                                key={index}
                                className="code-line"
                                style={{
                                    height:  lineHeight + 'px',
                                    padding: '0 1px'
                                }}
                                onMouseUp={(e: MouseEvent) => {
                                    if (e.button === 0) {
                                        e.persist()
                                        this.handleSelectLine(e, index, v)
                                    }
                                }}
                                onMouseDown={(e: MouseEvent) => {
                                    
                                }}
                            >
                                <span dangerouslySetInnerHTML={{__html: v.replace(/\s/g, '&nbsp;')}}></span>
                            </div>
                        ))
                        : value.split('\n').map((v: string, index: number) => (
                            <div
                                key={index}
                                className="code-line"
                                style={{
                                    height:  lineHeight + 'px',
                                    padding: '0 1px',
                                    position: 'absolute',
                                    width: '100%',
                                    left: 0,
                                    top: index * lineHeight + 'px',
                                    backgroundColor: activeLine === index ? 'rgba(0,0,0,.1)' : 'transparent'
                                }}
                                onMouseUp={(e: MouseEvent) => {
                                    if (e.button === 0) {
                                        e.persist()
                                        this.handleSelectLine(e, index, v)
                                    }
                                }}
                                onMouseDown={(e: MouseEvent) => {
                                    
                                }}
                            >
                                <span dangerouslySetInnerHTML={{__html: v.replace(/\s/g, '&nbsp;')}}></span>
                            </div>
                        ))
                }
                {this.props.children}
            </div>
        )
    }

}