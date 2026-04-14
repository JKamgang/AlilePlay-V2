import React, { useState, useMemo, useEffect } from 'react';
import { TRANSLATIONS } from '../../constants';

interface SudokuGameProps {
  options: string;
  t: (key: keyof typeof TRANSLATIONS | string) => string;
}

// --- Pre-defined Puzzles ---
const PUZZLES = {
    '9x9_easy': {
        puzzle: '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',
        solution: '534678912672195348198342567859761423426853791713924856961537284287419635345286179'
    }
    // In a real app, add more puzzles for medium, hard, and 16x16
};

const getPuzzle = (option: string) => {
    // Default to easy 9x9 if the selected option doesn't have a puzzle yet
    const puzzleData = PUZZLES[option as keyof typeof PUZZLES] || PUZZLES['9x9_easy'];
    return {
        initial: puzzleData.puzzle.split('').map(c => c === '.' ? null : c),
        solution: puzzleData.solution.split('')
    }
};


const SudokuGame: React.FC<SudokuGameProps> = ({ options, t }) => {
  const size = options.startsWith('16x16') ? 16 : 9;
  
  const { initial, solution } = useMemo(() => getPuzzle(options), [options]);
  
  const [grid, setGrid] = useState<(string | null)[]>(initial);
  const [conflicts, setConflicts] = useState<Set<number>>(new Set());
  const [initialCells] = useState(() => new Set(initial.map((val, idx) => val ? idx : -1)));

  const subgridSize = Math.sqrt(size);

  useEffect(() => {
    validateGrid(grid);
  }, [grid]);

  const validateGrid = (currentGrid: (string | null)[]) => {
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
          // Rows
          checkGroup(Array.from({ length: size }, (_, k) => i * size + k));
          // Columns
          checkGroup(Array.from({ length: size }, (_, k) => k * size + i));
      }

      // Subgrids
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
  };

  const handleInputChange = (index: number, value: string) => {
    const newGrid = [...grid];
    const numValue = parseInt(value, 10);

    if (initialCells.has(index)) return; // Don't change initial cells

    if (value === '' || (numValue > 0 && numValue <= size)) {
        newGrid[index] = value === '' ? null : value;
        setGrid(newGrid);
    }
  };
  
  const gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;
  const fontSize = size === 16 ? 'text-xs sm:text-sm' : 'text-base sm:text-xl';
  const inputSize = size === 16 ? 'p-1' : 'p-2';

  return (
    <div className="flex flex-col items-center justify-center h-full text-white animate-fade-in p-2 sm:p-4">
        <div className="w-full max-w-lg aspect-square">
            <div className="grid border-2 border-gray-500 rounded-md" style={{ gridTemplateColumns }}>
            {grid.map((cell, index) => {
                const row = Math.floor(index / size);
                const col = index % size;
                const isThickRight = (col + 1) % subgridSize === 0 && col < size - 1;
                const isThickBottom = (row + 1) % subgridSize === 0 && row < size - 1;
                const isInitial = initialCells.has(index);
                const isConflict = conflicts.has(index);

                const borderClasses = `
                    ${isThickRight ? 'border-r-2 border-r-gray-500' : ''}
                    ${isThickBottom ? 'border-b-2 border-b-gray-500' : ''}
                `;
                
                const textClasses = isConflict ? 'text-red-500' : (isInitial ? 'text-gray-400' : 'text-cyan-400');

                return (
                <div key={index} className={`aspect-square flex items-center justify-center bg-gray-800 ${borderClasses}`}>
                    <input
                        type="text"
                        maxLength={size > 9 ? 2 : 1}
                        value={cell || ''}
                        readOnly={isInitial}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className={`w-full h-full text-center bg-transparent font-bold ${fontSize} ${inputSize} ${textClasses} focus:bg-brand-primary/20 focus:outline-none ${isInitial ? 'cursor-not-allowed' : ''}`}
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