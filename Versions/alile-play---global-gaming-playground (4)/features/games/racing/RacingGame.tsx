
import React, { useState, useEffect } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const RacingGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [carPos, setCarPos] = useState(50);
    const [speed, setSpeed] = useState(0);
    const [lap, setLap] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') setCarPos(p => Math.max(10, p - 5));
            if (e.key === 'ArrowRight') setCarPos(p => Math.min(90, p + 5));
            if (e.key === 'ArrowUp') setSpeed(s => Math.min(100, s + 10));
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                const next = p + speed / 50;
                if (next >= 100) {
                    setLap(l => l + 1);
                    return 0;
                }
                return next;
            });
            setSpeed(s => Math.max(0, s - 2));
        }, 100);
        return () => clearInterval(interval);
    }, [speed]);

    return (
        <div className="flex flex-col items-center p-8 bg-gray-900 rounded-3xl shadow-2xl max-w-2xl mx-auto border-4 border-gray-700">
            <div className="w-full flex justify-between text-yellow-500 font-black mb-4">
                <span>LAP: {lap}</span>
                <span>SPEED: {speed} KM/H</span>
            </div>

            <div className="relative w-full h-80 bg-gray-800 overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-700 to-gray-900" />
                {/* Track Lines */}
                <div className="absolute left-[10%] inset-y-0 w-2 bg-white/20" />
                <div className="absolute right-[10%] inset-y-0 w-2 bg-white/20" />

                {/* The Car */}
                <div
                    className="absolute bottom-10 text-5xl transition-all duration-100"
                    style={{ left: `${carPos}%`, transform: 'translateX(-50%)' }}
                >
                    🏎️
                </div>

                {/* Obstacles (Simulated) */}
                <div className="absolute top-0 w-8 h-8 bg-red-500 rounded-full animate-ping" style={{ left: '30%' }} />
            </div>

            <div className="w-full h-4 bg-gray-700 mt-6 rounded-full overflow-hidden">
                <div className="h-full bg-brand-primary transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 text-xs text-gray-500 uppercase font-bold">Progress to Checkpoint</p>
        </div>
    );
};

export default RacingGame;
