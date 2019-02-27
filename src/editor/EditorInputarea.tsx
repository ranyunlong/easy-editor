import React, { Component, FocusEvent, KeyboardEvent } from 'react'

interface IEditorInputareaProp {
    focused?: boolean;
    value?: string;
    onInput?: (event: InputareaEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    position: {
        x: number;
        y: number;
    }
}

type IEditorInputareaState = Readonly<{}>

export class EditorInputarea extends Component<IEditorInputareaProp, IEditorInputareaState> {
    readonly state: IEditorInputareaState = {}
    componentWillReceiveProps(props: IEditorInputareaProp) {
        const inputarea = this.refs.inputarea as HTMLTextAreaElement
        if (props.focused) {
            inputarea.focus()
        } else {
            inputarea.blur()
        }
    }
    handleEditorInputareaInput() {
        if (typeof this.props.onInput !== 'function') return;
        const nativeTextAreaElement = this.refs.inputarea as HTMLTextAreaElement
        const { value } = nativeTextAreaElement
        this.props.onInput({
            value,
            nativeTextAreaElement
        })
    }
    handleEditorInputareaBlur(event: FocusEvent) {
        if (typeof this.props.onBlur !== 'function') return;
        this.props.onBlur(event);
    }
    handleEditorInputareaKeydown(event: KeyboardEvent) {
        if (typeof this.props.onKeyDown !== 'function') return;
        this.props.onKeyDown(event)
    }

    /**
     * 获取原生节点
     */
    getElement(): HTMLTextAreaElement {
        return this.refs.inputarea as HTMLTextAreaElement
    }
    render() {
        return (
            <textarea
                ref="inputarea"
                defaultValue={this.props.value || ''}
                onInput={this.handleEditorInputareaInput.bind(this)}
                onBlur={this.handleEditorInputareaBlur.bind(this)}
                onKeyDown={this.handleEditorInputareaKeydown.bind(this)}
                onSelect={(e) => {
                    e.persist()
                    // console.log(e)  
                }}
                style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    margin: 0,
                    padding: 0,
                    minWidth: 0,
                    minHeight: 0,
                    left: this.props.position.x + 1 || 0,
                    top: this.props.position.y + 1 || 0,
                    outline: 'none',
                    resize: 'none',
                    border: 'none',
                    overflow: 'hidden',
                    color: 'transparent',
                    backgroundColor: 'transparent',
                    whiteSpace: 'pre'
                }}
                className="inputarea"
            >
            </textarea>
        )
    }
}

export interface InputareaEvent {
    value: string;
    nativeTextAreaElement: HTMLTextAreaElement
}