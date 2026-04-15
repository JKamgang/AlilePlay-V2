
import React, { useState, useEffect, useCallback } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const GRID_SIZE = 20;

const SnakeGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [dir, setDir] = useState({ x: 0, y: 0 });
    const [hasStarted, setHasStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);

    const generateFood = useCallback(() => ({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
    }), []);

    const reset = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood());
        setDir({ x: 0, y: 0 });
        setHasStarted(false);
        setScore(0);
        setIsGameOver(false);
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (isGameOver) return;
            let newDir = { ...dir };
            if (e.key === 'ArrowUp' && dir.y === 0) newDir = { x: 0, y: -1 };
            if (e.key === 'ArrowDown' && dir.y === 0) newDir = { x: 0, y: 1 };
            if (e.key === 'ArrowLeft' && dir.x === 0) newDir = { x: -1, y: 0 };
            if (e.key === 'ArrowRight' && dir.x === 0) newDir = { x: 1, y: 0 };

            if (newDir.x !== 0 || newDir.y !== 0) {
                setDir(newDir);
                if (!hasStarted) setHasStarted(true);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [dir, isGameOver, hasStarted]);

    useEffect(() => {
        if (isGameOver || !hasStarted) return;
        const interval = setInterval(() => {
            setSnake(prev => {
                const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
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
        }, 120);
        return () => clearInterval(interval);
    }, [dir, food, isGameOver, hasStarted, generateFood]);

    return (
        <div className="flex flex-col items-center p-6 bg-light-surface dark:bg-dark-surface rounded-3xl shadow-xl max-w-xl mx-auto border-4 border-brand-primary/10">
            <div className="flex justify-between w-full mb-6 px-2">
                <h2 className="text-3xl font-black text-brand-primary uppercase tracking-tighter">{t(game.nameKey)}</h2>
                <div className="bg-brand-primary/10 px-4 py-1 rounded-full text-brand-primary font-black">
                    {t('score')}: {score}
                </div>
            </div>

            <div className="relative border-8 border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 grid grid-cols-20 grid-rows-20 w-80 h-80 shadow-2xl">
                {Array(GRID_SIZE * GRID_SIZE).fill(0).map((_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    const isSnake = snake.some(p => p.x === x && p.y === y);
                    const isFood = food.x === x && food.y === y;
                    const isHead = snake[0].x === x && snake[0].y === y;
                    return (
                        <div key={i} className={`w-4 h-4 rounded-sm flex items-center justify-center ${isSnake ? 'bg-brand-primary' : isFood ? 'bg-red-500 animate-pulse' : ''}`}>
                            {isHead && <div className="w-1 h-1 bg-white rounded-full opacity-50" />}
                        </div>
                    );
                })}

                {!hasStarted && !isGameOver && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4">
                        <div className="text-5xl mb-4 animate-bounce">🐍</div>
                        <p className="text-sm font-black uppercase tracking-widest text-center animate-pulse">Press Arrow Key to Start</p>
                    </div>
                )}

                {isGameOver && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-4 animate-fade-in">
                        <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter text-red-500">{t('game_over')}</h3>
                        <p className="mb-6 font-bold opacity-70">Final Score: {score}</p>
                        <button onClick={reset} className="px-10 py-3 bg-brand-primary rounded-xl font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform">{t('play_again')}</button>
                    </div>
                )}
            </div>
            <p className="mt-8 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center">Architected by Jean Baptiste • Buford, GA</p>
        </div>
    );
};

export default SnakeGame;
