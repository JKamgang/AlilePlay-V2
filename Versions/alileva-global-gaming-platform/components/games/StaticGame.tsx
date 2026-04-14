import React from 'react';
import { Game } from '../../types';
import { TRANSLATIONS } from '../../constants';

interface StaticGameProps {
  game: Game;
  t: (key: keyof typeof TRANSLATIONS | string) => string;
}

const StaticGame: React.FC<StaticGameProps> = ({ game, t }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white animate-fade-in">
        <game.icon className="w-24 h-24 text-brand-primary mb-6" />
        <h2 className="text-3xl font-bold mb-2">{t('welcome_to')} {game.name}</h2>
        <p className="text-lg text-gray-400">{game.description}</p>
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
             <p className="text-center">{t('game_logic_coming_soon')}</p>
        </div>
    </div>
  );
};

export default StaticGame;
