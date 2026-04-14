
import React, { useState, useMemo, useEffect } from 'react';
import { Chess } from 'chess.js';
import type { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

// This is a placeholder for the Gemini Service
const getAiMove = async (fen: string): Promise<string | null> => {
    console.log("Asking AI for move from FEN:", fen);
    // In a real implementation, this would call the Gemini API.
    // For now, we simulate a delay and use the chess.js engine for a basic move.
    return new Promise(resolve => {
        setTimeout(() => {
            const game = new Chess(fen);
            const moves = game.moves({ verbose: true });
            if (moves.length > 0) {
                const move = moves[Math.floor(Math.random() * moves.length)];
                resolve(move.from + move.to);
            } else {
                resolve(null);
            }
        }, 1000);
    });
};


interface ChessGameProps {
  game: Game;
  options: any;
}

const ChessGame: React.FC<ChessGameProps> = ({ game, options }) => {
  const { t } = useApp();
  const chessGame = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chessGame.fen());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [status, setStatus] = useState(t('chess_turn_your'));

  const board = useMemo(() => chessGame.board(), [fen]);

  useEffect(() => {
    if (chessGame.turn() === 'b' && !chessGame.isGameOver()) {
        setStatus(t('chess_turn_ai'));
        getAiMove(chessGame.fen()).then(move => {
            if (move) {
                chessGame.move(move);
                setFen(chessGame.fen());
                updateStatus();
            }
        });
    } else {
        updateStatus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, chessGame, t]);

  const updateStatus = () => {
    if (chessGame.isCheckmate()) {
        setStatus(`${t('chess_checkmate')} - ${chessGame.turn() === 'w' ? 'AI' : 'You'} win!`);
    } else if (chessGame.isDraw()) {
        setStatus(t('chess_draw'));
    } else if (chessGame.isCheck()) {
        setStatus(`${t('chess_check')}! ${chessGame.turn() === 'w' ? t('chess_turn_your') : t('chess_turn_ai')}`);
    }
    else {
        setStatus(chessGame.turn() === 'w' ? t('chess_turn_your') : t('chess_turn_ai'));
    }
  };


  const handleSquareClick = (square: string) => {
    if (chessGame.turn() !== 'w' || chessGame.isGameOver()) return;

    if (selectedSquare) {
      try {
        const move = chessGame.move({
          from: selectedSquare,
          to: square,
          promotion: 'q', // auto-promote to queen for simplicity
        });
        if (move) {
          setFen(chessGame.fen());
        }
      } catch (e) {
        // Invalid move, maybe select new piece
      }
      setSelectedSquare(null);
      setPossibleMoves([]);
    } else {
      const moves = chessGame.moves({ square, verbose: true });
      if (moves.length > 0) {
        setSelectedSquare(square);
        setPossibleMoves(moves.map(m => m.to));
      }
    }
  };

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold mb-2">{t(game.nameKey)}</h2>
      <p className="text-xl font-semibold mb-4 h-8">{status}</p>
      <div className="w-full max-w-[600px] aspect-square shadow-2xl">
        {ranks.map((rank, i) => (
          <div key={rank} className="flex">
            {files.map((file, j) => {
              const square = `${file}${rank}`;
              const piece = board[i][j];
              const isBlack = (i + j) % 2 === 1;
              const isSelected = square === selectedSquare;
              const isPossibleMove = possibleMoves.includes(square);

              return (
                <div
                  key={square}
                  onClick={() => handleSquareClick(square)}
                  className={`w-full aspect-square flex items-center justify-center cursor-pointer relative
                    ${isBlack ? 'bg-green-700' : 'bg-green-100'}
                    ${isSelected ? 'bg-yellow-400' : ''}
                  `}
                >
                  {piece && (
                    <span className="text-5xl" style={{ color: piece.color === 'b' ? '#333' : '#FFF' }}>
                      {getPieceUnicode(piece.type)}
                    </span>
                  )}
                  {isPossibleMove && (
                    <div className="absolute w-1/3 h-1/3 bg-yellow-500/50 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

function getPieceUnicode(type: string) {
    const pieces: { [key: string]: string } = {
        p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔'
    };
    return pieces[type] || '';
}

export default ChessGame;
