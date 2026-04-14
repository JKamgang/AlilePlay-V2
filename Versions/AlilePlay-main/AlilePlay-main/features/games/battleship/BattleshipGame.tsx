
import React, { useState } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const SIZE = 10;

const BattleshipGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [playerGrid, setPlayerGrid] = useState<Record<string, 'hit' | 'miss' | null>>({});
    const [aiGrid, setAiGrid] = useState<Record<string, 'hit' | 'miss' | null>>({});
    const [aiShips] = useState(() => {
        const ships: string[] = [];
        while(ships.length < 5) {
            const pos = `${Math.floor(Math.random()*SIZE)}-${Math.floor(Math.random()*SIZE)}`;
            if(!ships.includes(pos)) ships.push(pos);
        }
        return ships;
    });

    const fire = (x: number, y: number) => {
        const key = `${x}-${y}`;
        if (aiGrid[key]) return;
        
        const isHit = aiShips.includes(key);
        setAiGrid(prev => ({ ...prev, [key]: isHit ? 'hit' : 'miss' }));
        
        // AI Counter-fire
        setTimeout(() => {
            const ax = Math.floor(Math.random()*SIZE);
            const ay = Math.floor(Math.random()*SIZE);
            setPlayerGrid(prev => ({ ...prev, [`${ax}-${ay}`]: Math.random() > 0.8 ? 'hit' : 'miss' }));
        }, 500);
    };

    return (
        <div className="flex flex-col items-center p-8 bg-blue-50 dark:bg-dark-bg/50 rounded-3xl shadow-xl max-w-4xl mx-auto border border-blue-200">
            <h2 className="text-3xl font-black text-blue-700 mb-8 uppercase tracking-widest">{t(game.nameKey)}</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <p className="text-center font-bold text-gray-400 uppercase text-xs">Enemy Radar</p>
                    <div className="grid grid-cols-10 grid-rows-10 gap-1 bg-blue-900 p-2 rounded-lg">
                        {Array(SIZE * SIZE).fill(0).map((_, i) => {
                            const x = i % SIZE;
                            const y = Math.floor(i / SIZE);
                            const state = aiGrid[`${x}-${y}`];
                            return (
                                <button 
                                    key={i} 
                                    onClick={() => fire(x, y)}
                                    className={`w-6 h-6 sm:w-8 sm:h-8 border border-blue-700/50 transition-colors ${state === 'hit' ? 'bg-red-500' : state === 'miss' ? 'bg-white/20' : 'hover:bg-blue-400/30'}`}
                                />
                            );
                        })}
                    </div>
                </div>
                
                <div className="space-y-4">
                    <p className="text-center font-bold text-gray-400 uppercase text-xs">Your Fleet</p>
                    <div className="grid grid-cols-10 grid-rows-10 gap-1 bg-gray-800 p-2 rounded-lg">
                        {Array(SIZE * SIZE).fill(0).map((_, i) => {
                            const state = playerGrid[`${i % SIZE}-${Math.floor(i / SIZE)}`];
                            return (
                                <div key={i} className={`w-6 h-6 sm:w-8 sm:h-8 border border-gray-700 ${state === 'hit' ? 'bg-red-600' : state === 'miss' ? 'bg-blue-400' : ''}`} />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BattleshipGame;
