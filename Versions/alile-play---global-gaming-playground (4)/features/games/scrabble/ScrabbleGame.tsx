
import React, { useState } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const ScrabbleGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [tiles] = useState(["A", "E", "I", "O", "R", "S", "T"]);
    const [board, setBoard] = useState<string[][]>(Array(15).fill(null).map(() => Array(15).fill('')));

    return (
        <div className="flex flex-col items-center p-4 bg-amber-50 rounded-3xl shadow-xl max-w-3xl mx-auto border-8 border-amber-900/20">
            <h2 className="text-2xl font-black text-amber-900 mb-6 uppercase tracking-widest">{t(game.nameKey)}</h2>

            <div className="grid grid-cols-15 grid-rows-15 gap-0.5 bg-amber-200 p-1 rounded-sm shadow-inner mb-8">
                {board.map((row, r) => row.map((cell, c) => (
                    <div key={`${r}-${c}`} className={`w-5 h-5 sm:w-8 sm:h-8 border border-white/40 flex items-center justify-center text-[10px] font-black ${ (r+c) % 7 === 0 ? 'bg-red-300' : (r*c) % 5 === 0 ? 'bg-blue-300' : 'bg-amber-100'}`}>
                        {cell}
                    </div>
                )))}
            </div>

            <div className="flex gap-2">
                {tiles.map((tile, i) => (
                    <div key={i} className="w-10 h-12 sm:w-12 sm:h-14 bg-amber-100 border-2 border-amber-900/30 rounded-lg flex flex-col items-center justify-center shadow-md transform hover:-translate-y-1 transition-transform cursor-grab">
                        <span className="text-xl font-black text-amber-900">{tile}</span>
                        <span className="text-[8px] self-end mr-1 font-bold">1</span>
                    </div>
                ))}
            </div>

            <p className="mt-8 text-amber-900/50 font-bold uppercase text-xs">Player 1 Turn: Drag Tiles to Board</p>
        </div>
    );
};

export default ScrabbleGame;
