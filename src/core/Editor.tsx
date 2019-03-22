import React, { CSSProperties, Component } from 'react';
import PropTypes from 'prop-types';
import './Editor.scss';
import { EditorNative } from './EditorNative';
import { EditorContainer } from './EditorContainer';
import { IEditorKeyCode } from './lib/EditorKeyMap';

export class Editor extends Component<IEditorProps, IEditorState> {
    public readonly state: IEditorState = {
        value: this.props.value,
        paddingBottom: 0,
    }

    // token解析 是否结束
    public tokenLineIsFinish: boolean = true;

    // value值
    public value: string = '';

    static keyCode = IEditorKeyCode;

    static propTypes = {
        value: PropTypes.string.isRequired,
        setting: PropTypes.shape({
            language: PropTypes.string,
            fontSize: PropTypes.number,
            fontFamily: PropTypes.string,
            lineHeight: PropTypes.number
        })
    }

    static defaultProps: IEditorProps = {
        value: '',
        setting: {
            language: '',
            fontSize: 16,
            fontFamily: `'Microsoft YaHei','SF Pro Display',Roboto,Noto,Arial,'PingFang SC',sans-serif`,
            lineHeight: 22,
            spellCheck: false,
            readonly: false
        }
    }
    
    public componentDidMount() {
        setTimeout(() => {
            this.layout()
        }, 0);
    }

    public layout() {
        const el = this.getElement()
        const { setting } = this.props;
        const defaultSetting = { ...Editor.defaultProps.setting, ...setting } as any
        if (el && setting && defaultSetting.lineHeight) {
            this.setState({
                paddingBottom: el.clientHeight - defaultSetting.lineHeight - 5
            }, () => {
                console.log(this)
            })
        }
    }

    public componentWillReceiveProps(nextProps: IEditorProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                value: nextProps.value
            })
        }
    }

    private handleInput(value: string) {
        
    }

    public render() {
        const { style, setting } = this.props
        const { value, paddingBottom } = this.state
        const { language, spellCheck, readonly, ...settings } = { ...Editor.defaultProps.setting, ...setting } as any;
        return (
            <div ref="$el" className="easy-editor" style={style}>
                {/* <EditorContainer
                    value={value}
                    style={{...settings, paddingBottom}}
                    language={language}
                    spellCheck={spellCheck}
                    readonly= {readonly}
                    ref="editorContainer"
                /> */}
                <EditorNative
                    ref="editorNative"
                    onInput={this.handleInput.bind(this)}
                    value={value}
                    style={{...settings, paddingBottom}}
                    spellCheck={spellCheck}
                    readonly= {readonly}
                    onScroll={(e) => {
                        e.persist()
                        const target = e.target as HTMLTextAreaElement;
                        // this.getContainerElement().scrollTo({
                        //     left: target.scrollLeft,
                        //     top: target.scrollTop
                        // })
                    }}
                />
            </div>
        );
    }

    /**
     * 获取选区
     */
    public getSelection() {
        this.getEditorNativeElement().getElement().selectionDirection
    }

    /**
     * 获取滚动条top
     */
    public getScrollTop(): number {
        return this.getEditorNativeElement().getElement().scrollTop;
    }

    /**
     * 获取滚动条left
     */
    public getScrollLeft(): number {
        return this.getEditorNativeElement().getElement().scrollLeft;
    }

    /**
     * 获取滚动条高度
     */
    public getScrollHeight(): number {
        return this.getEditorNativeElement().getElement().scrollHeight;
    }

    /**
     * 获取编辑器容器
     */
    private getContainerElement(): EditorContainer {
        return this.refs.editorContainer as EditorContainer
    }

    /**
     * 获取原生编辑器
     */
    private getEditorNativeElement(): EditorNative  {
        return this.refs.editorNative as EditorNative
    }

    /**
     * 获取编辑器元素
     */
    private getElement(): HTMLDivElement {
        return this.refs.$el as HTMLDivElement;
    }

    public addCommand(keyCode: IEditorKeyCode, listener: <K extends keyof HTMLElementEventMap>(this: HTMLTextAreaElement, event: HTMLElementEventMap[K]) => void) {
        this.getEditorNativeElement().addCommand(keyCode, listener)
    }
}

interface IEditorProps {
    value: string;
    style?: React.CSSProperties;
    setting?: IEditorSetting;
    onInput?: (value: string) => void;
}

interface IEditorState {
    value: string;
    paddingBottom: number;
}

interface IEditorSetting {
    // 当前语言
    language?: string;
    // 编辑器字体大小
    fontSize?: number;
    // 编辑器字体
    fontFamily?: string;
    // 编辑器行高
    lineHeight?: number;
    // 是否开启拼写检查
    spellCheck?: boolean;
    // 只读编辑器
    readonly?: boolean;
}

export interface BaseEditorProps {
    // 编辑器的参数
    value: string;
    // 编辑器的样式
    style?: CSSProperties | undefined;
    // 是否开启拼写检查
    spellCheck?: boolean;
    // 只读编辑器
    readonly?: boolean;
}