
import React, { useState, useEffect } from 'react';
import type { Game } from '../../types';
import GameLobby from './GameLobby';
import { useApp } from '../../contexts/AppContext';

interface GameScreenProps {
  game: Game;
  onExit: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ game, onExit }) => {
  const { user } = useApp();
  const [showLobby, setShowLobby] = useState(true);

  // Dynamically create initial options state from game definition
  const getInitialOptions = () => {
    const initial: Record<string, any> = {};
    if (game.options) {
      game.options.forEach(opt => {
        // Use user preference if available, otherwise use game default
        initial[opt.id] = user.preferences.skillLevels[game.id] || opt.defaultValue;
      });
    }
    return initial;
  };

  const [gameOptions, setGameOptions] = useState(getInitialOptions());

  useEffect(() => {
    // Reset to lobby when game changes
    setShowLobby(true);
    setGameOptions(getInitialOptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  const handleStartGame = () => {
    setShowLobby(false);
  };

  const GameComponent = game.component;

  return (
    <div className="container mx-auto animate-fade-in">
      <button
        onClick={onExit}
        className="mb-4 text-brand-primary hover:underline"
      >
        &larr; Back to Library
      </button>
      {showLobby ? (
        <GameLobby game={game} onStart={handleStartGame} options={gameOptions} setOptions={setGameOptions} />
      ) : (
        <div className="animate-slide-in">
          <GameComponent game={game} options={gameOptions} setOptions={setGameOptions} />
        </div>
      )}
    </div>
  );
};

export default GameScreen;
