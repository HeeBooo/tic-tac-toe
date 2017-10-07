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

    // 从父组件Board传递一个事件处理函数到子组件Square中
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
            />
        )
    };

    render () {
        return (
            <div>
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
    constructor () {
        super();
        this.state = {
            history: [{
                // 9个空值数组
                squares: Array(9).fill(null)
            }],
            // 将X默认设置为先手
            xIsNext: true,
            stepNumber: 0
        };
    };
    jumpTo (step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step%2) ? false : true
        })
    }
    handleClick (i) {
        // 用.slice方法将之前的数组深拷贝到一个新的数组中，而不是修改原数组，防止对已有数据的改变
        // 对于字符串类型，浅复制是对值的复制，
        // 对于对象来说，浅复制是对对象地址的复制，并没有开辟新的栈，也就是复制的结果是两个对象指向同一个地址，修改其中一个对象的属性，则另一个对象的属性也会改变，
        // 而深复制则是开辟新的栈，两个对象对应两个不同的地址，修改一个对象的属性，
        // 不会改变另一个对象的属性。深复制实现代码如下：可以从两个方法进行解决。
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // 已经落子或有一方获胜
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        // 每走一步都需要切xIsNext的值来实现轮流
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        console.log(squares)
        
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            // 更改状态
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        })
    }

    render () {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 'Move #' + move : 'Game Start';
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            )
        })


        let status;
        if (winner) {
            status = 'Winner:' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)} 
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
            
        )
    }
}

// 判断赢家
function calculateWinner (squares) {
    // 以下条件为赢
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            console.log(squares[a])
            return squares[a];
        }
    }
    return null;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
)


