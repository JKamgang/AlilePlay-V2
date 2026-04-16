import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { PUZZLES } from '@/shared/constants';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';

interface SudokuGameProps {
  options: string;
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

const getPuzzle = (option: string) => {
    const puzzleData = PUZZLES[option as keyof typeof PUZZLES] || PUZZLES['9x9_easy'];
    return {
        initial: puzzleData.puzzle.split('').map(c => c === '.' ? null : c),
    }
};


const SudokuGame: React.FC<SudokuGameProps> = ({ options, t }) => {
  const size = 9; // For now, only 9x9 is supported

  const { initial } = useMemo(() => getPuzzle(options), [options]);

  const [grid, setGrid] = useState<(string | null)[]>(initial);
  const [conflicts, setConflicts] = useState<Set<number>>(new Set());
  const [initialCells] = useState(() => new Set(initial.map((val, idx) => val ? idx : -1)));

  const subgridSize = Math.sqrt(size);

  const validateGrid = useCallback((currentGrid: (string | null)[]) => {
      const newConflicts = new Set<number>();

      const totalCells = size * size;

      const rowSeen: Record<string, number>[] = Array.from({ length: size }, () => ({}));
      const colSeen: Record<string, number>[] = Array.from({ length: size }, () => ({}));
      const boxSeen: Record<string, number>[] = Array.from({ length: size }, () => ({}));

      for (let i = 0; i < totalCells; i++) {
          const val = currentGrid[i];
          if (val) {
              const row = Math.floor(i / size);
              const col = i % size;
              const box = Math.floor(row / subgridSize) * subgridSize + Math.floor(col / subgridSize);

              const rowDict = rowSeen[row];
              if (rowDict[val] !== undefined) {
                  newConflicts.add(rowDict[val]);
                  newConflicts.add(i);
              } else {
                  rowDict[val] = i;
              }

              const colDict = colSeen[col];
              if (colDict[val] !== undefined) {
                  newConflicts.add(colDict[val]);
                  newConflicts.add(i);
              } else {
                  colDict[val] = i;
              }

              const boxDict = boxSeen[box];
              if (boxDict[val] !== undefined) {
                  newConflicts.add(boxDict[val]);
                  newConflicts.add(i);
              } else {
                  boxDict[val] = i;
              }
          }
      }
      setConflicts(newConflicts);
  }, [size, subgridSize]);

  useEffect(() => {
    // We defer the initial validation to after the initial render to avoid setting state synchronously inside an effect
    // But honestly we could just calculate conflicts synchronously without setting state.
    const timeoutId = setTimeout(() => {
        validateGrid(initial);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [initial, validateGrid]);

  const handleInputChange = (index: number, value: string) => {
    const newGrid = [...grid];
    const numValue = parseInt(value, 10);

    if (initialCells.has(index)) return;

    if (value === '' || (!isNaN(numValue) && numValue > 0 && numValue <= size)) {
        newGrid[index] = value === '' ? null : value;
        setGrid(newGrid);
        validateGrid(newGrid);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-white animate-fade-in p-2 sm:p-4">
        <div className="w-full max-w-lg aspect-square">
            <div className="grid grid-cols-9 border-2 border-gray-500 rounded-md">
            {grid.map((cell, index) => {
                const row = Math.floor(index / size);
                const col = index % size;
                const isThickRight = (col + 1) % subgridSize === 0 && col < size - 1;
                const isThickBottom = (row + 1) % subgridSize === 0 && row < size - 1;
                const isInitial = initialCells.has(index);
                const isConflict = conflicts.has(index);

                const borderClasses = `
                    ${isThickRight ? 'border-r-2 border-r-gray-500' : 'border-r border-r-gray-700'}
                    ${isThickBottom ? 'border-b-2 border-b-gray-500' : 'border-b border-b-gray-700'}
                `;

                const textClasses = isConflict ? 'text-red-500' : (isInitial ? 'text-gray-400' : 'text-cyan-400');

                return (
                <div key={index} className={`aspect-square flex items-center justify-center bg-gray-800 ${borderClasses}`}>
                    <input
                        type="text"
                        maxLength={1}
                        value={cell || ''}
                        readOnly={isInitial}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className={`w-full h-full text-center bg-transparent font-bold text-base sm:text-xl p-2 ${textClasses} focus:bg-brand-primary/20 focus:outline-none ${isInitial ? 'cursor-not--allowed' : ''}`}
                    />
                </div>
                );
            })}
            </div>
        </div>
         <p className="mt-4 text-gray-400 text-sm sm:text-base text-center">{t('sudoku_instructions')}</p>
         {conflicts.size > 0 && <p className="mt-2 text-red-400 animate-pulse">{t('sudoku_error')}</p>}
    </div>
  );
};

export default SudokuGame;