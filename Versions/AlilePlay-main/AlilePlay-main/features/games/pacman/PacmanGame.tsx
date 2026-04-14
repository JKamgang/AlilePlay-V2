
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const GRID_SIZE = 15;
const INITIAL_MAZE = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,3,1,1,0,1,0,1,0,1,0,1,1,3,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,0,1,1,1,2,1,1,1,0,1,1,1],
    [2,2,1,0,0,0,0,2,0,0,0,0,1,2,2],
    [1,1,1,0,1,2,1,1,1,2,1,0,1,1,1],
    [1,0,0,0,1,2,2,2,2,2,1,0,0,0,1],
    [1,1,1,0,1,1,1,1,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
    [1,3,0,1,0,0,0,0,0,0,0,1,0,3,1],
    [1,1,0,1,0,1,1,1,1,1,0,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const PacmanGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [maze, setMaze] = useState(INITIAL_MAZE.map(row => [...row]));
    const [pacman, setPacman] = useState({ x: 7, y: 7, dir: { x: 0, y: 0 }, rot: 0 });
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [tick, setTick] = useState(0);

    const moveRef = useRef<number | null>(null);

    const reset = () => {
        setMaze(INITIAL_MAZE.map(row => [...row]));
        setPacman({ x: 7, y: 7, dir: { x: 0, y: 0 }, rot: 0 });
        setScore(0);
        setGameOver(false);
        setHasStarted(false);
    };

    const handleKey = useCallback((e: KeyboardEvent) => {
        let newDir = { x: 0, y: 0 };
        let rot = 0;
        if (e.key === 'ArrowUp') { newDir = { x: 0, y: -1 }; rot = 270; }
        if (e.key === 'ArrowDown') { newDir = { x: 0, y: 1 }; rot = 90; }
        if (e.key === 'ArrowLeft') { newDir = { x: -1, y: 0 }; rot = 180; }
        if (e.key === 'ArrowRight') { newDir = { x: 1, y: 0 }; rot = 0; }

        if (newDir.x !== 0 || newDir.y !== 0) {
            setPacman(p => ({ ...p, dir: newDir, rot }));
            setHasStarted(true);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleKey]);

    const update = useCallback(() => {
        if (!hasStarted || gameOver) return;
        setTick(t => t + 1);

        setPacman(prev => {
            const nextX = prev.x + prev.dir.x;
            const nextY = prev.y + prev.dir.y;

            if (nextY >= 0 && nextY < maze.length && nextX >= 0 && nextX < maze[0].length) {
                if (maze[nextY][nextX] !== 1) {
                    if (maze[nextY][nextX] === 0 || maze[nextY][nextX] === 3) {
                        setScore(s => s + (maze[nextY][nextX] === 3 ? 50 : 10));
                        setMaze(prevMaze => {
                            const newMaze = prevMaze.map(row => [...row]);
                            newMaze[nextY][nextX] = 2;
                            return newMaze;
                        });
                    }
                    return { ...prev, x: nextX, y: nextY };
                }
            }
            return prev;
        });
    }, [hasStarted, gameOver, maze]);

    useEffect(() => {
        moveRef.current = window.setInterval(update, 150);
        return () => { if (moveRef.current) clearInterval(moveRef.current); };
    }, [update]);

    return (
        <div className="flex flex-col items-center p-8 bg-black rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-2xl mx-auto border-[16px] border-blue-950 overflow-hidden relative">
            <div className="flex justify-between w-full mb-8 px-6 font-mono text-yellow-400">
                <div className="flex flex-col">
                    <span className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-1">Score Data</span>
                    <span className="text-3xl font-black drop-shadow-[0_0_8px_rgba(255,255,0,0.5)]">{score.toString().padStart(5, '0')}</span>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">ALILE ARCADE</h2>
                    <p className="text-[10px] font-bold text-gray-600 uppercase">Snapshot v22.5</p>
                </div>
            </div>
            
            <div className="bg-blue-950/30 p-4 border-4 border-blue-900/50 rounded-2xl shadow-inner">
                <div className="grid grid-cols-15 grid-rows-15 gap-[2px] bg-black">
                    {maze.map((row, y) => row.map((cell, x) => {
                        const isPac = pacman.x === x && pacman.y === y;
                        return (
                            <div key={`${x}-${y}`} className="w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center relative">
                                {cell === 1 && (
                                    <div className="w-full h-full bg-blue-900 border-2 border-blue-500 rounded-sm shadow-[inset_0_0_10px_rgba(59,130,246,0.5),0_0_10px_rgba(59,130,246,0.3)]" />
                                )}
                                {cell === 0 && (
                                    <div className="w-2 h-2 bg-yellow-100 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-60" />
                                )}
                                {cell === 3 && (
                                    <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,0,0.8)]" />
                                )}
                                {isPac && (
                                    <div 
                                        className="relative text-3xl sm:text-4xl z-10 transition-transform duration-150 ease-out"
                                        style={{ transform: `rotate(${pacman.rot}deg)` }}
                                    >
                                        <div className={`transition-all duration-75 ${tick % 2 === 0 ? 'scale-y-75' : 'scale-y-100'}`}>
                                            🟡
                                            <div className="absolute top-1/2 right-1 w-4 h-1 bg-black origin-center" style={{ display: tick % 2 === 0 ? 'block' : 'none' }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }))}
                </div>
            </div>

            {!hasStarted && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white z-20">
                    <div className="text-7xl mb-6 animate-bounce">🟡</div>
                    <p className="text-2xl font-black uppercase tracking-[0.3em] text-yellow-400 animate-pulse">Insert Coin</p>
                    <p className="text-sm font-bold opacity-40 mt-4 uppercase tracking-widest">Use Arrow Keys to Begin</p>
                </div>
            )}

            <div className="mt-10 flex gap-4 w-full px-6">
                 <button onClick={reset} className="flex-1 py-4 bg-blue-900/20 text-blue-400 border-2 border-blue-900/50 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-900 hover:text-white transition-all shadow-xl">
                    Reboot Engine
                 </button>
            </div>
            
            <p className="mt-8 text-[10px] text-gray-700 font-mono uppercase tracking-[0.5em] text-center">Architect: Jean Baptiste • Buford GA</p>
        </div>
    );
};

export default PacmanGame;
