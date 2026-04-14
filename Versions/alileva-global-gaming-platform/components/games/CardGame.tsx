import React from 'react';
import { Game } from '../../types';
import { TRANSLATIONS } from '../../constants';

interface CardGameProps {
  game: Game;
  t: (key: keyof typeof TRANSLATIONS | string) => string;
}

const CardGame: React.FC<CardGameProps> = ({ game, t }) => {
  const cardCount = game.id === 'solitaire' ? 7 : 5;

  return (
    <div className="flex flex-col items-center justify-center h-full text-white animate-fade-in">
        <h2 className="text-2xl font-bold mb-8">{t('welcome_to')} {game.name}</h2>
        <div className="flex -space-x-8 sm:-space-x-12">
            {Array.from({ length: cardCount }).map((_, index) => (
                <div 
                    key={index}
                    className="w-24 h-36 sm:w-32 sm:h-48 bg-gray-700 border-2 border-gray-500 rounded-lg shadow-lg flex items-center justify-center transform transition-transform hover:-translate-y-4"
                    style={{ transform: `rotate(${(index - Math.floor(cardCount / 2)) * 8}deg)` }}
                >
                    <game.icon className="w-12 h-12 text-brand-primary opacity-50"/>
                </div>
            ))}
        </div>
        <p className="mt-8 text-gray-400">{game.description}</p>
    </div>
  );
};

export default CardGame;
