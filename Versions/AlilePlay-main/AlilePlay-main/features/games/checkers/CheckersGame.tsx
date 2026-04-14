
import React, { useState, useEffect, useCallback } from 'react';
import type { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

type Piece = 'red' | 'black' | 'red-king' | 'black-king' | null;
type Square = { r: number; c: number };

const CheckersGame: React.FC<{ game: Game; options: any }> = ({ game, options }) => {
    const { t } = useApp();
    const [board, setBoard] = useState<Piece[][]>([]);
    const [turn, setTurn] = useState<'red' | 'black'>('red');
    const [selected, setSelected] = useState<Square | null>(null);
    const [validMoves, setValidMoves] = useState<Square[]>([]);
    const [isAiThinking, setIsAiThinking] = useState(false);

    const initializeBoard = useCallback(() => {
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
        setValidMoves([]);
        setIsAiThinking(false);
    }, []);

    useEffect(() => { initializeBoard(); }, [initializeBoard]);

    const getMoves = useCallback((r: number, c: number, piece: Piece, currentBoard: Piece[][]): Square[] => {
        if (!piece) return [];
        const moves: Square[] = [];
        const isKing = piece.includes('king');
        const directions = [];
        const pColor = piece.startsWith('red') ? 'red' : 'black';
        
        if (pColor === 'red' || isKing) directions.push({ dr: -1, dc: -1 }, { dr: -1, dc: 1 });
        if (pColor === 'black' || isKing) directions.push({ dr: 1, dc: -1 }, { dr: 1, dc: 1 });

        directions.forEach(({ dr, dc }) => {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                if (!currentBoard[nr][nc]) {
                    moves.push({ r: nr, c: nc });
                } else if (!currentBoard[nr][nc]?.startsWith(pColor)) {
                    const jr = nr + dr, jc = nc + dc;
                    if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8 && !currentBoard[jr][jc]) {
                        moves.push({ r: jr, c: jc });
                    }
                }
            }
        });
        return moves;
    }, []);

    const executeMove = useCallback((from: Square, to: Square) => {
        setBoard(prev => {
            const newBoard = prev.map(row => [...row]);
            let movingPiece = newBoard[from.r][from.c];
            
            // Handle Jump
            if (Math.abs(to.r - from.r) === 2) {
                const midR = (to.r + from.r) / 2;
                const midC = (to.c + from.c) / 2;
                newBoard[midR][midC] = null;
            }

            // Kinging logic
            if (movingPiece === 'red' && to.r === 0) movingPiece = 'red-king';
            if (movingPiece === 'black' && to.r === 7) movingPiece = 'black-king';

            newBoard[to.r][to.c] = movingPiece;
            newBoard[from.r][from.c] = null;
            return newBoard;
        });
        setTurn(prev => prev === 'red' ? 'black' : 'red');
        setSelected(null);
        setValidMoves([]);
    }, []);

    const handleSquareClick = (r: number, c: number) => {
        if (isAiThinking) return;
        const piece = board[r][c];
        if (piece?.startsWith(turn)) {
            setSelected({ r, c });
            setValidMoves(getMoves(r, c, piece, board));
        } else if (selected && validMoves.some(m => m.r === r && m.c === c)) {
            executeMove(selected, { r, c });
        }
    };

    // AI Engine Integration
    useEffect(() => {
        if (options.play_mode === 'pva' && turn === 'black' && !isAiThinking) {
            setIsAiThinking(true);
            
            setTimeout(() => {
                const aiPieces: {r: number, c: number, piece: Piece}[] = [];
                board.forEach((row, r) => row.forEach((p, c) => {
                    if (p?.startsWith('black')) aiPieces.push({r, c, piece: p});
                }));

                const allValidMoves: {from: Square, to: Square, isJump: boolean}[] = [];
                aiPieces.forEach(p => {
                    const moves = getMoves(p.r, p.c, p.piece, board);
                    moves.forEach(m => {
                        allValidMoves.push({
                            from: {r: p.r, c: p.c},
                            to: m,
                            isJump: Math.abs(m.r - p.r) === 2
                        });
                    });
                });

                if (allValidMoves.length > 0) {
                    // AI Priority: 1. Jumps, 2. Random
                    const jumps = allValidMoves.filter(m => m.isJump);
                    const selectedMove = jumps.length > 0 
                        ? jumps[Math.floor(Math.random() * jumps.length)] 
                        : allValidMoves[Math.floor(Math.random() * allValidMoves.length)];
                    
                    executeMove(selectedMove.from, selectedMove.to);
                }
                setIsAiThinking(false);
            }, 1000);
        }
    }, [turn, options.play_mode, board, getMoves, executeMove, isAiThinking]);

    return (
        <div className="flex flex-col items-center p-6 bg-light-surface dark:bg-dark-surface rounded-3xl shadow-2xl max-w-2xl mx-auto border-4 border-brand-primary/10 animate-fade-in">
            <div className="w-full flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-black text-brand-primary uppercase tracking-tighter leading-none">{t(game.nameKey)}</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Platform v22.5 Engine</p>
                </div>
                <div className="flex items-center gap-3 bg-brand-primary/10 px-6 py-2 rounded-2xl shadow-inner border border-brand-primary/10">
                    <div className={`w-4 h-4 rounded-full shadow-lg ${turn === 'red' ? 'bg-red-500 animate-pulse' : 'bg-gray-800'}`} />
                    <span className="font-black text-brand-primary uppercase text-xs tracking-widest">
                        {isAiThinking ? 'AI Thinking...' : `${turn} Turn`}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-8 border-4 border-gray-100 dark:border-zinc-900 rounded-2xl overflow-hidden shadow-2xl bg-zinc-800">
                {board.map((row, r) => row.map((piece, c) => {
                    const isDark = (r + c) % 2 !== 0;
                    const isValid = validMoves.some(m => m.r === r && m.c === c);
                    const isSel = selected?.r === r && selected?.c === c;
                    return (
                        <div 
                            key={`${r}-${c}`} 
                            onClick={() => handleSquareClick(r, c)}
                            className={`w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer transition-all relative
                                ${isDark ? 'bg-zinc-700 dark:bg-zinc-800' : 'bg-white dark:bg-zinc-900'}
                                ${isSel ? 'bg-brand-primary/30 z-10' : ''}
                                ${isValid ? 'hover:bg-brand-primary/20' : ''}
                            `}
                        >
                            {isValid && <div className="absolute w-4 h-4 rounded-full bg-brand-primary/40 animate-ping" />}
                            {piece && (
                                <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full shadow-xl flex items-center justify-center border-4 transition-transform transform active:scale-95
                                    ${piece.startsWith('red') ? 'bg-red-500 border-red-400' : 'bg-zinc-950 border-zinc-700'}
                                    ${piece.includes('king') ? 'ring-2 ring-yellow-400' : ''}
                                `}>
                                    {piece.includes('king') && <span className="text-yellow-400 text-xs sm:text-xl drop-shadow-md">👑</span>}
                                </div>
                            )}
                        </div>
                    );
                }))}
            </div>

            <div className="flex gap-4 mt-8 w-full px-4">
                <button onClick={initializeBoard} className="flex-1 px-8 py-4 bg-gray-100 dark:bg-zinc-800 text-zinc-500 font-black rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs">
                    {t('reset_board')}
                </button>
                <div className="flex-1 bg-brand-primary/5 border border-brand-primary/10 p-2 rounded-2xl flex flex-col items-center justify-center">
                    <p className="text-[8px] font-black text-brand-primary uppercase opacity-50">Current Config</p>
                    <p className="text-[10px] font-black text-brand-primary uppercase">{options.play_mode === 'pva' ? 'VS Computer' : 'Local PvP'}</p>
                </div>
            </div>
            
            <p className="mt-8 text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] text-center italic leading-relaxed">
                Jean Baptiste Platform Architect<br/>Buford, GA • Snapshot v22.5
            </p>
        </div>
    );
};

export default CheckersGame;
