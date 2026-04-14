
import React, { useState, useCallback } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const BOARD_SIZE = 15;

const POINTS: Record<string, number> = {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

const SPECIAL_CELLS: Record<string, string> = {
    '0,0': 'TW', '0,7': 'TW', '0,14': 'TW', '7,0': 'TW', '7,14': 'TW', '14,0': 'TW', '14,7': 'TW', '14,14': 'TW',
    '7,7': 'STAR',
    '1,1': 'DW', '2,2': 'DW', '3,3': 'DW', '4,4': 'DW', '10,10': 'DW', '11,11': 'DW', '12,12': 'DW', '13,13': 'DW',
    '0,3': 'DL', '0,11': 'DL', '2,6': 'DL', '2,8': 'DL', '3,0': 'DL', '3,7': 'DL', '3,14': 'DL', '6,2': 'DL', '6,6': 'DL', '6,8': 'DL', '6,12': 'DL',
    '1,5': 'TL', '1,9': 'TL', '5,1': 'TL', '5,5': 'TL', '5,9': 'TL', '5,13': 'TL', '9,1': 'TL', '9,5': 'TL', '9,9': 'TL', '9,13': 'TL', '13,5': 'TL', '13,9': 'TL'
};

const ScrabbleGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [board, setBoard] = useState<(string | null)[][]>(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
    const [rack, setRack] = useState(["A", "E", "I", "O", "R", "S", "T"]);
    const [selectedTile, setSelectedTile] = useState<{ char: string, index: number } | null>(null);
    const [score, setScore] = useState(0);

    const hasAdjacent = (r: number, c: number) => {
        if (board.every(row => row.every(cell => cell === null))) return true; 
        const adj = [[0,1],[0,-1],[1,0],[-1,0]];
        return adj.some(([dr, dc]) => {
            const nr = r + dr, nc = c + dc;
            return nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] !== null;
        });
    };

    const handleBoardClick = (r: number, c: number) => {
        if (!selectedTile) return;
        if (board[r][c] !== null) return;
        if (!hasAdjacent(r, c)) return;

        const char = selectedTile.char;
        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = char;
        setBoard(newBoard);
        setScore(s => s + (POINTS[char] || 0));

        const newRack = [...rack];
        newRack.splice(selectedTile.index, 1);
        setRack(newRack);
        setSelectedTile(null);
    };

    const getCellColor = (r: number, c: number) => {
        const type = SPECIAL_CELLS[`${r},${c}`];
        switch (type) {
            case 'TW': return 'bg-red-500 text-white';
            case 'DW': return 'bg-pink-300 text-white';
            case 'TL': return 'bg-blue-600 text-white';
            case 'DL': return 'bg-sky-200 text-gray-700';
            case 'STAR': return 'bg-brand-primary text-white';
            default: return 'bg-stone-100 dark:bg-stone-900';
        }
    };

    const reset = () => {
        setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
        setRack(["A", "E", "I", "O", "R", "S", "T"]);
        setSelectedTile(null);
        setScore(0);
    };

    return (
        <div className="flex flex-col items-center p-6 bg-[#f4e4bc] dark:bg-stone-950 rounded-[40px] shadow-2xl max-w-5xl mx-auto border-[12px] border-[#8b4513] select-none">
            <div className="flex justify-between w-full mb-8 items-center px-4">
                <div>
                    <h2 className="text-4xl font-black text-[#5d2e0a] dark:text-brand-primary uppercase tracking-widest">{t(game.nameKey)}</h2>
                    <p className="text-[10px] font-bold text-[#8b4513] dark:text-gray-500 uppercase tracking-widest">Master Edition v22.5</p>
                </div>
                <div className="bg-[#5d2e0a] dark:bg-brand-primary px-8 py-3 rounded-2xl shadow-lg border-2 border-white/20">
                    <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Total Value</p>
                    <p className="text-3xl font-black text-white">{score}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-15 grid-rows-15 gap-[2px] bg-[#5d2e0a] p-2 border-4 border-[#5d2e0a] rounded-xl shadow-2xl mb-10 overflow-auto">
                {board.map((row, r) => row.map((cell, c) => {
                    const type = SPECIAL_CELLS[`${r},${c}`];
                    return (
                        <div 
                            key={`${r}-${c}`} 
                            onClick={() => handleBoardClick(r, c)}
                            className={`w-6 h-6 sm:w-11 sm:h-11 flex items-center justify-center text-[5px] sm:text-[9px] font-black cursor-pointer transition-all hover:brightness-110 active:scale-90 ${getCellColor(r, c)} rounded-sm`}
                        >
                            {cell ? (
                                <div className="w-[92%] h-[92%] bg-[#f2e1a8] text-[#5d2e0a] border-b-4 border-r-4 border-[#c4a484] flex flex-col items-center justify-center shadow-md relative rounded-md">
                                    <span className="text-xs sm:text-2xl font-black">{cell}</span>
                                    <span className="absolute bottom-0.5 right-1 text-[8px] sm:text-xs font-black">{POINTS[cell]}</span>
                                </div>
                            ) : type && type !== 'STAR' ? type : type === 'STAR' ? '★' : ''}
                        </div>
                    );
                }))}
            </div>

            <div className="w-full bg-[#8b4513] dark:bg-stone-900 p-8 rounded-[32px] flex flex-col items-center gap-8 shadow-2xl border-t-8 border-[#5d2e0a]">
                <div className="flex gap-2 sm:gap-4 flex-wrap justify-center">
                    {rack.map((tile, i) => (
                        <button 
                            key={i} 
                            onClick={() => setSelectedTile({ char: tile, index: i })}
                            className={`w-12 h-16 sm:w-16 sm:h-20 rounded-xl flex flex-col items-center justify-center shadow-[0_6px_0_0_rgba(0,0,0,0.3)] transition-all transform hover:-translate-y-2 active:scale-90 border-2 ${
                                selectedTile?.index === i 
                                ? 'bg-brand-primary text-white border-white ring-8 ring-brand-primary/30' 
                                : 'bg-[#f2e1a8] text-[#5d2e0a] border-[#c4a484]'
                            }`}
                        >
                            <span className="text-2xl sm:text-4xl font-black">{tile}</span>
                            <span className="text-[10px] sm:text-sm self-end mr-2 font-black">{POINTS[tile]}</span>
                        </button>
                    ))}
                </div>
                
                <div className="flex gap-4">
                    <button onClick={reset} className="px-10 py-3 bg-[#5d2e0a] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl">
                        Abandon Game
                    </button>
                    <button className="px-10 py-3 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-secondary transition-all shadow-xl border-b-4 border-black/20">
                        Finalize Turn
                    </button>
                </div>
            </div>
            
            <p className="mt-8 text-[#5d2e0a]/40 dark:text-gray-600 font-bold uppercase text-[10px] tracking-[0.5em] text-center">
                Lexicon Protocol Engine • Jean Baptiste • Buford GA
            </p>
        </div>
    );
};

export default ScrabbleGame;
