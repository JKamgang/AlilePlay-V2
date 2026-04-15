
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import type { Square, Piece, Move } from 'chess.js';
import type { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const getAiMove = async (fen: string, difficulty: string): Promise<string | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const game = new Chess(fen);
            const moves = game.moves({ verbose: true });
            if (moves.length === 0) return resolve(null);

            // Difficulty Heuristics
            if (difficulty === 'beginner') {
                // Pick a purely random move
                resolve(moves[Math.floor(Math.random() * moves.length)].lan);
            } else if (difficulty === 'intermediate') {
                // Prefer captures, otherwise random
                const captures = moves.filter(m => m.flags.includes('c'));
                const move = captures.length > 0 ? captures[Math.floor(Math.random() * captures.length)] : moves[Math.floor(Math.random() * moves.length)];
                resolve(move.lan);
            } else {
                // Advanced: Prefer captures and central control (simplified)
                const centerSquares = ['d4', 'd5', 'e4', 'e5'];
                const captures = moves.filter(m => m.flags.includes('c'));
                const centerMoves = moves.filter(m => centerSquares.includes(m.to));

                let selectedMove;
                if (captures.length > 0) selectedMove = captures[Math.floor(Math.random() * captures.length)];
                else if (centerMoves.length > 0) selectedMove = centerMoves[Math.floor(Math.random() * centerMoves.length)];
                else selectedMove = moves[Math.floor(Math.random() * moves.length)];

                resolve(selectedMove.lan);
            }
        }, 800);
    });
};

const PieceComponent: React.FC<{ piece: Piece }> = ({ piece }) => {
    const pieceMap: Record<string, string> = {
        'wk': '♔', 'wq': '♕', 'wr': '♖', 'wb': '♗', 'wn': '♘', 'wp': '♙',
        'bk': '♚', 'bq': '♛', 'br': '♜', 'bb': '♝', 'bn': '♞', 'bp': '♟︎',
    };
    return <span className="text-4xl sm:text-6xl drop-shadow-md">{pieceMap[`${piece.color}${piece.type}`]}</span>;
};

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

const ChessGame: React.FC<{ game: Game; options: any }> = ({ game: gameInfo, options }) => {
  const { t } = useApp();
  const chessGame = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chessGame.fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  const board = useMemo(() => chessGame.board(), [fen]);

  const makeMove = useCallback((move: string | { from: Square; to: Square; promotion?: string }) => {
    try {
        const result = chessGame.move(move);
        if (result) {
          setFen(chessGame.fen());
          setLastMove({ from: result.from, to: result.to });
          return result;
        }
    } catch (e) {
        return null;
    }
    return null;
  }, [chessGame]);

  useEffect(() => {
    if (chessGame.turn() === 'b' && !chessGame.isGameOver()) {
        setIsAiThinking(true);
        getAiMove(chessGame.fen(), options.difficulty).then(move => {
            if (move) makeMove(move);
            setIsAiThinking(false);
        });
    }
  }, [fen, chessGame, options.difficulty, makeMove]);

  const onSquareClick = (square: Square) => {
    if (isAiThinking || chessGame.isGameOver()) return;
    if (selectedSquare) {
        if (square !== selectedSquare) {
            makeMove({ from: selectedSquare, to: square, promotion: 'q' });
        }
        setSelectedSquare(null);
        setPossibleMoves([]);
    } else {
        const piece = chessGame.get(square);
        if (piece && piece.color === chessGame.turn()) {
            setSelectedSquare(square);
            setPossibleMoves(chessGame.moves({ square, verbose: true }));
        }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-light-surface dark:bg-dark-surface rounded-3xl shadow-2xl max-w-2xl mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-brand-primary">{t(gameInfo.nameKey)}</h2>
          <div className="text-xs uppercase font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              Level: {options.difficulty}
          </div>
      </div>

      <div className="w-full aspect-square grid grid-cols-8 border-4 border-stone-800 rounded-lg overflow-hidden shadow-inner bg-stone-200">
        {board.map((row, i) =>
          row.map((piece, j) => {
            const square = `${files[j]}$ranks[i]}` as Square;
            const isLight = (i + j) % 2 !== 0;
            const isPossible = possibleMoves.some(m => m.to === square);
            const isLast = lastMove && (square === lastMove.from || square === lastMove.to);
            return (
              <div
                key={square}
                onClick={() => onSquareClick(square)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors
                    ${isLight ? 'bg-stone-300 dark:bg-stone-600' : 'bg-green-700 dark:bg-green-900'}
                    ${square === selectedSquare ? 'bg-yellow-400/60' : ''}
                    ${isLast ? 'bg-blue-400/40' : ''}
                `}
              >
                {piece && <PieceComponent piece={piece} />}
                {isPossible && <div className="absolute w-4 h-4 rounded-full bg-black/20" />}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 text-center">
          <p className="font-bold text-lg">
              {chessGame.isCheckmate() ? 'Checkmate!' : chessGame.isCheck() ? 'Check!' : isAiThinking ? 'AI is thinking...' : 'Your Turn'}
          </p>
          <button onClick={() => { chessGame.reset(); setFen(chessGame.fen()); setLastMove(null); }} className="mt-4 px-6 py-2 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-secondary">
              Restart
          </button>
      </div>
    </div>
  );
};

export default ChessGame;
