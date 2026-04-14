
import React, { useState, useEffect, useCallback } from 'react';
import type { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

type Color = 'red' | 'blue' | 'green' | 'yellow';

interface Token {
  id: number;
  color: Color;
  position: number | 'home' | 'base';
}

const LudoGame: React.FC<{ game: Game; options: any }> = ({ game }) => {
  const { t } = useApp();
  const [tokens, setTokens] = useState<Token[]>(() => {
    const initial: Token[] = [];
    (['red', 'blue', 'green', 'yellow'] as Color[]).forEach((color, ci) => {
      for (let i = 0; i < 4; i++) {
        initial.push({ id: ci * 4 + i, color, position: 'base' });
      }
    });
    return initial;
  });

  const [currentPlayer, setCurrentPlayer] = useState<Color>('red');
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [canRoll, setCanRoll] = useState(true);

  const nextTurn = useCallback(() => {
    const sequence: Color[] = ['red', 'green', 'yellow', 'blue'];
    const idx = sequence.indexOf(currentPlayer);
    setCurrentPlayer(sequence[(idx + 1) % 4]);
    setDiceRoll(null);
    setCanRoll(true);
  }, [currentPlayer]);

  const moveToken = (tokenId: number) => {
    if (canRoll || !diceRoll) return;
    const token = tokens.find(t => t.id === tokenId);
    if (!token || token.color !== currentPlayer) return;

    let nextPos: number | 'home' | 'base' = token.position;

    // Logic: Requires a 6 to exit base
    if (token.position === 'base') {
        if (diceRoll === 6) nextPos = 0;
        else return; 
    } else if (typeof token.position === 'number') {
        const target = token.position + diceRoll;
        if (target === 57) nextPos = 'home';
        else if (target < 57) nextPos = target;
        else return;
    }

    setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, position: nextPos } : t));
    
    if (diceRoll !== 6) setTimeout(nextTurn, 500);
    else { setDiceRoll(null); setCanRoll(true); }
  };

  const rollDice = () => {
    if (!canRoll || isRolling) return;
    setIsRolling(true);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceRoll(roll);
      setIsRolling(false);
      setCanRoll(false);
      
      const pTokens = tokens.filter(t => t.color === currentPlayer);
      const possible = pTokens.some(t => {
          if (t.position === 'base') return roll === 6;
          if (t.position === 'home') return false;
          const currentPos = t.position as number;
          return currentPos + roll <= 57;
      });
      if (!possible) setTimeout(nextTurn, 1000);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-light-surface dark:bg-dark-surface rounded-3xl shadow-2xl max-w-2xl mx-auto border-4 border-brand-primary/10">
        <div className="w-full flex justify-between items-center mb-8 bg-black/5 dark:bg-white/5 p-6 rounded-3xl border border-black/5 dark:border-white/5">
            <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full shadow-lg ${
                    currentPlayer === 'red' ? 'bg-red-500' :
                    currentPlayer === 'blue' ? 'bg-blue-500' :
                    currentPlayer === 'green' ? 'bg-green-500' :
                    'bg-yellow-500'
                }`} />
                <span className="font-black text-2xl uppercase tracking-tighter">{t(currentPlayer)}</span>
            </div>
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 flex items-center justify-center bg-white dark:bg-gray-900 border-4 border-brand-primary rounded-2xl text-3xl font-black shadow-inner">
                    {isRolling ? '...' : diceRoll || '-'}
                </div>
                <button onClick={rollDice} disabled={!canRoll || isRolling} className="bg-brand-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary disabled:opacity-50 transition-all transform active:scale-95">
                    Roll
                </button>
            </div>
        </div>

        {/* Improved Ludo Board with Track Clarity */}
        <div className="relative w-full max-w-sm aspect-square bg-gray-50 dark:bg-gray-800 border-8 border-gray-100 dark:border-gray-900 grid grid-cols-15 grid-rows-15 shadow-2xl rounded-xl overflow-hidden">
            {/* Base Zones */}
            <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-red-500/10 border-r-4 border-b-4 border-red-500 flex flex-wrap p-4 gap-2 justify-center items-center">
                {tokens.filter(t => t.color === 'red' && t.position === 'base').map(t => (
                    <div key={t.id} onClick={() => moveToken(t.id)} className={`w-10 h-10 rounded-full bg-red-500 border-4 border-white shadow-xl cursor-pointer hover:scale-110 active:scale-90 transition-all ${diceRoll === 6 && currentPlayer === 'red' ? 'animate-pulse ring-4 ring-red-400' : ''}`} />
                ))}
            </div>
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-green-500/10 border-l-4 border-b-4 border-green-500 flex flex-wrap p-4 gap-2 justify-center items-center">
                {tokens.filter(t => t.color === 'green' && t.position === 'base').map(t => (
                    <div key={t.id} onClick={() => moveToken(t.id)} className={`w-10 h-10 rounded-full bg-green-500 border-4 border-white shadow-xl cursor-pointer hover:scale-110 active:scale-90 transition-all ${diceRoll === 6 && currentPlayer === 'green' ? 'animate-pulse ring-4 ring-green-400' : ''}`} />
                ))}
            </div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/10 border-r-4 border-t-4 border-blue-500 flex flex-wrap p-4 gap-2 justify-center items-center">
                {tokens.filter(t => t.color === 'blue' && t.position === 'base').map(t => (
                    <div key={t.id} onClick={() => moveToken(t.id)} className={`w-10 h-10 rounded-full bg-blue-500 border-4 border-white shadow-xl cursor-pointer hover:scale-110 active:scale-90 transition-all ${diceRoll === 6 && currentPlayer === 'blue' ? 'animate-pulse ring-4 ring-blue-400' : ''}`} />
                ))}
            </div>
            <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-yellow-500/10 border-l-4 border-t-4 border-yellow-500 flex flex-wrap p-4 gap-2 justify-center items-center">
                {tokens.filter(t => t.color === 'yellow' && t.position === 'base').map(t => (
                    <div key={t.id} onClick={() => moveToken(t.id)} className={`w-10 h-10 rounded-full bg-yellow-500 border-4 border-white shadow-xl cursor-pointer hover:scale-110 active:scale-90 transition-all ${diceRoll === 6 && currentPlayer === 'yellow' ? 'animate-pulse ring-4 ring-yellow-400' : ''}`} />
                ))}
            </div>

            {/* Path visualization aids */}
            <div className="absolute top-[40%] left-0 w-full h-[20%] border-y-2 border-brand-primary/10 bg-white/5 pointer-events-none" />
            <div className="absolute left-[40%] top-0 w-[20%] h-full border-x-2 border-brand-primary/10 bg-white/5 pointer-events-none" />

            {/* Home Zone */}
            <div className="absolute inset-[40%] bg-white dark:bg-gray-800 border-4 border-gray-400 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full rotate-45 grid grid-cols-2 grid-rows-2">
                    <div className="bg-red-500" /><div className="bg-green-500" />
                    <div className="bg-blue-500" /><div className="bg-yellow-500" />
                </div>
            </div>

            {/* Token visualization on track */}
            {tokens.filter(t => typeof t.position === 'number').map(t => (
                <div 
                    key={t.id}
                    onClick={() => moveToken(t.id)}
                    className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-md cursor-pointer z-20 transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 ${
                        t.color === 'red' ? 'bg-red-500' : t.color === 'green' ? 'bg-green-500' : t.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}
                    style={{ 
                        left: `${((t.position as number % 15) * 6.6) + 3.3}%`, 
                        top: `${(Math.floor(t.position as number / 15) * 6.6) + 3.3}%` 
                    }}
                />
            ))}
        </div>
        
        <div className="mt-8 p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
            <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest text-center italic">
                {t('ludo_rules')}
            </p>
        </div>
        <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center">Engineered by Jean Baptiste • Buford, GA</p>
    </div>
  );
};

export default LudoGame;
