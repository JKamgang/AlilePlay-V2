
import React, { useState, useEffect } from 'react';
import type { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

type Piece = 'red' | 'black' | 'red-king' | 'black-king' | null;
type Square = { r: number; c: number };

const CheckersGame: React.FC<{ game: Game; options: any }> = ({ game }) => {
    const { t } = useApp();
    const [board, setBoard] = useState<Piece[][]>([]);
    const [turn, setTurn] = useState<'red' | 'black'>('red');
    const [selected, setSelected] = useState<Square | null>(null);
    const [validMoves, setValidMoves] = useState<Square[]>([]);

    const initializeBoard = () => {
        const newBoard: Piece[][] = Array(8).fill(null).map(() => Array(8).fill(null));
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if ((r + c) % 2 !== 0) {
                    if (r < 3) newBoard[r][c] = 'black';
                    else if (r > 4) newBoard[r][c] = 'red';
                }
            }
        }
        setBoard(newBoard);
        setTurn('red');
        setSelected(null);
    };

    useEffect(() => { initializeBoard(); }, []);

    const getMoves = (r: number, c: number, piece: Piece): Square[] => {
        if (!piece) return [];
        const moves: Square[] = [];
        const isKing = piece.includes('king');
        const directions = [];

        if (piece.startsWith('red') || isKing) directions.push({ dr: -1, dc: -1 }, { dr: -1, dc: 1 });
        if (piece.startsWith('black') || isKing) directions.push({ dr: 1, dc: -1 }, { dr: 1, dc: 1 });

        directions.forEach(({ dr, dc }) => {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                if (!board[nr][nc]) moves.push({ r: nr, c: nc });
                else if (!board[nr][nc]?.startsWith(turn)) {
                    const jr = nr + dr, jc = nc + dc;
                    if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8 && !board[jr][jc]) {
                        moves.push({ r: jr, c: jc });
                    }
                }
            }
        });
        return moves;
    };

    const handleSquareClick = (r: number, c: number) => {
        const piece = board[r][c];
        if (piece?.startsWith(turn)) {
            setSelected({ r, c });
            setValidMoves(getMoves(r, c, piece));
        } else if (selected && validMoves.some(m => m.r === r && m.c === c)) {
            const newBoard = board.map(row => [...row]);
            let movingPiece = newBoard[selected.r][selected.c];

            // Handle Jump
            if (Math.abs(r - selected.r) === 2) {
                const midR = (r + selected.r) / 2;
                const midC = (c + selected.c) / 2;
                newBoard[midR][midC] = null;
            }

            // Kinging logic
            if (movingPiece === 'red' && r === 0) movingPiece = 'red-king';
            if (movingPiece === 'black' && r === 7) movingPiece = 'black-king';

            newBoard[r][c] = movingPiece;
            newBoard[selected.r][selected.c] = null;
            setBoard(newBoard);
            setTurn(turn === 'red' ? 'black' : 'red');
            setSelected(null);
            setValidMoves([]);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-light-surface dark:bg-dark-surface rounded-3xl shadow-2xl max-w-2xl mx-auto border-4 border-brand-primary/10">
            <div className="w-full flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-brand-primary uppercase tracking-tighter">{t(game.nameKey)}</h2>
                <div className="flex items-center gap-3 bg-brand-primary/10 px-4 py-1 rounded-full">
                    <div className={`w-3 h-3 rounded-full ${turn === 'red' ? 'bg-red-500' : 'bg-gray-800'}`} />
                    <span className="font-black text-brand-primary uppercase text-xs">{turn} Turn</span>
                </div>
            </div>

            <div className="grid grid-cols-8 border-4 border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden shadow-2xl">
                {board.map((row, r) => row.map((piece, c) => {
                    const isDark = (r + c) % 2 !== 0;
                    const isValid = validMoves.some(m => m.r === r && m.c === c);
                    const isSel = selected?.r === r && selected?.c === c;
                    return (
                        <div
                            key={`${r}-${c}`}
                            onClick={() => handleSquareClick(r, c)}
                            className={`w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer transition-colors relative
                                ${isDark ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-900'}
                                ${isSel ? 'ring-4 ring-brand-primary/50 inset z-10' : ''}
                            `}
                        >
                            {isValid && <div className="absolute inset-0 bg-brand-primary/20 animate-pulse" />}
                            {piece && (
                                <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full shadow-lg flex items-center justify-center border-4
                                    ${piece.startsWith('red') ? 'bg-red-500 border-red-400' : 'bg-gray-900 border-gray-700'}
                                    ${piece.includes('king') ? 'ring-2 ring-yellow-400' : ''}
                                `}>
                                    {piece.includes('king') && <span className="text-yellow-400 text-xs sm:text-lg">👑</span>}
                                </div>
                            )}
                        </div>
                    );
                }))}
            </div>

            <button onClick={initializeBoard} className="mt-8 px-12 py-3 bg-brand-primary text-white font-black rounded-xl shadow-lg hover:bg-brand-secondary transition-all active:scale-95 uppercase tracking-widest">
                {t('reset_board')}
            </button>
        </div>
    );
};

export default CheckersGame;
