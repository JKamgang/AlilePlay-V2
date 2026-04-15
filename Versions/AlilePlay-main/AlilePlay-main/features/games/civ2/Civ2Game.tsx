
import React, { useState } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const Civ2Game: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [gold, setGold] = useState(100);
    const [science, setScience] = useState(0);
    const [turn, setTurn] = useState(1);
    const [cities, setCities] = useState(1);

    const endTurn = () => {
        setGold(g => g + cities * 20);
        setScience(s => s + cities * 5);
        setTurn(t => t + 1);
    };

    const buildCity = () => {
        if (gold >= 50) {
            setGold(g => g - 50);
            setCities(c => c + 1);
        }
    };

    return (
        <div className="p-8 bg-amber-50 dark:bg-dark-bg border-4 border-amber-200 rounded-3xl shadow-xl max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-10 border-b-2 border-amber-200 pb-4">
                <h2 className="text-3xl font-black text-amber-800">{t(game.nameKey)}</h2>
                <div className="text-right">
                    <p className="font-bold text-amber-600">Turn: {turn}</p>
                    <p className="text-xs uppercase font-black text-amber-400">Ancient Era</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow-sm text-center">
                    <p className="text-xs font-bold text-gray-400">GOLD</p>
                    <p className="text-2xl font-black text-yellow-600">${gold}</p>
                </div>
                <div className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow-sm text-center">
                    <p className="text-xs font-bold text-gray-400">SCIENCE</p>
                    <p className="text-2xl font-black text-blue-500">{science}</p>
                </div>
                <div className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow-sm text-center">
                    <p className="text-xs font-bold text-gray-400">CITIES</p>
                    <p className="text-2xl font-black text-amber-500">{cities}</p>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={buildCity}
                    className="flex-grow py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 shadow-lg"
                    disabled={gold < 50}
                >
                    Build City ($50)
                </button>
                <button
                    onClick={endTurn}
                    className="flex-grow py-4 bg-gray-800 text-white rounded-2xl font-bold hover:bg-black shadow-lg"
                >
                    Next Turn
                </button>
            </div>
        </div>
    );
};

export default Civ2Game;
