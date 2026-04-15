
import React, { useState } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const ClueGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const suspects = ["Colonel Mustard", "Miss Scarlet", "Professor Plum", "Mrs. Peacock"];
    const [checklist, setChecklist] = useState<string[]>([]);

    const toggle = (item: string) => {
        setChecklist(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    return (
        <div className="p-8 bg-stone-900 text-stone-100 rounded-3xl shadow-2xl max-w-2xl mx-auto border-4 border-stone-700">
            <h2 className="text-3xl font-black mb-8 text-center text-red-600 tracking-tighter uppercase">Detective's Notepad</h2>

            <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-stone-500 uppercase text-xs mb-3 border-b border-stone-700 pb-1">Suspects</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {suspects.map(s => (
                            <button
                                key={s}
                                onClick={() => toggle(s)}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${checklist.includes(s) ? 'border-red-600 bg-red-600/10 opacity-50' : 'border-stone-700 bg-stone-800 hover:border-stone-500'}`}
                            >
                                <span className={checklist.includes(s) ? 'line-through' : ''}>{s}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-stone-800 p-6 rounded-2xl border border-stone-700">
                    <p className="text-sm italic text-stone-400 mb-4">"The body was found in the Billiard Room. We need to find the weapon..."</p>
                    <button className="w-full py-3 bg-red-700 hover:bg-red-800 rounded-xl font-bold transition-colors">Make Accusation</button>
                </div>
            </div>
        </div>
    );
};

export default ClueGame;
