import React, { Component, MouseEvent } from 'react';
import PropTypes from 'prop-types';
import './EditorLinesContent.scss'

interface IEditorLinesContentProps {
    fontSize: number;
    value: string;
    fontFamily: string;
    lineHeight: number;
    onSelectLine?: (event: MouseEvent ,selectlineNumber: number, selectLineValue: string) => void;
    codeParseProvider?: (value: string) => string[];
}

type IEditorLinesContentState = Readonly<{}>

export class EditorLinesContent extends Component<IEditorLinesContentProps, IEditorLinesContentState> {

    readonly state: IEditorLinesContentState = {}
    static propTypes = {
        fontSize: PropTypes.number,
        fontFamily: PropTypes.string,
        value: PropTypes.string,
        codeParseProvider: PropTypes.func,
        lineHeight:PropTypes.number
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
    public render() {
        const { value, codeParseProvider, fontSize, fontFamily, lineHeight } = this.props
        return (
            <div
                style={{
                    fontFamily,
                    fontSize,
                    lineHeight: lineHeight + 'px',
                    cursor: 'text',
                    height: '100%'
                }}
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
                                onClick={(e: MouseEvent) => {
                                    e.persist()
                                    this.handleSelectLine(e, index, v)
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
                                    padding: '0 1px'
                                }}
                                onClick={(e: MouseEvent) => {
                                    e.persist()
                                    this.handleSelectLine(e, index, v)
                                }}
                            >
                                <span dangerouslySetInnerHTML={{__html: v.replace(/\s/g, '&nbsp;')}}></span>
                            </div>
                        ))
                }
            </div>
        )
    }

}