import React, { useState, useCallback } from 'react';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';

interface CheckersGameProps {
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

type Color = 'white' | 'black';
type Piece = { color: Color; isKing: boolean } | null;

const createInitialBoard = (): Piece[][] => {
    const board: Piece[][] = Array.from({ length: 8 }, () => Array(8).fill(null));
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 !== 0) board[row][col] = { color: 'black', isKing: false };
        }
    }
    for (let row = 5; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 !== 0) board[row][col] = { color: 'white', isKing: false };
        }
    }
    return board;
};

const CheckersGame: React.FC<CheckersGameProps> = ({ t }) => {
    const [board, setBoard] = useState<Piece[][]>(createInitialBoard());
    const [turn, setTurn] = useState<Color>('white');
    const [selected, setSelected] = useState<[number, number] | null>(null);
    const [validMoves, setValidMoves] = useState<[number, number][]>([]);

    const getMoves = useCallback((row: number, col: number, currentBoard: Piece[][]) => {
        const piece = currentBoard[row][col];
        if (!piece) return [];
        const moves: [number, number][] = [];
        const directions = piece.isKing ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : (piece.color === 'white' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]]);

        directions.forEach(([dr, dc]) => {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                if (!currentBoard[nr][nc]) {
                    moves.push([nr, nc]);
                } else if (currentBoard[nr][nc]?.color !== piece.color) {
                    const jr = nr + dr;
                    const jc = nc + dc;
                    if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8 && !currentBoard[jr][jc]) {
                        moves.push([jr, jc]);
                    }
                }
            }
        });
        return moves;
    }, []);

    const handleSquareClick = (r: number, c: number) => {
        if (selected) {
            const move = validMoves.find(([mr, mc]) => mr === r && mc === c);
            if (move) {
                const newBoard = board.map(row => [...row]);
                const piece = newBoard[selected[0]][selected[1]];
                newBoard[r][c] = piece;
                newBoard[selected[0]][selected[1]] = null;

                // Handle Capture
                if (Math.abs(r - selected[0]) === 2) {
                    const cr = (r + selected[0]) / 2;
                    const cc = (c + selected[1]) / 2;
                    newBoard[cr][cc] = null;
                }

                // Handle Kinging
                if (piece && ((piece.color === 'white' && r === 0) || (piece.color === 'black' && r === 7))) {
                    piece.isKing = true;
                }

                setBoard(newBoard);
                setTurn(turn === 'white' ? 'black' : 'white');
                setSelected(null);
                setValidMoves([]);
            } else {
                setSelected(null);
                setValidMoves([]);
            }
        } else {
            const piece = board[r][c];
            if (piece && piece.color === turn) {
                setSelected([r, c]);
                setValidMoves(getMoves(r, c, board));
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold text-white mb-4">{turn === 'white' ? t('whites_turn') : t('blacks_turn')}</h2>
            <div className="grid grid-cols-8 border-4 border-amber-900 rounded shadow-2xl overflow-hidden bg-amber-100">
                {board.map((row, r) => row.map((piece, c) => {
                    const isDark = (r + c) % 2 !== 0;
                    const isSelected = selected && selected[0] === r && selected[1] === c;
                    const isValidMove = validMoves.some(([mr, mc]) => mr === r && mc === c);

                    return (
                        <div
                            key={`${r}-${c}`}
                            onClick={() => handleSquareClick(r, c)}
                            className={`w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center relative ${isDark ? 'bg-amber-800' : 'bg-amber-200'}`}
                        >
                            {piece && (
                                <div className={`w-4/5 h-4/5 rounded-full shadow-lg border-2 ${piece.color === 'white' ? 'bg-gray-100 border-gray-400' : 'bg-gray-900 border-gray-700'} ${isSelected ? 'ring-4 ring-yellow-400' : ''} flex items-center justify-center`}>
                                    {piece.isKing && <span className="text-yellow-500 font-bold text-lg">★</span>}
                                </div>
                            )}
                            {isValidMove && <div className="absolute inset-0 bg-emerald-500/30 cursor-pointer border-2 border-emerald-500" />}
                        </div>
                    );
                }))}
            </div>
            <button onClick={() => setBoard(createInitialBoard())} className="mt-8 bg-brand-primary py-2 px-6 rounded text-white font-bold">{t('play_again')}</button>
        </div>
    );
};

export default CheckersGame;