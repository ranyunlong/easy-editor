import React, { Component, CSSProperties } from 'react';
import PropTypes from 'prop-types';
import { BaseEditorProps } from './Editor';
import './EditorContainer.scss';

export class EditorContainer extends Component<IEditorContainerProps, IEditorContainerState> {
    public readonly state: IEditorContainerState = {
        value: ''
    }
    static defaultProps: IEditorContainerProps = {
        value: '',
        style: {},
        language: '',
        spellCheck: false,
        readonly: false
    }

    static propTypes = {
        value: PropTypes.string.isRequired,
        style: PropTypes.object,
        spellCheck: PropTypes.bool,
        readonly: PropTypes.bool
    }

    public scrollToOptions: ScrollToOptions = {left: 0, top: 0};

    public tokenLinesFinish: boolean = true;

    shouldComponentUpdate(nextProps: Readonly<IEditorContainerProps>){
        if (nextProps.value !== this.props.value) return false;
        return true;
    }

    public render() {
        const { style, language } = this.props;
        const { value } = this.state
        const styles: CSSProperties = {}
        if (style) {
            styles.fontSize = style.fontSize
            styles.lineHeight = style.lineHeight + 'px';
            styles.fontFamily = style.fontFamily
        }
        console.log('rerender')
        return (
            <pre 
                ref="$el" 
                className={`easy-editor-container language-${language}`}
                style={{...style ,...styles}}>
                
            </pre>
        );
    }

    public scrollTo(option: ScrollToOptions) {
        this.scrollToOptions = option;
        this.getElement().scrollTo(option);
    }

    public getElement() {
        return this.refs.$el as HTMLDivElement
    }
}

interface IEditorContainerProps extends BaseEditorProps {
    language?: string;
}

interface IEditorContainerState {
    value: string;
}