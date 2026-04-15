
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const GRID_SIZE = 20;

const SnakeGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [snake, setSnake] = useState([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [hasStarted, setHasStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);

    const moveQueue = useRef<{ x: number, y: number }[]>([]);
    const lastDirection = useRef({ x: 0, y: -1 });

    const generateFood = useCallback(() => {
        let newFood;
        while (true) {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
            if (!snake.some(p => p.x === newFood?.x && p.y === newFood?.y)) break;
        }
        return newFood;
    }, [snake]);

    const reset = () => {
        setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
        setFood(generateFood());
        setHasStarted(false);
        setScore(0);
        setIsGameOver(false);
        moveQueue.current = [];
        lastDirection.current = { x: 0, y: -1 };
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (isGameOver) return;
            let nextDir = { x: 0, y: 0 };
            if (e.key === 'ArrowUp') nextDir = { x: 0, y: -1 };
            if (e.key === 'ArrowDown') nextDir = { x: 0, y: 1 };
            if (e.key === 'ArrowLeft') nextDir = { x: -1, y: 0 };
            if (e.key === 'ArrowRight') nextDir = { x: 1, y: 0 };

            if (nextDir.x !== 0 || nextDir.y !== 0) {
                const headDir = moveQueue.current.length > 0
                    ? moveQueue.current[moveQueue.current.length - 1]
                    : lastDirection.current;

                if (nextDir.x !== -headDir.x || nextDir.y !== -headDir.y) {
                    moveQueue.current.push(nextDir);
                    if (!hasStarted) setHasStarted(true);
                }
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isGameOver, hasStarted]);

    useEffect(() => {
        if (isGameOver || !hasStarted) return;
        const interval = setInterval(() => {
            setSnake(prev => {
                const nextDir = moveQueue.current.shift() || lastDirection.current;
                lastDirection.current = nextDir;

                const head = { x: prev[0].x + nextDir.x, y: prev[0].y + nextDir.y };

                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                    setIsGameOver(true);
                    return prev;
                }
                if (prev.some(p => p.x === head.x && p.y === head.y)) {
                    setIsGameOver(true);
                    return prev;
                }

                const newSnake = [head, ...prev];
                if (head.x === food.x && head.y === food.y) {
                    setScore(s => s + 10);
                    setFood(generateFood());
                } else {
                    newSnake.pop();
                }
                return newSnake;
            });
        }, Math.max(60, 140 - (score / 4)));
        return () => clearInterval(interval);
    }, [food, isGameOver, hasStarted, generateFood, score]);

    return (
        <div className="flex flex-col items-center p-8 bg-gray-950 rounded-[50px] shadow-[0_0_80px_rgba(0,0,0,1)] max-w-2xl mx-auto border-[1px] border-white/10 relative overflow-hidden">
            {/* Background scanner effect */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(0deg,transparent_0%,rgba(0,255,0,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-[pulse_2s_infinite]" />

            <div className="flex justify-between w-full mb-8 items-end">
                <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">CYBER-SNAKE</h2>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-[0.4em] mt-2">Neural Link Active</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-8 py-3 rounded-2xl text-center backdrop-blur-sm">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Score</p>
                    <p className="text-3xl font-black text-green-400">{score}</p>
                </div>
            </div>

            <div className="relative border-2 border-white/10 rounded-[32px] overflow-hidden bg-black grid grid-cols-20 grid-rows-20 w-[300px] h-[300px] sm:w-[440px] sm:h-[440px] shadow-2xl">
                {/* Visual Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none">
                    {Array(400).fill(0).map((_, i) => (
                        <div key={i} className="border-[0.5px] border-white/[0.03]" />
                    ))}
                </div>

                {Array(GRID_SIZE * GRID_SIZE).fill(0).map((_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    const snakeIdx = snake.findIndex(p => p.x === x && p.y === y);
                    const isFood = food.x === x && food.y === y;
                    const isHead = snakeIdx === 0;

                    return (
                        <div key={i} className="flex items-center justify-center relative">
                            {snakeIdx !== -1 && (
                                <div
                                    className={`w-[85%] h-[85%] rounded-md shadow-lg transition-all duration-300 ${
                                        isHead
                                        ? 'bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] z-10'
                                        : 'bg-green-600/60 scale-95'
                                    }`}
                                    style={{ opacity: 1 - (snakeIdx / snake.length) * 0.5 }}
                                />
                            )}
                            {isFood && (
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,1)]" />
                            )}
                        </div>
                    );
                })}

                {!hasStarted && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white p-4 animate-fade-in z-20">
                        <div className="text-6xl mb-4 text-green-400 animate-pulse">⛓️</div>
                        <p className="text-xl font-black uppercase tracking-[0.4em] text-center mb-2">Initialize Link</p>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest text-center">Input Signal Required</p>
                    </div>
                )}

                {isGameOver && (
                    <div className="absolute inset-0 bg-red-950/90 backdrop-blur-xl flex flex-col items-center justify-center text-white p-4 animate-fade-in z-30">
                        <h3 className="text-5xl font-black mb-4 uppercase tracking-tighter">SIGNAL LOST</h3>
                        <p className="mb-10 font-bold text-white/50 uppercase tracking-widest">Mastery Level: {score}</p>
                        <button onClick={reset} className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all">Reconnect</button>
                    </div>
                )}
            </div>

            <p className="mt-10 text-[10px] text-gray-600 font-bold uppercase tracking-[0.6em] text-center">Engineered by Jean Baptiste • Buford GA</p>
        </div>
    );
};

export default SnakeGame;
