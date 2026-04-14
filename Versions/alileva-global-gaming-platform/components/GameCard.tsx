import React from 'react';
import { Game } from '../types';
import { TRANSLATIONS } from '../constants';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
  t: (key: keyof typeof TRANSLATIONS | string) => string;
}

const GameCard: React.FC<GameCardProps> = ({ game, onPlay, t }) => {
  const isPlayable = game.status === 'playable';

  const cardClasses = `group relative aspect-square bg-gray-800 rounded-lg flex flex-col items-center justify-center p-4 text-center transform transition-all duration-300 ${
    isPlayable ? 'hover:scale-105 hover:bg-brand-primary shadow-lg cursor-pointer' : 'opacity-60 cursor-not-allowed'
  }`;

  return (
    <div className={cardClasses} onClick={() => isPlayable && onPlay(game)}>
      <game.icon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 group-hover:text-white transition-colors" />
      <span className="mt-3 font-semibold text-sm sm:text-base text-gray-200 group-hover:text-white">{game.name}</span>
      
      {isPlayable ? (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
          <span className="text-white font-bold py-2 px-4 border-2 border-white rounded-md text-sm uppercase">
            {game.options ? t('options') : t('play')}
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
          <span className="text-brand-accent text-xs font-bold uppercase tracking-wider">{t('coming_soon')}</span>
        </div>
      )}
    </div>
  );
};

export default GameCard;