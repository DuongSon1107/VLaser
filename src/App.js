import React, { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, isWinningSquare }) {
  const className = isWinningSquare ? 'square highlight' : 'square';
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ boardSize, xIsNext, squares, onPlay, winningSquares }) {
  function handleClick(i) {
    if (winningSquares || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const renderSquare = (i, isWinningSquare) => (
    <Square
      key={i}
      value={squares[i]}
      onSquareClick={() => handleClick(i)}
      isWinningSquare={isWinningSquare}
    />
  );

  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < boardSize; i++) {
      const row = [];
      for (let j = 0; j < boardSize; j++) {
        const squareIndex = i * boardSize + j;
        const isWinningSquare = winningSquares && winningSquares.includes(squareIndex);
        row.push(renderSquare(squareIndex, isWinningSquare));
      }
      board.push(
        <div key={i} className="board-row">
          {row}
        </div>
      );
    }
    return board;
  };

  return <div>{renderBoard()}</div>;
}

export default function Game() {
  const [boardSize, setBoardSize] = useState(3); 
  const [history, setHistory] = useState([Array(boardSize * boardSize).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const winningSquares = calculateWinner(currentSquares, boardSize);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleSizeChange(newSize) {
    setBoardSize(newSize);
    setHistory([Array(newSize * newSize).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => setCurrentMove(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board boardSize={boardSize} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningSquares={winningSquares} />
      </div>
      <div className="game-info">
        <div>
          <label>Board Size: </label>
          <select value={boardSize} onChange={(e) => handleSizeChange(parseInt(e.target.value))}>
            <option value={3}>3x3</option>
            <option value={5}>5x5</option>
            <option value={10}>10x10</option>
            <option value={15}>15x15</option>
          </select>
        </div>
        <div>
          {winningSquares ? `Winner: ${currentSquares[winningSquares[0]]}` : `You are at move #${currentMove}`}
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares, boardSize) {
  const lines = [];
  // Điều kiện thắng cho chế độ chơi 3x3
if (boardSize === 3) {
  for (let i = 0; i < 3; i++) {
    if (squares[i] === squares[i + 1] && squares[i] === squares[i + 2] && squares[i] !== null) {
      return [i, i + 1, i + 2];
    }
  }

  for (let i = 0; i < 3; i++) {
    if (squares[i * 3] === squares[i * 3 + 1] && squares[i * 3] === squares[i * 3 + 2] && squares[i * 3] !== null) {
      return [i * 3, i * 3 + 1, i * 3 + 2];
    }
  }

  if (squares[0] === squares[4] && squares[0] === squares[8] && squares[0] !== null) {
    return [0, 4, 8];
  }

  if (squares[2] === squares[4] && squares[2] === squares[6] && squares[2] !== null) {
    return [2, 4, 6];
  }
}
// điều kiện thắng cho chế độ còn lại
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (j + 4 < boardSize) {
        lines.push(Array(5).fill(0).map((_, k) => i * boardSize + j + k));
      }
      if (i + 4 < boardSize) {
        lines.push(Array(5).fill(0).map((_, k) => (i + k) * boardSize + j));
      }
      if (i + 4 < boardSize && j + 4 < boardSize) {
        lines.push(Array(5).fill(0).map((_, k) => (i + k) * boardSize + j + k));
      }
      if (i + 4 < boardSize && j - 4 >= 0) {
        lines.push(Array(5).fill(0).map((_, k) => (i + k) * boardSize + j - k));
      }
    }
  }

  for (const line of lines) {
    let xCount = 0;
    let oCount = 0;
    for (const square of line) {
      if (squares[square] === 'X') {
        xCount++;
      } else if (squares[square] === 'O') {
        oCount++;
      }
    }

    if (xCount === 5) {
      return line; 
    } else if (oCount === 5) {
      return line; 
    }
  }

  return null; 
}
