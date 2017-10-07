import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 如果一个class中只有render方法，那么可以使用函数定义组件  简单组件都可以使用函数定义的方式来编写
// 单个的button格子 子组件
function Square(props) {
    return (
        // 从父组件Board接受数据，并当自己被点击时通知父组件改变状态数据，这类组件称为受控组件

        // 注意此时props.onClick后不能加()，否则props.onClick会在Square组件渲染时被直接触发，
        // 而不是等到Board组件渲染完成时通过点击触发，又因为此时Board组件正在渲染中(既Board组件
        // 的render()方法正在调用)，又触发了handleClick(i)方法调用setState()会再次调用render()
        // 造成死循环
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}


/* 两个组件要相互通信的时候，将子组件的state数据提升到父组件中保存，
之后父组件通过props将状态传递到子组件中 */

// 包含了九个格子的容器 父组件
class Board extends Component {
    constructor () {
        super();
        // 9个空值数组
        this.state = {
            squares: Array(9).fill(null),
            // 将X默认设置为先手
            xIsNext: true,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick (i) {
        // 用.slice方法将之前的数组深拷贝到一个新的数组中，而不是修改原数组，防止对已有数据的改变
        // 对于字符串类型，浅复制是对值的复制，
        // 对于对象来说，浅复制是对对象地址的复制，并没有开辟新的栈，也就是复制的结果是两个对象指向同一个地址，修改其中一个对象的属性，则另一个对象的属性也会改变，
        // 而深复制则是开辟新的栈，两个对象对应两个不同的地址，修改一个对象的属性，
        // 不会改变另一个对象的属性。深复制实现代码如下：可以从两个方法进行解决。
        const squares = this.state.squares.slice();
        // 每走一步都需要切xIsNext的值来实现轮流
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            // 更改状态
            xIsNext: !this.state.xIsNext
        })
    }

    // 从父组件Board传递一个事件处理函数到子组件Square中
    renderSquare(i) {
        return (
            <Square 
                value={this.state.squares[i]} 
                onClick={() => this.handleClick(i)}
            />
        )
    };

    render () {
        const status ='Next player:' + (this.state.xIsNext ? 'X' : 'O');
        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}

class Game extends Component {
    render () {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* todo */}</ol>
                </div>
            </div>
            
        )
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
)


