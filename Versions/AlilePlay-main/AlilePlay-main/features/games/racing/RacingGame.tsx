
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

interface Obstacle {
    id: number;
    lane: number;
    y: number;
    type: 'barrier' | 'oil';
}

const RacingGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [carLane, setCarLane] = useState(1); // 0, 1, 2 (Left, Center, Right)
    const [speed, setSpeed] = useState(0);
    const [score, setScore] = useState(0);
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const gameLoopRef = useRef<number | null>(null);
    const obstacleIdRef = useRef(0);

    const lanes = [20, 50, 80]; // Percent positions of lanes

    const reset = () => {
        setCarLane(1);
        setSpeed(0);
        setScore(0);
        setObstacles([]);
        setGameOver(false);
        setHasStarted(false);
    };

    const handleKey = useCallback((e: KeyboardEvent) => {
        if (gameOver) return;
        if (e.key === 'ArrowLeft') setCarLane(p => Math.max(0, p - 1));
        if (e.key === 'ArrowRight') setCarLane(p => Math.min(2, p + 1));
        if (e.key === 'ArrowUp' && !hasStarted) {
            setHasStarted(true);
            setSpeed(40);
        }
    }, [gameOver, hasStarted]);

    useEffect(() => {
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleKey]);

    useEffect(() => {
        if (!hasStarted || gameOver) return;

        const loop = () => {
            setObstacles(prev => {
                const moved = prev.map(obs => ({ ...obs, y: obs.y + speed / 8 }))
                    .filter(obs => obs.y < 120);
                
                // Spawn logic
                if (Math.random() < 0.05 && (moved.length === 0 || moved[moved.length-1].y > 30)) {
                    moved.push({
                        id: obstacleIdRef.current++,
                        lane: Math.floor(Math.random() * 3),
                        y: -10,
                        type: Math.random() > 0.3 ? 'barrier' : 'oil'
                    });
                }

                // Collision detection
                const collision = moved.find(obs => obs.lane === carLane && obs.y > 80 && obs.y < 95);
                if (collision) {
                    setGameOver(true);
                    setSpeed(0);
                    return prev;
                }

                return moved;
            });

            setScore(s => s + 1);
            setSpeed(s => Math.min(100, s + 0.01));
            gameLoopRef.current = requestAnimationFrame(loop);
        };

        gameLoopRef.current = requestAnimationFrame(loop);
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [hasStarted, gameOver, speed, carLane]);

    return (
        <div className="flex flex-col items-center p-8 bg-zinc-900 rounded-[50px] shadow-[0_0_80px_rgba(0,0,0,1)] max-w-2xl mx-auto border-[1px] border-white/10 relative overflow-hidden font-mono">
            <div className="w-full flex justify-between items-end mb-8 px-4">
                <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none italic">VELOCITY X</h2>
                    <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-[0.4em] mt-2 animate-pulse">Platform Engine: Tier 1</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-2xl text-center">
                        <p className="text-[8px] text-gray-500 font-bold uppercase">Distance</p>
                        <p className="text-xl font-black text-white">{Math.floor(score/10)}m</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-2xl text-center">
                        <p className="text-[8px] text-gray-500 font-bold uppercase">KM/H</p>
                        <p className="text-xl font-black text-brand-primary">{Math.floor(speed * 2.4)}</p>
                    </div>
                </div>
            </div>
            
            <div className="relative w-full h-[500px] bg-zinc-800 rounded-[32px] border-4 border-zinc-700 overflow-hidden shadow-2xl">
                {/* Road Lines Animation */}
                <div className="absolute inset-0 flex justify-center gap-24 opacity-20 pointer-events-none">
                    <div className="h-[200%] w-2 border-r-4 border-dashed border-white animate-[slideDown_1s_linear_infinite]" style={{ animationDuration: `${200/speed}s` }} />
                    <div className="h-[200%] w-2 border-r-4 border-dashed border-white animate-[slideDown_1s_linear_infinite]" style={{ animationDuration: `${200/speed}s` }} />
                </div>

                {/* Obstacles */}
                {obstacles.map(obs => (
                    <div 
                        key={obs.id}
                        className="absolute text-5xl transition-all duration-75"
                        style={{ 
                            left: `${lanes[obs.lane]}%`, 
                            top: `${obs.y}%`, 
                            transform: 'translateX(-50%)' 
                        }}
                    >
                        {obs.type === 'barrier' ? '🚧' : '🛢️'}
                    </div>
                ))}

                {/* The Player Car */}
                <div 
                    className="absolute bottom-10 text-6xl transition-all duration-200 ease-out z-10"
                    style={{ 
                        left: `${lanes[carLane]}%`, 
                        transform: 'translateX(-50%)' 
                    }}
                >
                    🏎️
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-brand-primary/40 blur-md animate-pulse" />
                </div>

                {!hasStarted && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white z-20">
                        <div className="text-7xl mb-6">🏎️</div>
                        <p className="text-2xl font-black uppercase tracking-[0.3em] text-yellow-400">Press Up to Start</p>
                        <p className="text-xs font-bold opacity-40 mt-4 uppercase tracking-widest">Left / Right to Shift Lanes</p>
                    </div>
                )}

                {gameOver && (
                    <div className="absolute inset-0 bg-red-950/90 backdrop-blur-xl flex flex-col items-center justify-center text-white p-4 animate-fade-in z-30">
                        <h3 className="text-5xl font-black mb-4 uppercase tracking-tighter italic">CRITICAL IMPACT</h3>
                        <p className="mb-10 font-bold text-white/50 uppercase tracking-widest">Mastery Level: {Math.floor(score/10)}</p>
                        <button onClick={reset} className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Restart Engine</button>
                    </div>
                )}
            </div>
            
            <p className="mt-8 text-[10px] text-zinc-600 font-bold uppercase tracking-[0.6em] text-center">Engineered by Jean Baptiste • Buford GA</p>

            <style>{`
                @keyframes slideDown {
                    from { transform: translateY(-50%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default RacingGame;
