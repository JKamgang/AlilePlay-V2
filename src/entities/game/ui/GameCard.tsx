import React, { useState } from 'react';
import { Game, GameMode } from '@/shared/types';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game, option?: string, mode?: GameMode) => void;
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

const GameOptionsModal: React.FC<{
    game: Game,
    onClose: () => void,
    onSelect: (optionValue: string, modeValue?: GameMode) => void,
    t: (key: keyof typeof TRANSLATIONS.en | string) => string
}> = ({ game, onClose, onSelect, t }) => {
    const [selectedOption, setSelectedOption] = useState(game.options?.[0]?.value);
    const [selectedMode, setSelectedMode] = useState(game.modes?.[0]?.value);

    const handlePlay = () => {
        onSelect(selectedOption, selectedMode);
    }

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in-down p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm border border-gray-700" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">{t(game.nameKey)} - {t('options')}</h2>
                </header>
                <main className="p-6 space-y-4">
                    {game.options && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                            <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)} className="w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600">
                                {game.options.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
                            </select>
                        </div>
                    )}
                    {game.modes && (
                        <div>
                             <label className="block text-sm font-medium text-gray-300 mb-2">Game Mode</label>
                            <select value={selectedMode} onChange={e => setSelectedMode(e.target.value as GameMode)} className="w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600">
                                {game.modes.map(mode => <option key={mode.value} value={mode.value}>{t(mode.labelKey)}</option>)}
                            </select>
                        </div>
                    )}
                </main>
                 <footer className="p-4 border-t border-gray-700 flex justify-end gap-2">
                    <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors">{t('close')}</button>
                    <button onClick={handlePlay} className="bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors">{t('play')}</button>
                 </footer>
            </div>
        </div>
    );
};


const GameCard: React.FC<GameCardProps> = ({ game, onPlay, t }) => {
  const isPlayable = game.status === 'playable';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cardClasses = `group relative aspect-square bg-gray-800 rounded-lg flex flex-col items-center justify-center p-4 text-center transform transition-all duration-300 ${
    isPlayable ? 'hover:scale-105 hover:bg-brand-primary shadow-lg cursor-pointer' : 'opacity-60 cursor-not-allowed'
  }`;

  const handleCardClick = () => {
      if (!isPlayable) return;
      if (game.options || game.modes) {
          setIsModalOpen(true);
      } else {
          onPlay(game);
      }
  };

  const handleOptionSelect = (option?: string, mode?: GameMode) => {
      setIsModalOpen(false);
      onPlay(game, option, mode);
  }

  return (
    <>
      {isModalOpen && <GameOptionsModal game={game} onClose={() => setIsModalOpen(false)} onSelect={handleOptionSelect} t={t} />}
      <div className={cardClasses} onClick={handleCardClick}>
        <game.icon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 group-hover:text-white transition-colors" />
        <span className="mt-3 font-semibold text-sm sm:text-base text-gray-200 group-hover:text-white">{t(game.nameKey)}</span>

        {!isPlayable && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
            <span className="text-brand-accent text-xs font-bold uppercase tracking-wider">{t('coming_soon')}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default GameCard;