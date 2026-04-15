
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const COLS = 10;
const ROWS = 20;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
  O: [[1, 1], [1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  T: [[0, 1, 0], [1, 1, 1]],
  Z: [[1, 1, 0], [0, 1, 1]],
};

const COLORS: Record<string, string> = {
  I: 'bg-cyan-400',
  J: 'bg-blue-500',
  L: 'bg-orange-400',
  O: 'bg-yellow-400',
  S: 'bg-green-500',
  T: 'bg-purple-500',
  Z: 'bg-red-500',
};

const TetrisGame: React.FC<{ game: Game; options: any }> = ({ game }) => {
  const { t } = useApp();
  const [board, setBoard] = useState<(string | null)[][]>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    type: string;
    pos: { r: number; c: number };
  } | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const spawnPiece = useCallback(() => {
    const types = Object.keys(SHAPES);
    const type = types[Math.floor(Math.random() * types.length)] as keyof typeof SHAPES;
    const shape = SHAPES[type];
    const newPiece = {
      shape,
      type,
      pos: { r: 0, c: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2) },
    };

    // Check collision on spawn
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] && board[newPiece.pos.r + r][newPiece.pos.c + c]) {
          setGameOver(true);
          return null;
        }
      }
    }
    return newPiece;
  }, [board]);

  const resetGame = useCallback(() => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    const first = {
        shape: SHAPES['T'],
        type: 'T',
        pos: { r: 0, c: 4 },
      };
    setCurrentPiece(first);
  }, []);

  const checkCollision = useCallback((pos: { r: number; c: number }, shape: number[][]) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newR = pos.r + r;
          const newC = pos.c + c;
          if (newR >= ROWS || newC < 0 || newC >= COLS || (newR >= 0 && board[newR][newC])) {
            return true;
          }
        }
      }
    }
    return false;
  }, [board]);

  const mergePiece = useCallback(() => {
    if (!currentPiece) return;
    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          const targetR = currentPiece.pos.r + r;
          const targetC = currentPiece.pos.c + c;
          if (targetR >= 0 && targetR < ROWS) {
            newBoard[targetR][targetC] = currentPiece.type;
          }
        }
      });
    });

    // Clear lines
    let linesCleared = 0;
    const filteredBoard = newBoard.filter(row => {
      const isFull = row.every(cell => cell !== null);
      if (isFull) linesCleared++;
      return !isFull;
    });

    while (filteredBoard.length < ROWS) {
      filteredBoard.unshift(Array(COLS).fill(null));
    }

    setBoard(filteredBoard);
    setScore(prev => prev + [0, 100, 300, 500, 800][linesCleared]);
    setCurrentPiece(spawnPiece());
  }, [board, currentPiece, spawnPiece]);

  const moveDown = useCallback(() => {
    if (gameOver || isPaused || !currentPiece) return;
    const nextPos = { ...currentPiece.pos, r: currentPiece.pos.r + 1 };
    if (!checkCollision(nextPos, currentPiece.shape)) {
      setCurrentPiece({ ...currentPiece, pos: nextPos });
    } else {
      mergePiece();
    }
  }, [currentPiece, gameOver, isPaused, checkCollision, mergePiece]);

  const moveSide = useCallback((dir: number) => {
    if (gameOver || isPaused || !currentPiece) return;
    const nextPos = { ...currentPiece.pos, c: currentPiece.pos.c + dir };
    if (!checkCollision(nextPos, currentPiece.shape)) {
      setCurrentPiece({ ...currentPiece, pos: nextPos });
    }
  }, [currentPiece, gameOver, isPaused, checkCollision]);

  const rotate = useCallback(() => {
    if (gameOver || isPaused || !currentPiece) return;
    const nextShape = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );
    if (!checkCollision(currentPiece.pos, nextShape)) {
      setCurrentPiece({ ...currentPiece, shape: nextShape });
    }
  }, [currentPiece, gameOver, isPaused, checkCollision]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      const interval = setInterval(moveDown, Math.max(100, 800 - (score / 10)));
      return () => clearInterval(interval);
    }
  }, [moveDown, gameOver, isPaused, score]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') moveSide(-1);
      if (e.key === 'ArrowRight') moveSide(1);
      if (e.key === 'ArrowDown') moveDown();
      if (e.key === 'ArrowUp') rotate();
      if (e.key === ' ') {
         e.preventDefault();
         // Hard drop
         if(!currentPiece) return;
         let tempPos = { ...currentPiece.pos };
         while(!checkCollision({...tempPos, r: tempPos.r + 1}, currentPiece.shape)) {
            tempPos.r += 1;
         }
         setCurrentPiece({...currentPiece, pos: tempPos});
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [moveSide, moveDown, rotate, currentPiece, checkCollision]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto p-4">
      <div className="bg-gray-900 p-2 rounded-xl shadow-2xl border-4 border-gray-800">
        <div className="grid grid-cols-10 gap-px bg-gray-800">
          {board.map((row, r) =>
            row.map((cell, c) => {
              let type = cell;
              if (currentPiece) {
                const pr = r - currentPiece.pos.r;
                const pc = c - currentPiece.pos.c;
                if (pr >= 0 && pr < currentPiece.shape.length && pc >= 0 && pc < currentPiece.shape[0].length) {
                  if (currentPiece.shape[pr][pc]) type = currentPiece.type;
                }
              }
              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${type ? COLORS[type] : 'bg-gray-900'} border border-black/10`}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6 w-full md:w-48">
        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl w-full text-center shadow-lg">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Score</p>
          <h4 className="text-3xl font-black text-brand-primary">{score}</h4>
        </div>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="w-full py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>

        <button
          onClick={resetGame}
          className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all active:scale-95"
        >
          New Game
        </button>

        {gameOver && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-center font-black animate-bounce">
            GAME OVER
          </div>
        )}

        <div className="text-[10px] text-gray-400 uppercase font-bold leading-tight text-center">
            Controls:<br/>Arrows to move & rotate<br/>Space for hard drop
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;
