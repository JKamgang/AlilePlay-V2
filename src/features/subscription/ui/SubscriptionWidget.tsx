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
                <option value="free">Free (Explorer)</option>
                <option value="pro">Pro (Analyst)</option>
                <option value="enterprise">Enterprise (Visionary)</option>
                <option value="preview">Preview Tier</option>
                <option value="plan-a">Plan A</option>
                <option value="plan-b">Plan B</option>
                <option value="plan-c">Plan C</option>
            </select>
            <div className="text-xs text-slate-400 mt-2 space-y-1">
                <p><strong>Free (Explorer):</strong> Ad-supported, basic AI (Gemma 2), local GIS.</p>
                <p><strong>Pro (Analyst):</strong> Ad-free, Premium AI (Gemini 1.5 Pro), API access, Alile Pay/Shop.</p>
                <p><strong>Enterprise (Visionary):</strong> Computer Vision (Gemma 4), Google Maps Premium, Full Whitelabeling.</p>
            </div>
        </div>
    );
};
