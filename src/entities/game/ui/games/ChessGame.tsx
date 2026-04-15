import React, { useState, useMemo, useCallback } from 'react';
import { Chess } from 'chess.js';
import type { Square, Piece } from 'chess.js';
import { GameMode } from '@/shared/types';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';
import { UsersIcon, WhitePawn, WhiteRook, WhiteKnight, WhiteBishop, WhiteQueen, WhiteKing, BlackPawn, BlackRook, BlackKnight, BlackBishop, BlackQueen, BlackKing } from '@/shared/ui/Icons/Icons';

interface ChessGameProps {
  mode: GameMode;
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

// fix: Updated Move type to allow for promotion property
type Move = { from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n' };

const PIECE_COMPONENTS: { [key in Piece['type']]: { w: React.FC<any>, b: React.FC<any> } } = {
    p: { w: WhitePawn, b: BlackPawn },
    r: { w: WhiteRook, b: BlackRook },
    n: { w: WhiteKnight, b: BlackKnight },
    b: { w: WhiteBishop, b: BlackBishop },
    q: { w: WhiteQueen, b: BlackQueen },
    k: { w: WhiteKing, b: BlackKing },
};

const ChessGame: React.FC<ChessGameProps> = ({ mode, t }) => {
  const game = useMemo(() => new Chess(), []);

  const getStatus = useCallback(() => {
    const turn = game.turn() === 'w' ? t('whites_turn') : t('blacks_turn');
    if (game.isCheckmate()) return `${t('checkmate')} - ${game.turn() === 'w' ? 'Black' : 'White'} wins!`;
    if (game.isDraw()) return t('draw');
    if (game.isStalemate()) return t('stalemate');
    let status = turn;
    if (game.inCheck()) status += ` - ${t('check')}`;
    return status;
  }, [game, t]);

  const [board, setBoard] = useState(() => game.board());
  const [gameStatus, setGameStatus] = useState(() => getStatus());
  const [from, setFrom] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  const updateGame = useCallback(() => {
    setBoard(game.board());
    setGameStatus(getStatus());
  }, [game, getStatus]);

  const makeMove = useCallback((move: Move | string) => {
      const result = game.move(move);
      if (result) {
          updateGame();
          return true;
      }
      return false;
  }, [game, updateGame]);

  const makeAiMove = useCallback(() => {
    // Basic AI fallback logic, or replace with gemini implementation.
    // Given scope we'll use random move.
    const moves = game.moves({ verbose: true });
    if (moves.length > 0) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      // fix: Pass the SAN string to avoid type mismatch on the move object.
      makeMove(move.san);
    }
  }, [game, makeMove]);

  const onSquareClick = (square: Square) => {
    if (mode === 'ai' && game.turn() === 'b') return;

    if (from) {
      const moveResult = makeMove({ from, to: square, promotion: 'q' });
      if (moveResult && mode === 'ai') {
        setTimeout(makeAiMove, 500);
      }
      setFrom(null);
      setPossibleMoves([]);
    } else {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setFrom(square);
        const moves = game.moves({ square, verbose: true });
        setPossibleMoves(moves.map(m => m.to));
      }
    }
  };

  const getSquareComponent = (row: number, col: number) => {
    const square: Square = `${String.fromCharCode(97 + col)}${8 - row}` as Square;
    const piece = board[row][col];
    const isLight = (row + col) % 2 !== 0;

    const isPossibleMove = possibleMoves.includes(square);
    const isSelected = from === square;

    return (
      <div
        key={square}
        onClick={() => onSquareClick(square)}
        className={`w-full h-full flex items-center justify-center relative ${isLight ? 'bg-[#EBECD0]' : 'bg-[#779556]'} ${piece || isPossibleMove ? 'cursor-pointer' : ''}`}
      >
        {piece && React.createElement(PIECE_COMPONENTS[piece.type][piece.color], { className: 'w-4/5 h-4/5' })}
        {isSelected && <div className="absolute inset-0 bg-yellow-400/50" />}
        {isPossibleMove && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-1/3 h-1/3 rounded-full ${piece ? 'bg-black/20 ring-4 ring-black/20' : 'bg-black/20'}`}></div>
          </div>
        )}
      </div>
    );
  };

  const resetGame = () => {
      game.reset();
      updateGame();
      setFrom(null);
      setPossibleMoves([]);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-full w-full gap-4 sm:gap-8 text-white p-2 sm:p-4">
      <div className="w-full max-w-lg aspect-square shadow-lg">
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-md overflow-hidden border-2 border-gray-700">
          {Array.from({ length: 8 }).flatMap((_, row) =>
            Array.from({ length: 8 }).map((_, col) => getSquareComponent(row, col))
          )}
        </div>
      </div>

      <div className="w-full lg:w-64 bg-gray-800 p-4 rounded-lg text-center flex flex-col">
        <h3 className="font-bold text-lg text-gray-400 mb-2">{t('game_status')}</h3>
        <p className="text-xl font-semibold mb-4 h-12 flex items-center justify-center">{gameStatus}</p>

        {mode === 'team' && (
          <div className="space-y-4 my-6 text-left">
            <div className="p-3 bg-gray-900 rounded-lg">
              <h4 className="font-bold text-brand-light flex items-center mb-1"><UsersIcon className="w-5 h-5 mr-2" />{t('team_white')}</h4>
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/32?u=p1" alt="Player 1" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/32?u=p2" alt="Player 2" className="w-8 h-8 rounded-full border-2 border-white" />
              </div>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg">
              <h4 className="font-bold text-brand-light flex items-center mb-1"><UsersIcon className="w-5 h-5 mr-2" />{t('team_black')}</h4>
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/32?u=p3" alt="Player 3" className="w-8 h-8 rounded-full border-2 border-gray-600" />
                <img src="https://i.pravatar.cc/32?u=p4" alt="Player 4" className="w-8 h-8 rounded-full border-2 border-gray-600" />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={resetGame}
          className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded transition-colors mt-auto"
        >
          {t('play_again')}
        </button>
      </div>
    </div>
  );
};

export default ChessGame;
