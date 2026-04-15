
import React, { useState, useEffect } from 'react';
import type { Game, GameOption } from '@/shared/types';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';

interface TicTacToeGameProps {
  game: Game;
  options?: GameOption[];
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

type Player = 'X' | 'O' | null;

const EMPTY_BOARD: Player[] = Array(9).fill(null);

const TicTacToeGame: React.FC<TicTacToeGameProps> = ({ game, t }) => {
  const [board, setBoard] = useState<Player[]>(EMPTY_BOARD);
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
  };

  useEffect(() => {
    if (!isXNext && !winner) {
      const timeout = setTimeout(() => {
        const emptySquares = board.map((sq, idx) => sq === null ? idx : -1).filter(idx => idx !== -1);
        if (emptySquares.length > 0) {
          const aiMove = emptySquares[Math.floor(Math.random() * emptySquares.length)];
          const newBoard = board.slice();
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isXNext, board, winner]);

  const renderSquare = (i: number) => {
    return (
      <button
        key={i}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-light-surface dark:bg-dark-surface border-2 border-brand-secondary flex items-center justify-center text-4xl md:text-5xl font-bold rounded-md transition-colors duration-200 hover:bg-brand-primary/20"
        onClick={() => handleClick(i)}
      >
        <span className={`${board[i] === 'X' ? 'text-blue-500' : 'text-red-500'}`}>{board[i]}</span>
      </button>
    );
  };

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (board.every(Boolean)) {
    status = 'Draw!';
  } else {
    status = `Next player: ${isXNext ? 'X' : 'O'}`;
  }

  return (
    <div className="flex flex-col items-center p-4 text-white">
      <h2 className="text-3xl font-bold mb-4">{game.nameKey ? t(game.nameKey) : 'Tic Tac Toe'}</h2>
      <div className="text-xl mb-4 font-semibold">{status}</div>
      <div className="grid grid-cols-3 gap-2">
        {EMPTY_BOARD.map((_, i) => renderSquare(i))}
      </div>
      <button
        onClick={() => {
          setBoard(EMPTY_BOARD);
          setIsXNext(true);
        }}
        className="mt-6 px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors"
      >
        New Game
      </button>
    </div>
  );
};

function calculateWinner(squares: Player[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default TicTacToeGame;
