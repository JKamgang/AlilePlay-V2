import React, { useState } from 'react';
import { useSubscription } from '@/features/subscription';

export const TournamentCreatorWidget: React.FC = () => {
    const { isPremium } = useSubscription();
    const [name, setName] = useState('');
    const [game, setGame] = useState('chess');
    const [fee, setFee] = useState(10);
    const [isRecordingEnabled, setIsRecordingEnabled] = useState(false);

    // Commission Structure (e.g., AlilePlay takes 10%)
    const platformFee = 0.10;
    const estimatedPrizePool = (fee * 100) * (1 - platformFee); // Assuming 100 participants

    if (!isPremium()) {
        return (
            <div className="p-4 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-2">B2B Tournament Organizer</h3>
                <p className="text-sm text-gray-400">
                    Sponsors, NGOs, and Corporations: Upgrade to a Premium Tier to host branded tournaments, set entry fees, and earn commissions.
                </p>
            </div>
        );
    }

    return (
        <div className="p-5 bg-slate-800 rounded-lg shadow-lg border border-slate-700 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Create Branded Tournament</h3>
                <span className="text-xs bg-brand-primary text-white px-2 py-1 rounded-full">B2B Features Active</span>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-300 mb-1">Tournament Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Acme Corp Global Chess Cup"
                        className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:outline-none focus:border-brand-primary text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Game Selection</label>
                        <select
                            value={game}
                            onChange={(e) => setGame(e.target.value)}
                            className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:outline-none text-sm"
                        >
                            <option value="chess">Chess</option>
                            <option value="wordmaster">Word Master</option>
                            <option value="bundle-strategy">Bundle: Strategy (Chess, Checkers)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Entry Fee ($)</label>
                        <input
                            type="number"
                            min="0"
                            value={fee}
                            onChange={(e) => setFee(Number(e.target.value))}
                            className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:outline-none text-sm"
                        />
                    </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-md border border-slate-700 text-sm">
                    <h4 className="text-gray-300 font-semibold mb-2">Commission & Agreements</h4>
                    <div className="flex justify-between text-gray-400 mb-1">
                        <span>Expected Participants:</span>
                        <span>100 (Est.)</span>
                    </div>
                    <div className="flex justify-between text-gray-400 mb-1">
                        <span>Platform Fee:</span>
                        <span>10%</span>
                    </div>
                    <div className="flex justify-between text-brand-primary font-bold mt-2 pt-2 border-t border-slate-700">
                        <span>Est. Prize Pool / Payout:</span>
                        <span>${estimatedPrizePool.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="recording"
                        checked={isRecordingEnabled}
                        onChange={(e) => setIsRecordingEnabled(e.target.checked)}
                        className="accent-brand-primary"
                    />
                    <label htmlFor="recording" className="text-sm text-gray-300">Enable Cloud Recording (Premium AI Analysis)</label>
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" id="terms" className="accent-brand-primary" />
                    <label htmlFor="terms" className="text-xs text-gray-400">I agree to international gaming regulations and affiliate terms.</label>
                </div>

                <button className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded transition-colors text-sm">
                    Launch Tournament
                </button>
            </div>
        </div>
    );
};
