import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


/*
まだ時間がある場合や、今回身につけた新しいスキルを練習してみたい場合に、
あなたが挑戦できる改良のアイデアを以下にリストアップしています。後ろの方ほど難易度が上がります：

・履歴内のそれぞれの着手の位置を (col, row) というフォーマットで表示する。
・着手履歴のリスト中で現在選択されているアイテムを太字にする。
・Board でマス目を並べる部分を、ハードコーディングではなく 2 つのループを使用するように書き換える。
・着手履歴のリストを昇順・降順いずれでも並べかえられるよう、トグルボタンを追加する。
・どちらかが勝利した際に、勝利につながった 3 つのマス目をハイライトする。
・どちらも勝利しなかった場合、結果が引き分けになったというメッセージを表示する。
・このチュートリアルを通じて、要素、コンポーネント、props、state といった React の概念に触れてきました。これらのトピックについての更に掘り下げた説明は、
　ドキュメントの続きをご覧ください。コンポーネントの作成方法についてより詳細に学ぶには、React.Component API リファレンスを参照してください。
*/



//reactにおける関数コンポーネントはrender()有して、自分のstateを持たない場合、
//シンプルに記入することができる
//※　Board が Square コンポーネントを全面的に制御しています。
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
    );
    }
  
    render() {
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
      );
    }
  }
  
  class Game extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
          history: [{
            squares: Array(9).fill(null),
          }],
          xIsNext: true,
          //いま何手目の状態を見ているのかを表すstate
          stepNumber: 0,
        };
      }

    handleClick(i){
        /*
        .slice(開始,終了);
        @param 開始
        配列の指定された部分の開始インデックス。 start が定義されていない場合、スライスはインデックス 0 から始まります。
        @param 終了
        配列の指定された部分の終了インデックス。これは、インデックス 'end' の要素を除きます。 end が定義されていない場合、スライスは配列の最後まで拡張されます。
        */
        const history = this.state.history.slice(0,this.state.stepNumber + 1)
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            //push() メソッドの方に慣れているかもしれませんが、それと違って concat() は元の配列をミューテートしないため、こちらを利用します。
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    /*
    ゲームの状態を保存するために使用されるstateオブジェクトを更新するために呼び出される。
    jumpTo メソッドを定義してその stepNumber が更新されるようにします。
    また更新しようとしている stepNumber の値が偶数だった場合は xIsNext を true に設定します。
    */
    
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: ( step%2 ) === 0,
        })

    }

    render() {
        //Game コンポーネントの render 関数を更新して、ゲームのステータステキストの決定や表示の際に最新の履歴が使われるようにします。
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 
                'Go to move #' + move :
                'Go to game start';
            return (
                //ボタンには onClick ハンドラがあり、それは this.jumpTo() というメソッドを呼び出します
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            ) ;
        });
        let status;
        if(winner){
            status = ' Winner: '+ winner;
        }else{
            status = ' Next Player: ' +(this.state.xIsNext ? ' X ' : ' O ');
        }


      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{ status }</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  

  function calculateWinner(squares) {
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
        return squares[a];
      }
    }
    return null;
  }