import React, { useState } from 'react';
import { aiRouter, UserTier } from '@/shared/api/ai/aiRouter';

interface InfographicWidgetProps {
    dataString?: string;
    userTier: UserTier;
}

const InfographicWidget: React.FC<InfographicWidgetProps> = ({ dataString, userTier }) => {
    const [infographicPlan, setInfographicPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateInfographic = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const prompt = `Analyze this data and provide a detailed visual layout for an infographic: ${dataString || "No data provided."}`;
            const response = await aiRouter.generateContent({
                userTier,
                taskType: 'complex',
                prompt: prompt
            });
            setInfographicPlan(response);
            // In a real implementation this would tie into a charting library like Recharts or a canvas element to draw.
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to generate infographic layout.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mt-4">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                📊 AI Infographic Generator
            </h3>
            <p className="text-sm text-gray-400 mb-4">Dynamically generate visual summaries based on data.</p>
            <button
                onClick={generateInfographic}
                disabled={isLoading}
                className="bg-brand-secondary text-white px-4 py-2 rounded font-bold disabled:opacity-50 w-full"
            >
                {isLoading ? 'Generating Layout...' : 'Generate Infographic Data'}
            </button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            {infographicPlan && (
                <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700 h-40 overflow-y-auto">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{infographicPlan}</p>
                </div>
            )}
        </div>
    );
};

export default InfographicWidget;
