
import React from 'react';
import { GAMES } from '../../constants';
import { useApp } from '../../contexts/AppContext';
import type { Game } from '../../types';
import GameCard from './GameCard';

interface GameLibraryProps {
  onPlay: (game: Game) => void;
}

const GameLibrary: React.FC<GameLibraryProps> = ({ onPlay }) => {
  const { user, t } = useApp();

  const visibleGames = GAMES.filter(game => {
    if (!game.enabled) return false;
    if (user.role === 'tester' || user.role === 'admin') return true;
    return game.visible;
  });

  return (
    <div className="container mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-center text-brand-primary">{t('game_library')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {visibleGames.map(game => (
          <GameCard key={game.id} game={game} onPlay={onPlay} />
        ))}
      </div>
    </div>
  );
};

export default GameLibrary;
