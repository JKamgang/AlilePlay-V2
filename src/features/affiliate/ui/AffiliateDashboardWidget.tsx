import React from 'react';
import { useSubscription } from '@/features/subscription';

export const AffiliateDashboardWidget: React.FC = () => {
    const { isPremium } = useSubscription();

    if (!isPremium()) return null;

    return (
        <div className="p-4 bg-slate-800 rounded-lg shadow-lg border border-slate-700 animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-4">Affiliate & Marketing</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-slate-700 rounded text-center">
                    <span className="block text-xs text-gray-400">Total Referrals</span>
                    <span className="block text-xl font-bold text-brand-primary">1,248</span>
                </div>
                <div className="p-3 bg-slate-700 rounded text-center">
                    <span className="block text-xs text-gray-400">Earned Commissions</span>
                    <span className="block text-xl font-bold text-green-400">$4,320</span>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Your Referral Link (Headless Embed)</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            readOnly
                            value="https://alileplay.com/?ref=ACME&embed=true"
                            className="w-full bg-slate-900 text-gray-300 p-2 rounded border border-slate-600 text-xs font-mono"
                        />
                        <button className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-xs transition-colors">
                            Copy
                        </button>
                    </div>
                </div>
                <p className="text-[10px] text-gray-500">
                    Use `?embed=true` to integrate AlilePlay directly into your Real Estate Analytics dashboard or corporate intranet.
                </p>
            </div>
        </div>
    );
};
