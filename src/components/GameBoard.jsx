import React, { useState } from 'react';
import { generateBoard } from '../utils/boardUtils';
import './GameBoard.css';

const BOARD_SIZE = 6;

export default function GameBoard() {
  const [board, setBoard] = useState(() => generateBoard(BOARD_SIZE));
  const [selected, setSelected] = useState(null);

  const handleClick = (rowIdx, colIdx) => {
    const clicked = { row: rowIdx, col: colIdx };

    if (!selected) {
      setSelected(clicked);
      return;
    }

    if (isAdjacent(selected, clicked)) {
      const newBoard = [...board.map(row => [...row])];

      const temp = newBoard[selected.row][selected.col];
      newBoard[selected.row][selected.col] = newBoard[clicked.row][clicked.col];
      newBoard[clicked.row][clicked.col] = temp;

      // Проверка совпадений — пока отключено, можно включить позже
      const matched = findMatches(newBoard);
      if (matched.size > 0) {
        matched.forEach(key => {
          const [r, c] = key.split('-').map(Number);
          newBoard[r][c] = null;
        });
      }

      setBoard(newBoard);
    }

    setSelected(null);
  };

  const isAdjacent = (a, b) => {
    const dx = Math.abs(a.col - b.col);
    const dy = Math.abs(a.row - b.row);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((cell, colIndex) => {
            const isSelected = selected?.row === rowIndex && selected?.col === colIndex;

            return (
              <div
                key={cell?.id || `${rowIndex}-${colIndex}`}
                className={`cell ${isSelected ? 'selected' : ''}`}
                style={{ backgroundColor: cell?.color || 'transparent' }}
                onClick={() => handleClick(rowIndex, colIndex)}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Вне компонента!
function findMatches(board) {
  const matches = new Set();

  const height = board.length;
  const width = board[0].length;

  // горизонтали
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width - 2; col++) {
      const a = board[row][col];
      const b = board[row][col + 1];
      const c = board[row][col + 2];
      if (a && b && c && a.color === b.color && b.color === c.color) {
        matches.add(`${row}-${col}`);
        matches.add(`${row}-${col + 1}`);
        matches.add(`${row}-${col + 2}`);
      }
    }
  }

  // вертикали
  for (let col = 0; col < width; col++) {
    for (let row = 0; row < height - 2; row++) {
      const a = board[row][col];
      const b = board[row + 1][col];
      const c = board[row + 2][col];
      if (a && b && c && a.color === b.color && b.color === c.color) {
        matches.add(`${row}-${col}`);
        matches.add(`${row + 1}-${col}`);
        matches.add(`${row + 2}-${col}`);
      }
    }
  }

  return matches;
}
