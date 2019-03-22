import React, { CSSProperties, FormEventHandler, EventHandler, UIEventHandler } from 'react';
import PropTypes from 'prop-types';
import './EditorNative.scss';
import { BaseEditorProps } from './Editor';
import { IEditorKeyCode } from './lib/EditorKeyMap';

export class EditorNative extends React.Component<IEditorNativeProps, IEditorNativeState> {
    public readonly state!: IEditorNativeState;

    static defaultProps: IEditorNativeProps = {
        value: '',
        style: {},
        spellCheck: false,
        readonly: false
    }

    static propTypes = {
        value: PropTypes.string.isRequired,
        style: PropTypes.object,
        spellCheck: PropTypes.bool,
        readonly: PropTypes.bool,
        onInput: PropTypes.func
    }

    public render() {
        const { style, spellCheck, onInput, value } = this.props
        const styles: CSSProperties = {}
        if (style) {
            styles.fontSize = style.fontSize
            styles.lineHeight = style.lineHeight + 'px';
            styles.fontFamily = style.fontFamily
            styles.paddingBottom = style.paddingBottom
        }
        return (
            <textarea
                ref="$el"
                spellCheck={spellCheck}
                readOnly={false}
                className="easy-editor-native"
                style={styles}
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    if (typeof onInput === 'function') onInput(target.value);    
                }}
                defaultValue={value}
                onScroll={this.props.onScroll}
            >
            </textarea>
        );
    }

    public getElement() {
        return this.refs.$el as HTMLTextAreaElement
    }

    public addCommand(keyCode: IEditorKeyCode, listener: <K extends keyof HTMLElementEventMap>(this: HTMLTextAreaElement, event: HTMLElementEventMap[K]) => void) {
        this.getElement().addEventListener('keydown', function(e) {
            if (e.keyCode === keyCode) listener.bind(this, e);
        })
    }
}

export interface IEditorNativeProps extends BaseEditorProps {
    onInput?: (value: string) => void; 
    onScroll?: UIEventHandler<HTMLTextAreaElement>;
}

interface IEditorNativeState {}