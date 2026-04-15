
import React, { useState, useEffect, useCallback } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

type Difficulty = 'junior' | 'easy' | 'medium' | 'hard';

const generateSudokuPuzzle = (difficulty: Difficulty) => {
  const isJunior = difficulty === 'junior';
  const size = isJunior ? 4 : 9;
  const subSize = isJunior ? 2 : 3;

  // Static Seeded Grids to ensure "Mastery" quality
  const solution9 = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2], [6, 7, 2, 1, 9, 5, 3, 4, 8], [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3], [4, 2, 6, 8, 5, 3, 7, 9, 1], [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4], [2, 8, 7, 4, 1, 9, 6, 3, 5], [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  const solution4 = [
    [1, 2, 3, 4], [3, 4, 1, 2], [2, 3, 4, 1], [4, 1, 2, 3]
  ];

  const baseSolution = isJunior ? solution4 : solution9;

  // Complexity scaling: percentage of cells revealed
  const revealProb = {
    'junior': 0.6,
    'easy': 0.5,
    'medium': 0.35,
    'hard': 0.22
  }[difficulty] || 0.4;

  const puzzle = baseSolution.map(row => row.map(cell => (Math.random() < revealProb ? cell : 0)));

  return { puzzle, size, subSize };
};

const SudokuGame: React.FC<{ game: Game; options: { difficulty: Difficulty } }> = ({ game, options }) => {
  const { t } = useApp();
  const [board, setBoard] = useState<number[][]>([]);
  const [initial, setInitial] = useState<number[][]>([]);
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [gridSize, setGridSize] = useState(9);
  const [subSize, setSubSize] = useState(3);

  const init = useCallback(() => {
    const { puzzle, size, subSize: sub } = generateSudokuPuzzle(options.difficulty);
    setBoard(puzzle.map(r => [...r]));
    setInitial(puzzle.map(r => [...r]));
    setGridSize(size);
    setSubSize(sub);
    setSelected(null);
  }, [options.difficulty]);

  useEffect(() => {
    init();
  }, [init]);

  const handleInput = (val: number) => {
    if (!selected) return;
    const newBoard = board.map(r => [...r]);
    newBoard[selected.r][selected.c] = val;
    setBoard(newBoard);
  };

  const isJunior = options.difficulty === 'junior';

  return (
    <div className={`flex flex-col items-center p-10 bg-white dark:bg-zinc-950 rounded-[40px] shadow-2xl mx-auto border border-gray-100 dark:border-zinc-800 transition-all duration-700 ${isJunior ? 'max-w-md' : 'max-w-2xl'}`}>
        <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-brand-primary uppercase tracking-tighter drop-shadow-sm">{t(game.nameKey)}</h2>
            <div className="flex gap-2 justify-center mt-3">
                <span className="px-4 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest">{t(options.difficulty)}</span>
                <span className="px-4 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">V22.5 Engine</span>
            </div>
        </div>

        <div className={`grid bg-gray-200 dark:bg-zinc-800 gap-[1px] border-[6px] border-gray-300 dark:border-zinc-900 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500`}
             style={{
               gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
               width: isJunior ? '280px' : '480px'
             }}>
            {board.map((row, r) => row.map((cell, c) => {
                const isInit = initial[r]?.[c] !== 0;
                const isSel = selected?.r === r && selected?.c === c;
                const isSameGroup = selected &&
                    (Math.floor(selected.r / subSize) === Math.floor(r / subSize) &&
                     Math.floor(selected.c / subSize) === Math.floor(c / subSize));

                const isRightEdge = (c + 1) % subSize === 0 && c < gridSize - 1;
                const isBottomEdge = (r + 1) % subSize === 0 && r < gridSize - 1;

                return (
                    <div
                        key={`${r}-${c}`}
                        onClick={() => !isInit && setSelected({ r, c })}
                        className={`
                            aspect-square flex items-center justify-center font-mono cursor-pointer transition-all duration-200
                            ${isJunior ? 'text-4xl' : 'text-2xl'}
                            ${isInit
                                ? 'bg-gray-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-400 font-black'
                                : 'bg-white dark:bg-zinc-950 text-brand-primary hover:bg-brand-primary/5'}
                            ${isSel ? 'bg-brand-primary/20 ring-4 ring-brand-primary/30 z-10' : ''}
                            ${!isSel && isSameGroup ? 'bg-brand-primary/5' : ''}
                            ${isRightEdge ? 'border-r-2 border-gray-400 dark:border-zinc-800' : ''}
                            ${isBottomEdge ? 'border-b-2 border-gray-400 dark:border-zinc-800' : ''}
                        `}
                    >
                        {cell !== 0 ? cell : ''}
                    </div>
                );
            }))}
        </div>

        <div className={`grid ${isJunior ? 'grid-cols-4' : 'grid-cols-5'} gap-3 mt-12 w-full`}>
            {(isJunior ? [1, 2, 3, 4] : [1, 2, 3, 4, 5, 6, 7, 8, 9]).map(n => (
                <button
                  key={n}
                  onClick={() => handleInput(n)}
                  className="py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl font-black text-2xl hover:bg-brand-primary hover:text-white transition-all transform active:scale-90 shadow-sm"
                >
                    {n}
                </button>
            ))}
            <button
              onClick={() => handleInput(0)}
              className={`py-4 bg-red-500/5 text-red-500 border border-red-500/10 rounded-2xl font-black uppercase tracking-tighter text-sm hover:bg-red-500 hover:text-white transition-all shadow-md ${isJunior ? 'col-span-4' : 'col-span-5'}`}
            >
                Purge Cell
            </button>
        </div>

        <div className="mt-12 w-full flex gap-4">
            <button onClick={init} className="flex-1 px-10 py-4 bg-brand-primary text-white font-black rounded-2xl shadow-xl hover:bg-brand-secondary transition-all transform hover:-translate-y-1 uppercase tracking-widest text-xs">
                {t('new_game')}
            </button>
        </div>

        <p className="mt-8 text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] text-center leading-relaxed">
            Logic Engine Refined: Snapshot v22.5<br/>Jean Baptiste • Platform Architect
        </p>
    </div>
  );
};

export default SudokuGame;
