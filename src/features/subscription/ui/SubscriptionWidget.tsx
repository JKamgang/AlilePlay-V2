import React from 'react';
import { useSubscription } from '../model/useSubscription';
import { UserTier } from '@/shared/api/ai';

export const SubscriptionWidget: React.FC = () => {
    const { tier, setTier } = useSubscription();

    const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTier(e.target.value as UserTier);
    };

    return (
        <div className="p-4 bg-slate-800 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Current Plan: {tier.toUpperCase()}</h3>
            <select
                value={tier}
                onChange={handleTierChange}
                className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
            >
                <option value="free">Free Tier</option>
                <option value="preview">Preview Tier</option>
                <option value="plan-a">Plan A (Premium)</option>
                <option value="plan-b">Plan B (Pro)</option>
                <option value="plan-c">Plan C (Enterprise)</option>
            </select>
            <p className="text-xs text-slate-400 mt-2">
                Premium plans unlock Gemini 1.5 Pro AI, Computer Vision, Voice Analysis, and Match Recording.
            </p>
        </div>
    );
};
