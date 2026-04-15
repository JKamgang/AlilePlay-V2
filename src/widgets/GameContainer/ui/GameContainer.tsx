import React, { useState } from 'react';
import { Game, GameMode } from '@/shared/types';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';

import SudokuGame from '@/entities/game/ui/games/SudokuGame';
import TetrisGame from '@/entities/game/ui/games/TetrisGame';
import WordMasterGame from '@/entities/game/ui/games/WordMasterGame';
import StaticGame from '@/entities/game/ui/games/StaticGame';
import CardGame from '@/entities/game/ui/games/CardGame';
import ChessGame from '@/entities/game/ui/games/ChessGame';
import CheckersGame from '@/entities/game/ui/games/CheckersGame';
import MonopolyGame from '@/entities/game/ui/games/MonopolyGame';
import TicTacToeGame from '@/entities/game/ui/games/TicTacToeGame';
import GameGuide from '@/features/game-guide/ui/GameGuide';
import { BookOpenIcon } from '@/shared/ui/Icons/Icons';

interface GameContainerProps {
  game: Game & { option?: string; mode?: GameMode };
  onClose: () => void;
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

const GameContainer: React.FC<GameContainerProps> = ({ game, onClose, t }) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const renderGame = () => {
    switch (game.id) {
      case 'sudoku':
        return <SudokuGame options={game.option || '9x9_easy'} t={t} />;
      case 'tetris':
        return <TetrisGame t={t} />;
      case 'scrabble':
        return <WordMasterGame t={t} />;
      case 'chess':
        return <ChessGame mode={game.mode || 'player'} t={t} />;
      case 'checkers':
        return <CheckersGame t={t} />;
      case 'monopoly':
        return <MonopolyGame t={t} />;
      case 'poker':
      case 'uno':
      case 'solitaire':
        return <CardGame game={game} t={t} />;
      case 'ludo':
        return <StaticGame game={game} t={t} />;
      case 'tictactoe':
        return <TicTacToeGame game={game} options={game.options} t={t} />;
      default:
        return <div className="text-white">This game is not implemented yet.</div>;
    }
  };

  return (
    <div className="animate-fade-in">
      {isGuideOpen && <GameGuide gameId={game.id} onClose={() => setIsGuideOpen(false)} t={t} />}
      <div className="bg-brand-dark font-sans flex flex-col">
        <header className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center">
              <game.icon className="h-8 w-8 text-brand-primary mr-3" />
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {t(game.nameKey)}
              </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="bg-brand-accent hover:bg-amber-400 text-gray-900 font-bold py-2 px-4 rounded text-sm transition-colors flex items-center"
            >
              <BookOpenIcon className="w-4 h-4 mr-2" />
              {t('game_guide')}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
            >
              &larr; {t('back_to_dashboard')}
            </button>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center">
          <div className="w-full bg-gray-900/50 rounded-xl shadow-lg border border-gray-700/50 p-2 sm:p-4 min-h-[500px]">
              {renderGame()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GameContainer;