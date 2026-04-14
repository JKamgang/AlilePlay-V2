import React, { useState } from 'react';
import { useSubscription } from '@/features/subscription';

export const LearningHubWidget: React.FC = () => {
    const { isPremium } = useSubscription();
    const [view, setView] = useState<'guides' | 'flashcards'>('guides');

    if (!isPremium()) {
        return null;
    }

    return (
        <div className="p-4 bg-slate-800 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Learning Hub (Premium)</h3>
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setView('guides')}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${view === 'guides' ? 'bg-brand-primary text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                >
                    AI Generated Guides
                </button>
                <button
                    onClick={() => setView('flashcards')}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${view === 'flashcards' ? 'bg-brand-primary text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                >
                    NotebookLM Flashcards
                </button>
            </div>

            {view === 'guides' ? (
                <div className="space-y-2">
                    <div className="p-2 bg-slate-700/50 rounded text-sm text-gray-300 hover:bg-slate-700 transition cursor-pointer">
                        <span className="font-bold text-white block">Chess Strategy 101</span>
                        Learn openings based on latest matches.
                    </div>
                    <div className="p-2 bg-slate-700/50 rounded text-sm text-gray-300 hover:bg-slate-700 transition cursor-pointer">
                        <span className="font-bold text-white block">Sudoku Advanced</span>
                        X-Wing and Swordfish techniques.
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="p-4 bg-slate-700 rounded-lg text-center cursor-pointer hover:bg-slate-600 transition min-h-[100px] flex items-center justify-center">
                        <span className="font-bold text-lg text-white">What is "En Passant"?</span>
                    </div>
                    <p className="text-xs text-gray-400 text-center">Click to flip card</p>
                </div>
            )}
        </div>
    );
};
