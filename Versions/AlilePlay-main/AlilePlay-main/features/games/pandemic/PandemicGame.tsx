
import React, { useState } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const PandemicGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [infectionRate, setInfectionRate] = useState(2);
    const [outbreaks, setOutbreaks] = useState(0);
    const [cures, setCures] = useState<string[]>([]);

    const discoverCure = (color: string) => {
        if (!cures.includes(color)) setCures(prev => [...prev, color]);
    };

    return (
        <div className="p-8 bg-red-50 dark:bg-dark-bg rounded-3xl shadow-xl max-w-4xl mx-auto border-4 border-red-200">
            <h2 className="text-3xl font-black text-red-900 mb-8 tracking-tighter uppercase italic">Bio-Threat Response Center</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-red-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-xs text-gray-400 uppercase">Infection Level</span>
                            <span className="text-2xl font-black text-red-600">{infectionRate}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                            <div className="h-full bg-red-600 rounded-full" style={{ width: `${(infectionRate/5)*100}%` }} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-red-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-xs text-gray-400 uppercase">Outbreak Tracker</span>
                            <span className="text-2xl font-black text-red-900">{outbreaks} / 8</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                            <div className="h-full bg-red-900 rounded-full" style={{ width: `${(outbreaks/8)*100}%` }} />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl border-2 border-red-900/30 flex flex-col justify-between">
                    <h3 className="text-xs font-black text-red-500 uppercase mb-4">Cure Progress</h3>
                    <div className="flex justify-around">
                        {['🔵', '🔴', '🟡', '⚫'].map((emoji, i) => (
                            <div key={i} className={`text-4xl filter ${cures.length > i ? '' : 'grayscale opacity-30'}`}>
                                {emoji}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => discoverCure('blue')}
                        className="mt-6 py-3 bg-red-800 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-red-700"
                    >
                        Research Cure
                    </button>
                </div>
            </div>

            <p className="text-center text-[10px] text-red-900/40 font-bold uppercase italic">Cooperate with the AI to find all 4 cures before global collapse.</p>
        </div>
    );
};

export default PandemicGame;
