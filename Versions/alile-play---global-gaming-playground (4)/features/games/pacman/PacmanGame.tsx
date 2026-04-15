
import React, { useState, useEffect } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const PacmanGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [score, setScore] = useState(0);
    const [pos, setPos] = useState({ x: 5, y: 5 });

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            setPos(prev => {
                let next = { ...prev };
                if (e.key === 'ArrowUp') next.y = Math.max(0, prev.y - 1);
                if (e.key === 'ArrowDown') next.y = Math.min(9, prev.y + 1);
                if (e.key === 'ArrowLeft') next.x = Math.max(0, prev.x - 1);
                if (e.key === 'ArrowRight') next.x = Math.min(9, prev.x + 1);
                setScore(s => s + 10);
                return next;
            });
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <div className="flex flex-col items-center p-8 bg-black rounded-3xl shadow-2xl max-w-xl mx-auto border-8 border-blue-900">
            <div className="flex justify-between w-full mb-4 px-4 font-mono text-yellow-400 text-xl">
                <span>1UP</span>
                <span>SCORE: {score}</span>
            </div>

            <div className="grid grid-cols-10 grid-rows-10 gap-1 bg-black p-2 border-2 border-blue-500">
                {Array(100).fill(0).map((_, i) => {
                    const x = i % 10;
                    const y = Math.floor(i / 10);
                    const isPac = x === pos.x && y === pos.y;
                    return (
                        <div key={i} className="w-8 h-8 flex items-center justify-center relative">
                            {!isPac && <div className="w-1.5 h-1.5 bg-yellow-100 rounded-full" />}
                            {isPac && <div className="text-2xl animate-pulse">🟡</div>}
                        </div>
                    );
                })}
            </div>

            <p className="text-blue-500 font-mono text-xs mt-6 uppercase tracking-widest">Use Arrow Keys to Munch</p>
        </div>
    );
};

export default PacmanGame;
