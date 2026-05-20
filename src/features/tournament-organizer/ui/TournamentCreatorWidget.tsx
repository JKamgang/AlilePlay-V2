import React, { useState } from 'react';
import { useSubscription } from '@/features/subscription';
import { TournamentBasicInfo } from './TournamentBasicInfo';
import { CommissionSummary } from './CommissionSummary';
import { TournamentSettings } from './TournamentSettings';

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
                <TournamentBasicInfo
                    name={name} setName={setName}
                    game={game} setGame={setGame}
                    fee={fee} setFee={setFee}
                />

                <CommissionSummary estimatedPrizePool={estimatedPrizePool} />

                <TournamentSettings
                    isRecordingEnabled={isRecordingEnabled}
                    setIsRecordingEnabled={setIsRecordingEnabled}
                />

                <button className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded transition-colors text-sm">
                    Launch Tournament
                </button>
            </div>
        </div>
    );
};
