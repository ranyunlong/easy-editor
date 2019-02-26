import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { setInterval, clearInterval } from 'timers';

interface ICursorProps {
    show?: boolean;
    height?: number;
    duration?: number; // 闪烁频率
    cursorBlinking?: 'blink' | 'smooth' | 'solid'; // 闪烁类型
    position?: {
        x: number;
        y: number;
    }
}

export interface IEditorCursorDefalutProps {
    show: boolean;
    height: number;
    duration: number; // 闪烁频率
    cursorBlinking: 'blink' | 'smooth' | 'solid'; // 闪烁类型
    position: {
        x: number;
        y: number;
    }
}

type ICursorState = Readonly<{
    show: boolean;
    timer: TimerHandler | null;
}>

let timmer: NodeJS.Timeout;

export class EditorCursor extends Component<ICursorProps, ICursorState> {
    static propTypes = {
        show: PropTypes.bool,
        position: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        }),
        duration: PropTypes.number,
        cursorBlinking: PropTypes.string
    }
    state: ICursorState = {
        show: true,
        timer: null,
    }
    static defaultProps: IEditorCursorDefalutProps = {
        show: false,
        position: {
            x: 0,
            y: 0
        },
        cursorBlinking: 'blink',
        duration: 500,
        height: 19
    }
    componentWillReceiveProps(props: IEditorCursorDefalutProps) {
        if (!this.props.show && props.show) {
            this.setState({
                show: true
            })
            this.startBlinking()
        } else {
            this.setState({
                show: true
            })
            this.startBlinking()
        }
    }
    
    /**
     * 闪烁光标
     */
    startBlinking() {
        clearInterval(timmer)
        timmer = setInterval(() => {
            this.setState({
                show: !this.state.show
            })
        }, this.props.duration || 500)
    }


    render() {
        const { position, show, height } = this.props as IEditorCursorDefalutProps
        if (!show) {
            clearInterval(timmer)
            return '';
        }
        return (
            <div 
                className="editor-cursor"
                style={{
                    position: 'absolute',
                    width: '2px',
                    background: '#000',
                    height: height,
                    display: this.state.show ? 'block' : 'none',
                    left: position.x + 'px',
                    top: position.y + 'px'
                }}
            >
            </div>
        )
    }

}