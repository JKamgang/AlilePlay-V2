import React from 'react';
import { Game } from '../types';
import { TRANSLATIONS } from '../constants';

import SudokuGame from './games/SudokuGame';
import TetrisGame from './games/TetrisGame';
import WordMasterGame from './games/WordMasterGame';
import StaticGame from './games/StaticGame';
import CardGame from './games/CardGame';

interface GameContainerProps {
  game: Game & { option?: string };
  onClose: () => void;
  t: (key: keyof typeof TRANSLATIONS | string) => string;
}

const GameContainer: React.FC<GameContainerProps> = ({ game, onClose, t }) => {

  const renderGame = () => {
    switch (game.id) {
      case 'sudoku':
        return <SudokuGame options={game.option || '9x9_easy'} t={t} />;
      case 'tetris':
        return <TetrisGame t={t} />;
      case 'scrabble':
        return <WordMasterGame t={t} />;
      case 'poker':
      case 'uno':
      case 'solitaire':
        return <CardGame game={game} t={t} />;
      case 'chess':
      case 'checkers':
      case 'monopoly':
      case 'ludo':
        return <StaticGame game={game} t={t} />;
      default:
        return <div className="text-white">This game is not implemented yet.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark font-sans flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <game.icon className="h-8 w-8 text-brand-primary mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              {game.name}
            </h1>
        </div>
        <button
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
        >
          &larr; {t('back_to_dashboard')}
        </button>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full h-full bg-gray-900/50 rounded-xl shadow-lg border border-gray-700/50 p-4">
            {renderGame()}
        </div>
      </main>
    </div>
  );
};

export default GameContainer;