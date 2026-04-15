
import React from 'react';
import type { Game } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  const { t } = useApp();
  const isPlayable = game.status === 'playable';

  return (
    <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
      <div className="h-40 bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
        <h3 className="text-2xl font-bold text-white text-center px-2">{t(game.nameKey)}</h3>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t(game.categoryKey)}</p>
        <p className="text-light-text dark:text-dark-text text-sm mb-4 flex-grow">{t(game.descriptionKey)}</p>
        {isPlayable ? (
          <button
            onClick={() => onPlay(game)}
            className="w-full mt-auto bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-secondary transition-colors duration-300"
          >
            {t('play_now')}
          </button>
        ) : (
          <div className="w-full mt-auto text-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold py-2 px-4 rounded-md">
            {t('coming_soon')}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;
