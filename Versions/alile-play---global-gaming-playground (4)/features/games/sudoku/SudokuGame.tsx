
import React, { useState, useEffect, useCallback } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

type Difficulty = 'junior' | 'easy' | 'medium' | 'hard';

const generatePuzzle = (difficulty: Difficulty) => {
  const isJunior = difficulty === 'junior';
  const size = isJunior ? 4 : 9;
  const subSize = isJunior ? 2 : 3;

  const solution9 = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2], [6, 7, 2, 1, 9, 5, 3, 4, 8], [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3], [4, 2, 6, 8, 5, 3, 7, 9, 1], [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4], [2, 8, 7, 4, 1, 9, 6, 3, 5], [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  const solution4 = [
    [1, 2, 3, 4], [3, 4, 1, 2], [2, 3, 4, 1], [4, 1, 2, 3]
  ];

  const baseSolution = isJunior ? solution4 : solution9;
  const puzzle = baseSolution.map(row => [...row]);
  
  const counts: Record<Difficulty, number> = { junior: 4, easy: 30, medium: 45, hard: 55 };
  let count = isJunior ? 4 : counts[difficulty];
  
  while(count > 0) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    if (puzzle[r][c] !== 0) { 
      puzzle[r][c] = 0; 
      count--; 
    }
  }
  return { puzzle, solution: baseSolution, size, subSize };
};

const SudokuGame: React.FC<{ game: Game; options: { difficulty: Difficulty } }> = ({ game, options }) => {
  const { t } = useApp();
  const [board, setBoard] = useState<number[][]>([]);
  const [initial, setInitial] = useState<number[][]>([]);
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [gridSize, setGridSize] = useState(9);
  const [subSize, setSubSize] = useState(3);

  const init = useCallback(() => {
    const { puzzle, size, subSize: sub } = generatePuzzle(options.difficulty);
    setBoard(puzzle.map(r => [...r]));
    setInitial(puzzle.map(r => [...r]));
    setGridSize(size);
    setSubSize(sub);
    setSelected(null);
  }, [options.difficulty]);

  useEffect(init, [init]);

  const handleInput = (val: number) => {
    if (!selected) return;
    const newBoard = board.map(r => [...r]);
    newBoard[selected.r][selected.c] = val;
    setBoard(newBoard);
  };

  const isJunior = options.difficulty === 'junior';

  return (
    <div className={`flex flex-col items-center p-6 bg-light-surface dark:bg-dark-surface rounded-3xl shadow-xl mx-auto transition-all duration-500 ${isJunior ? 'max-w-md' : 'max-w-xl'}`}>
        <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-brand-primary uppercase tracking-tighter">{t(game.nameKey)}</h2>
            <div className="inline-block px-3 py-1 bg-brand-primary/10 rounded-full">
                <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{t(options.difficulty)}</p>
            </div>
        </div>

        <div className={`grid bg-stone-800 gap-[2px] border-4 border-stone-800 rounded-lg overflow-hidden shadow-2xl`} 
             style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {board.map((row, r) => row.map((cell, c) => {
                const isInit = initial[r]?.[c] !== 0;
                const isSel = selected?.r === r && selected?.c === c;
                const isRightEdge = (c + 1) % subSize === 0 && c < gridSize - 1;
                const isBottomEdge = (r + 1) % subSize === 0 && r < gridSize - 1;
                
                return (
                    <div
                        key={`${r}-${c}`}
                        onClick={() => !isInit && setSelected({ r, c })}
                        className={`
                            aspect-square flex items-center justify-center font-mono cursor-pointer transition-all
                            ${isJunior ? 'w-16 sm:w-20 text-4xl' : 'w-8 sm:w-12 text-xl'}
                            ${isInit ? 'bg-stone-200 text-stone-900 font-bold' : 'bg-white text-brand-primary hover:bg-brand-primary/10'}
                            ${isSel ? 'bg-brand-primary/30 ring-4 ring-brand-primary/50 ring-inset' : ''}
                            ${isRightEdge ? 'border-r-4 border-stone-800' : ''}
                            ${isBottomEdge ? 'border-b-4 border-stone-800' : ''}
                        `}
                    >
                        {cell !== 0 ? cell : ''}
                    </div>
                );
            }))}
        </div>

        <div className={`grid ${isJunior ? 'grid-cols-4' : 'grid-cols-5'} gap-3 mt-8 w-full`}>
            {(isJunior ? [1, 2, 3, 4] : [1, 2, 3, 4, 5, 6, 7, 8, 9]).map(n => (
                <button 
                  key={n} 
                  onClick={() => handleInput(n)} 
                  className="py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-black text-xl hover:bg-brand-primary hover:text-white transition-all transform active:scale-95 shadow-md"
                >
                    {n}
                </button>
            ))}
            <button 
              onClick={() => handleInput(0)} 
              className={`py-4 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase tracking-tighter text-sm hover:bg-red-500 hover:text-white transition-all shadow-md ${isJunior ? 'col-span-4' : 'col-span-5'}`}
            >
                {t('reset_board')}
            </button>
        </div>

        <button onClick={init} className="mt-8 px-10 py-4 bg-brand-primary text-white font-black rounded-2xl shadow-xl hover:bg-brand-secondary transition-all transform hover:-translate-y-1">
            {t('new_game')}
        </button>
        
        {isJunior && (
          <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
            Buford Ed-Tech Protocol: 4x4 logic training enabled for elementary levels.
          </p>
        )}
    </div>
  );
};

export default SudokuGame;
