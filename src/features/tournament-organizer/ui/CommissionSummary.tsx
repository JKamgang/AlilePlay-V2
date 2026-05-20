import React from 'react';

interface CommissionSummaryProps {
    estimatedPrizePool: number;
}

export const CommissionSummary: React.FC<CommissionSummaryProps> = ({ estimatedPrizePool }) => {
    return (
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
    );
};
