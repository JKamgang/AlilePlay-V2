
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const Game2048: React.FC<{ game: Game; options: any }> = ({ game }) => {
  const { t } = useApp();
  const [grid, setGrid] = useState<(number | null)[][]>(
    Array(4).fill(null).map(() => Array(4).fill(null))
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  // Touch Handling References
  const touchStart = useRef<{ x: number, y: number } | null>(null);
  const minSwipeDistance = 30;

  const addRandomTile = useCallback((currentGrid: (number | null)[][]) => {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === null) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return currentGrid;

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  }, []);

  const initializeGame = useCallback(() => {
    let newGrid = Array(4).fill(null).map(() => Array(4).fill(null));
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  }, [addRandomTile]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const move = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (gameOver) return;

    let hasChanged = false;
    let newScore = score;
    let newGrid = grid.map(row => [...row]);

    const rotateGrid = (g: (number | null)[][]) => {
      const rotated = Array(4).fill(null).map(() => Array(4).fill(null));
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          rotated[c][3 - r] = g[r][c];
        }
      }
      return rotated;
    };

    const slideAndMerge = (row: (number | null)[]) => {
      let filtered = row.filter(val => val !== null);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] = (filtered[i] as number) * 2;
          newScore += filtered[i] as number;
          filtered.splice(i + 1, 1);
          hasChanged = true;
        }
      }
      while (filtered.length < 4) filtered.push(null);
      return filtered;
    };

    if (direction === 'UP') newGrid = rotateGrid(rotateGrid(rotateGrid(newGrid)));
    if (direction === 'RIGHT') newGrid = rotateGrid(rotateGrid(newGrid));
    if (direction === 'DOWN') newGrid = rotateGrid(newGrid);

    const processedGrid = newGrid.map(row => {
      const original = [...row];
      const merged = slideAndMerge(row);
      if (JSON.stringify(original) !== JSON.stringify(merged)) hasChanged = true;
      return merged;
    });

    if (direction === 'UP') newGrid = rotateGrid(processedGrid);
    else if (direction === 'RIGHT') newGrid = rotateGrid(rotateGrid(processedGrid));
    else if (direction === 'DOWN') newGrid = rotateGrid(rotateGrid(rotateGrid(processedGrid)));
    else newGrid = processedGrid;

    if (hasChanged) {
      const gridWithNewTile = addRandomTile(newGrid);
      setGrid(gridWithNewTile);
      setScore(newScore);
      
      let canMove = false;
      for(let r=0; r<4; r++) {
        for(let c=0; c<4; c++) {
          if (gridWithNewTile[r][c] === null) canMove = true;
          if (c < 3 && gridWithNewTile[r][c] === gridWithNewTile[r][c+1]) canMove = true;
          if (r < 3 && gridWithNewTile[r][c] === gridWithNewTile[r+1][c]) canMove = true;
        }
      }
      if (!canMove) setGameOver(true);
    }
  }, [grid, score, gameOver, addRandomTile]);

  // Touch Event Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const dx = touchEnd.x - touchStart.current.x;
    const dy = touchEnd.y - touchStart.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minSwipeDistance) {
        move(dx > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(dy) > minSwipeDistance) {
        move(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStart.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w'].includes(e.key)) move('UP');
      if (['ArrowDown', 's'].includes(e.key)) move('DOWN');
      if (['ArrowLeft', 'a'].includes(e.key)) move('LEFT');
      if (['ArrowRight', 'd'].includes(e.key)) move('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const getTileColor = (val: number | null) => {
    if (!val) return 'bg-gray-200 dark:bg-gray-800';
    const colors: Record<number, string> = {
      2: 'bg-stone-200 text-stone-800',
      4: 'bg-stone-100 text-stone-800',
      8: 'bg-orange-200 text-stone-800',
      16: 'bg-orange-300 text-white',
      32: 'bg-orange-400 text-white',
      64: 'bg-orange-500 text-white',
      128: 'bg-yellow-200 text-stone-800 shadow-lg',
      256: 'bg-yellow-300 text-stone-800 shadow-lg',
      512: 'bg-yellow-400 text-white shadow-lg',
      1024: 'bg-yellow-500 text-white shadow-lg',
      2048: 'bg-yellow-600 text-white shadow-xl scale-105',
    };
    return colors[val] || 'bg-stone-900 text-white';
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto p-6 bg-light-surface dark:bg-dark-surface rounded-3xl shadow-2xl">
      <div className="w-full flex justify-between items-center mb-6">
        <div>
          <h2 className="text-4xl font-black text-brand-primary tracking-tighter uppercase">2048</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('puzzle')}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 px-6 py-2 rounded-2xl text-center shadow-inner">
          <p className="text-[10px] text-gray-400 font-bold uppercase">{t('score')}</p>
          <p className="text-2xl font-black text-brand-primary">{score}</p>
        </div>
      </div>

      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative bg-gray-300 dark:bg-gray-700 p-3 rounded-2xl grid grid-cols-4 gap-3 w-80 h-80 shadow-inner overflow-hidden touch-none"
      >
        {grid.flat().map((val, i) => (
          <div
            key={i}
            className={`w-16 h-16 flex items-center justify-center text-2xl font-black rounded-xl transition-all duration-150 transform ${getTileColor(val)}`}
          >
            {val}
          </div>
        ))}
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center animate-fade-in backdrop-blur-md">
            <h3 className="text-white text-3xl font-black mb-4 uppercase tracking-tighter">{t('game_over')}</h3>
            <button
              onClick={initializeGame}
              className="bg-brand-primary text-white px-10 py-3 rounded-xl font-black shadow-lg hover:bg-brand-secondary transition-all transform active:scale-95 uppercase tracking-widest"
            >
              {t('play_again')}
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4 w-full">
         <button onClick={initializeGame} className="flex-grow py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {t('reset_board')}
         </button>
      </div>
      
      <p className="mt-6 text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest leading-relaxed">
        Swipe or use Arrow Keys to merge tiles. <br/>Reach 2048 to win!
      </p>
    </div>
  );
};

export default Game2048;
