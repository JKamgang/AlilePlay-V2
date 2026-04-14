
import React from 'react';
import type { Game } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface GameLobbyProps {
  game: Game;
  onStart: () => void;
  options: any;
  setOptions: (options: any) => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-lg shadow-inner">
        <h4 className="font-bold text-lg mb-2 text-brand-primary">{title}</h4>
        <div className="prose prose-sm dark:prose-invert max-w-none text-light-text dark:text-dark-text/90">
            {children}
        </div>
    </div>
);


const GameLobby: React.FC<GameLobbyProps> = ({ game, onStart, options, setOptions }) => {
  const { t } = useApp();

  const handleOptionChange = (id: string, value: any) => {
    setOptions({ ...options, [id]: value });
  };

  return (
    <div className="max-w-4xl mx-auto animate-slide-in">
      <h2 className="text-4xl font-extrabold text-center mb-2">{t(game.nameKey)}</h2>
      <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-8">{t(game.descriptionKey)}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <InfoCard title={t('rules')}><p>{t(game.rulesKey)}</p></InfoCard>
          <InfoCard title={t('history')}><p>{t(game.historyKey)}</p></InfoCard>
          {game.funFactsKey.length > 0 && (
             <InfoCard title={t('fun_facts')}>
                <ul className="list-disc pl-5 space-y-1">
                    {game.funFactsKey.map(factKey => <li key={factKey}>{t(factKey)}</li>)}
                </ul>
            </InfoCard>
          )}
        </div>

        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-lg shadow-lg flex flex-col">
            <h3 className="text-2xl font-bold mb-6 text-center">{t('game_lobby')}</h3>
            
            {game.options && game.options.length > 0 && (
                <div className="space-y-4 mb-8">
                    <h4 className="font-semibold text-lg">{t('game_options')}</h4>
                    {game.options.map(opt => (
                        <div key={opt.id}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t(opt.labelKey)}</label>
                            {opt.type === 'select' && opt.values && (
                                <select 
                                    value={options[opt.id]} 
                                    onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                                    className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                                >
                                    {opt.values.map(val => <option key={val.value} value={val.value}>{t(val.labelKey)}</option>)}
                                </select>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            <button
                onClick={onStart}
                className="w-full mt-auto bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-secondary transition-transform transform hover:scale-105 duration-300 text-lg"
            >
                {t('start_game')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
