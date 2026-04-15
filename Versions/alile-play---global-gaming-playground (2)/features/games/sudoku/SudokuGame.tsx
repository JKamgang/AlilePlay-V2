import React, { useState, useEffect, useMemo } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

// A very simple Sudoku generator/solver for demonstration.
// In a real app, you'd use a more robust library.
const generatePuzzle = (difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
  // A pre-defined solved puzzle
  const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  const puzzle = solution.map(row => row.slice());

  const empties: Record<string, number> = { easy: 35, medium: 45, hard: 55 };
  let count = empties[difficulty] || 45;

  while(count > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if(puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      count--;
    }
  }

  return { puzzle, solution };
};


interface SudokuGameProps {
  game: Game;
  options: { difficulty: 'easy' | 'medium' | 'hard' };
}

const SudokuGame: React.FC<SudokuGameProps> = ({ game, options }) => {
    const { t } = useApp();
    const [board, setBoard] = useState<number[][]>([]);
    const [solution, setSolution] = useState<number[][]>([]);
    const [initialBoard, setInitialBoard] = useState<number[][]>([]);
    const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
    const [isSolved, setIsSolved] = useState(false);

    const startNewGame = () => {
        const { puzzle, solution: sol } = generatePuzzle(options.difficulty);
        setBoard(puzzle.map(row => row.slice()));
        setInitialBoard(puzzle.map(row => row.slice()));
        setSolution(sol);
        setSelectedCell(null);
        setIsSolved(false);
    };

    useEffect(startNewGame, [options.difficulty]);

    const handleCellClick = (row: number, col: number) => {
        if(initialBoard[row][col] === 0) {
            setSelectedCell({ row, col });
        }
    };

    const checkSolution = useMemo(() => () => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if(board[i][j] !== solution[i][j]) return false;
            }
        }
        return true;
    }, [board, solution]);

    const handleNumberInput = (num: number) => {
        if (selectedCell) {
            const newBoard = board.map(row => row.slice());
            newBoard[selectedCell.row][selectedCell.col] = num;
            setBoard(newBoard);

            if(checkSolution()) {
                setIsSolved(true);
            }
        }
    };

    if (isSolved) {
        return (
            <div className="flex flex-col items-center p-4 text-center">
                <h2 className="text-3xl font-bold mb-4 text-green-500">{t('sudoku_congrats')}</h2>
                <p className="text-xl mb-6">{t('sudoku_solved')}</p>
                <button
                    onClick={startNewGame}
                    className="mt-6 px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors"
                >
                    {t('new_game')}
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-3xl font-bold mb-4">{t(game.nameKey)}</h2>
            <div className="grid grid-cols-9 gap-0 border-2 border-black dark:border-gray-400">
                {board.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                        const isInitial = initialBoard[rIdx][cIdx] !== 0;
                        const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
                        const borderRight = (cIdx + 1) % 3 === 0 && cIdx < 8 ? 'border-r-2 border-r-black dark:border-r-gray-400' : '';
                        const borderBottom = (rIdx + 1) % 3 === 0 && rIdx < 8 ? 'border-b-2 border-b-black dark:border-b-gray-400' : '';
                        return (
                            <div
                                key={`${rIdx}-${cIdx}`}
                                onClick={() => handleCellClick(rIdx, cIdx)}
                                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl font-mono border-gray-300 dark:border-gray-600 border-r border-b
                                ${isInitial ? 'bg-gray-200 dark:bg-gray-700 font-bold' : 'cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900'}
                                ${isSelected ? 'bg-blue-300 dark:bg-blue-700' : ''}
                                ${borderRight} ${borderBottom}
                                `}
                            >
                                {cell !== 0 ? cell : ''}
                            </div>
                        )
                    })
                )}
            </div>
            <div className="flex space-x-2 mt-4">
                {Array.from({length: 9}, (_, i) => i + 1).map(num => (
                    <button key={num} onClick={() => handleNumberInput(num)} className="w-10 h-10 sm:w-12 sm:h-12 bg-light-surface dark:bg-dark-surface rounded-md shadow-md text-xl font-bold hover:bg-brand-primary/20">{num}</button>
                ))}
                 <button onClick={() => handleNumberInput(0)} className="w-10 h-10 sm:w-12 sm:h-12 bg-red-200 dark:bg-red-800 rounded-md shadow-md text-xl font-bold hover:bg-red-300/50">X</button>
            </div>
             <button
                onClick={startNewGame}
                className="mt-6 px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors"
            >
                {t('reset_board')}
            </button>
        </div>
    );
};

export default SudokuGame;
