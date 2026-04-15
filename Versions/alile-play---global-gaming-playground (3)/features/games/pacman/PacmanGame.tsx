import React from 'react';
import type { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

interface PacmanGameProps {
  game: Game;
  options: any;
}

const PacmanGame: React.FC<PacmanGameProps> = ({ game }) => {
    const { t } = useApp();
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-light-surface dark:bg-dark-surface rounded-lg">
      <h2 className="text-3xl font-bold mb-4">{t(game.nameKey)}</h2>
      <p className="text-lg text-center">{t(game.descriptionKey)}</p>
      <div className="w-96 h-96 mt-8 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md">
        <p className="font-bold text-xl text-gray-500">{t('coming_soon')}!</p>
      </div>
       <p className="mt-4 text-sm text-gray-500">Pac-Man is munching his way to the platform soon!</p>
    </div>
  );
};

export default PacmanGame;
