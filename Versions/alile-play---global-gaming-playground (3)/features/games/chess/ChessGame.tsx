import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import type { Square, Piece, Move } from 'chess.js';
import type { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

// Placeholder for a potential future AI service integration.
const getAiMove = async (fen: string): Promise<string | null> => {
    // For now, we use the chess.js engine for a basic move.
    return new Promise(resolve => {
        setTimeout(() => {
            const game = new Chess(fen);
            const moves = game.moves({ verbose: true });
            if (moves.length > 0) {
                // A simple logic: prefer captures, then random.
                const captures = moves.filter(m => m.flags.includes('c'));
                if (captures.length > 0) {
                    const move = captures[Math.floor(Math.random() * captures.length)];
                    resolve(move.lan);
                } else {
                    const move = moves[Math.floor(Math.random() * moves.length)];
                    resolve(move.lan);
                }
            } else {
                resolve(null);
            }
        }, 500); // simulate network delay
    });
};

const PieceComponent: React.FC<{ piece: Piece }> = ({ piece }) => {
    const pieceMap: Record<string, string> = {
        'wk': '♔', 'wq': '♕', 'wr': '♖', 'wb': '♗', 'wn': '♘', 'wp': '♙',
        'bk': '♚', 'bq': '♛', 'br': '♜', 'bb': '♝', 'bn': '♞', 'bp': '♟︎',
    };
    const key = `${piece.color}${piece.type}`;
    return <span className="text-5xl sm:text-6xl" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{pieceMap[key]}</span>;
};


interface ChessGameProps {
  game: Game;
  options: any;
}

const files: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks: string[] = ['8', '7', '6', '5', '4', '3', '2', '1'];

const ChessGame: React.FC<ChessGameProps> = ({ game: gameInfo, options }) => {
  const { t } = useApp();
  const chessGame = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chessGame.fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);
  const [status, setStatus] = useState(t('chess_turn_your'));
  const [kingInCheckSquare, setKingInCheckSquare] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const board = useMemo(() => chessGame.board(), [fen]);

  const updateStatus = useCallback(() => {
    let currentKingInCheckSquare: Square | null = null;
    if (chessGame.isCheck()) {
        const boardState = chessGame.board();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = boardState[i][j];
                if (piece && piece.type === 'k' && piece.color === chessGame.turn()) {
                    currentKingInCheckSquare = `${files[j]}${ranks[i]}` as Square;
                    break;
                }
            }
            if (currentKingInCheckSquare) break;
        }
    }
    setKingInCheckSquare(currentKingInCheckSquare);

    if (chessGame.isCheckmate()) {
        setStatus(`${t('chess_checkmate')} - ${chessGame.turn() === 'w' ? 'AI' : 'You'} win!`);
    } else if (chessGame.isDraw()) {
        setStatus(t('chess_draw'));
    } else if (chessGame.isCheck()) {
        setStatus(`${t('chess_check')}! ${chessGame.turn() === 'w' ? t('chess_turn_your') : t('chess_turn_ai')}`);
    } else {
        setStatus(chessGame.turn() === 'w' ? t('chess_turn_your') : t('chess_turn_ai'));
    }
  }, [chessGame, t]);
  
  const makeMove = useCallback((move: string | { from: Square; to: Square; promotion?: string }) => {
    const result = chessGame.move(move);
    if (result) {
      setFen(chessGame.fen());
      setLastMove({ from: result.from, to: result.to });
      return result;
    }
    return null;
  }, [chessGame]);

  useEffect(() => {
    updateStatus();
    if (chessGame.turn() === 'b' && !chessGame.isGameOver()) {
        setIsAiThinking(true);
        setStatus(t('chess_turn_ai'));
        getAiMove(chessGame.fen()).then(move => {
            if (move && !chessGame.isGameOver()) {
                makeMove(move);
            }
            setIsAiThinking(false);
        });
    } else if(chessGame.turn() === 'w'){
      updateStatus();
    }
  }, [fen, chessGame, updateStatus, t, makeMove]);
  
  const resetGame = useCallback(() => {
      chessGame.reset();
      setFen(chessGame.fen());
      setSelectedSquare(null);
      setPossibleMoves([]);
      setKingInCheckSquare(null);
      setLastMove(null);
      setIsAiThinking(false);
      updateStatus();
  }, [chessGame, updateStatus]);

  const tryMove = useCallback((from: Square, to: Square) => {
    const move = makeMove({
        from,
        to,
        promotion: 'q', // auto-promote to queen for simplicity
    });
    
    setSelectedSquare(null);
    setPossibleMoves([]);
    return !!move;
  }, [makeMove]);

  const onSquareClick = (square: Square) => {
    if (isAiThinking || chessGame.isGameOver()) return;

    if (selectedSquare) {
      if (square !== selectedSquare) {
          tryMove(selectedSquare, square);
      } else {
          // Deselect
          setSelectedSquare(null);
          setPossibleMoves([]);
      }
    } else {
      const piece = chessGame.get(square);
      if (piece && piece.color === chessGame.turn()) {
        setSelectedSquare(square);
        setPossibleMoves(chessGame.moves({ square, verbose: true }));
      }
    }
  };
  
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, fromSquare: Square, piece: Piece) => {
      if(piece.color !== chessGame.turn() || isAiThinking || chessGame.isGameOver()) {
          e.preventDefault();
          return;
      }
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify({ from: fromSquare, piece }));
      setSelectedSquare(fromSquare);
      setPossibleMoves(chessGame.moves({ square: fromSquare, verbose: true }));
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, toSquare: Square) => {
      e.preventDefault();
      const { from } = JSON.parse(e.dataTransfer.getData('text/plain'));
      tryMove(from, toSquare);
  };
  
  return (
    <div className="flex flex-col items-center p-2 sm:p-4">
      <div className="w-full max-w-[640px] flex justify-between items-center mb-2 px-2">
        <h2 className="text-xl sm:text-2xl font-bold">{t(gameInfo.nameKey)}</h2>
        <button
            onClick={resetGame}
            className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors"
        >
            {t('new_game')}
        </button>
      </div>
      <div className={`w-full max-w-[640px] p-2 rounded-lg text-center font-semibold mb-2 text-lg transition-colors ${
          chessGame.isCheckmate() ? 'bg-red-500 text-white' : 
          chessGame.isCheck() ? 'bg-yellow-400 text-black' : 
          'bg-light-surface dark:bg-dark-surface'
      }`}>
        {isAiThinking ? 'AI is thinking...' : status}
      </div>

      <div className="w-full aspect-square max-w-[640px] grid grid-cols-8 shadow-2xl rounded-md overflow-hidden" aria-label="Chess board">
        {board.map((row, i) =>
          row.map((piece, j) => {
            const square = `${files[j]}${ranks[i]}` as Square;
            const isLight = (i + j) % 2 !== 0;
            const isSelected = square === selectedSquare;
            const isPossibleMove = possibleMoves.some(move => move.to === square);
            const isCaptureMove = isPossibleMove && board[i][j];
            const isKingInCheck = square === kingInCheckSquare;
            const isLastMove = lastMove && (square === lastMove.from || square === lastMove.to);

            return (
              <div
                key={square}
                onClick={() => onSquareClick(square)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, square)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150
                    ${isLight ? 'bg-stone-300 dark:bg-stone-600' : 'bg-green-700 dark:bg-green-900'}
                    ${isSelected ? 'bg-yellow-400/70 dark:bg-yellow-500/70' : ''}
                    ${isKingInCheck ? 'bg-red-500/80' : ''}
                    ${isLastMove ? 'bg-blue-400/50' : ''}
                `}
                aria-label={`Square ${square} ${piece ? `contains ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : 'is empty'}`}
              >
                {piece && (
                  <div
                    draggable={!isAiThinking && piece.color === 'w'}
                    onDragStart={(e) => onDragStart(e, square, piece)}
                    className="w-full h-full flex items-center justify-center"
                    style={{ cursor: isAiThinking || piece.color === 'b' ? 'not-allowed' : 'grab' }}
                  >
                    <PieceComponent piece={piece} />
                  </div>
                )}
                {isPossibleMove && (
                    <div className={`absolute pointer-events-none rounded-full ${isCaptureMove ? 'w-5/6 h-5/6 border-4 border-black/30' : 'w-1/4 h-1/4 bg-black/30'}`} aria-hidden="true"></div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessGame;
