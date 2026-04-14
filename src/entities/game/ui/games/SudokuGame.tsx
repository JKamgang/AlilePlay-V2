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

      const checkGroup = (indices: number[]) => {
          const values = new Map<string, number[]>();
          indices.forEach(index => {
              const value = currentGrid[index];
              if (value) {
                  if (!values.has(value)) {
                      values.set(value, []);
                  }
                  values.get(value)!.push(index);
              }
          });

          for (const cells of values.values()) {
              if (cells.length > 1) {
                  cells.forEach(cellIndex => newConflicts.add(cellIndex));
              }
          }
      };

      for (let i = 0; i < size; i++) {
          checkGroup(Array.from({ length: size }, (_, k) => i * size + k)); // Rows
          checkGroup(Array.from({ length: size }, (_, k) => k * size + i)); // Columns
      }

      for (let boxRow = 0; boxRow < size; boxRow += subgridSize) {
          for (let boxCol = 0; boxCol < size; boxCol += subgridSize) {
              const indices: number[] = [];
              for (let r = 0; r < subgridSize; r++) {
                  for (let c = 0; c < subgridSize; c++) {
                      indices.push((boxRow + r) * size + (boxCol + c));
                  }
              }
              checkGroup(indices);
          }
      }
      setConflicts(newConflicts);
  }, [size, subgridSize]);

  useEffect(() => {
    validateGrid(grid);
  }, [grid, validateGrid]);

  const handleInputChange = (index: number, value: string) => {
    const newGrid = [...grid];
    const numValue = parseInt(value, 10);

    if (initialCells.has(index)) return;

    if (value === '' || (!isNaN(numValue) && numValue > 0 && numValue <= size)) {
        newGrid[index] = value === '' ? null : value;
        setGrid(newGrid);
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