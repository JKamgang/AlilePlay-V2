
import React, { useState, useCallback } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const COLS = 7;
const ROWS = 6;

const Connect4Game: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [board, setBoard] = useState<(string | null)[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    const [turn, setTurn] = useState<'red' | 'yellow'>('red');
    const [winner, setWinner] = useState<string | null>(null);

    const checkWin = (row: number, col: number, color: string, currentBoard: (string | null)[][]) => {
        const check = (dr: number, dc: number) => {
            let count = 0;
            for (let i = -3; i <= 3; i++) {
                const r = row + i * dr;
                const c = col + i * dc;
                if (r >= 0 && r < ROWS && c >= 0 && c < COLS && currentBoard[r][c] === color) {
                    count++;
                    if (count === 4) return true;
                } else {
                    count = 0;
                }
            }
            return false;
        };
        return check(0, 1) || check(1, 0) || check(1, 1) || check(1, -1);
    };

    const dropDisc = (col: number) => {
        if (winner) return;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (!board[r][col]) {
                const newBoard = board.map(row => [...row]);
                newBoard[r][col] = turn;
                setBoard(newBoard);
                if (checkWin(r, col, turn, newBoard)) {
                    setWinner(turn);
                } else {
                    setTurn(turn === 'red' ? 'yellow' : 'red');
                }
                return;
            }
        }
    };

    const reset = () => {
        setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
        setTurn('red');
        setWinner(null);
    };

    return (
        <div className="flex flex-col items-center p-8 bg-light-surface dark:bg-dark-surface rounded-3xl shadow-2xl max-w-xl mx-auto border-4 border-brand-primary/10">
            <h2 className="text-3xl font-black text-brand-primary mb-6 uppercase tracking-tighter">{t(game.nameKey)}</h2>

            <div className="flex justify-between w-full mb-6">
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full shadow-lg ${turn === 'red' ? 'bg-red-500' : 'bg-yellow-400'}`} />
                    <span className="font-black text-brand-primary uppercase text-sm">{turn} Turn</span>
                </div>
                {winner && (
                    <div className="bg-brand-primary text-white px-6 py-1 rounded-full animate-bounce font-black text-xs uppercase">
                        {winner} Wins!
                    </div>
                )}
            </div>

            <div className="bg-blue-700 p-3 rounded-2xl shadow-2xl border-b-[12px] border-blue-900 grid grid-cols-7 gap-3">
                {board.map((row, r) => row.map((cell, c) => (
                    <div
                        key={`${r}-${c}`}
                        onClick={() => dropDisc(c)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-blue-900 cursor-pointer shadow-inner transition-all hover:brightness-110 active:scale-95 ${
                            cell === 'red' ? 'bg-red-500' : cell === 'yellow' ? 'bg-yellow-400' : 'bg-blue-900/50'
                        }`}
                    />
                )))}
            </div>

            <button onClick={reset} className="mt-8 px-12 py-3 bg-brand-primary text-white font-black rounded-xl shadow-lg hover:bg-brand-secondary transition-all active:scale-95 uppercase tracking-widest">
                {t('reset_board')}
            </button>
            <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center">Engineered by Jean Baptiste • Buford, GA</p>
        </div>
    );
};

export default Connect4Game;
