import React, { useState } from 'react';
import { aiRouter, UserTier } from '@/shared/api/ai/aiRouter';

interface NotebookLMAudioWidgetProps {
    gameData?: string;
    userTier: UserTier;
}

const NotebookLMAudioWidget: React.FC<NotebookLMAudioWidgetProps> = ({ gameData, userTier }) => {
    const [audioLog, setAudioLog] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateAudioSummary = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const prompt = `Convert this game data into a Podcast-style audio script summary (NotebookLM style): ${gameData || "No data provided."}`;
            const response = await aiRouter.generateContent({
                userTier,
                taskType: 'voice',
                prompt: prompt
            });
            setAudioLog(response);
            // In a real implementation we would pass this text to a TTS service like ElevenLabs or Google Cloud TTS
        } catch (err: any) {
            setError(err.message || 'Failed to generate audio summary.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mt-4">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                🎧 NotebookLM-style Audio Summary
            </h3>
            <p className="text-sm text-gray-400 mb-4">Turn your gameplay or dashboard data into a podcast discussion.</p>
            <button
                onClick={generateAudioSummary}
                disabled={isLoading}
                className="bg-brand-primary text-white px-4 py-2 rounded font-bold disabled:opacity-50 w-full"
            >
                {isLoading ? 'Generating Audio Script...' : 'Generate Podcast Script'}
            </button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            {audioLog && (
                <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700 h-40 overflow-y-auto">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{audioLog}</p>
                </div>
            )}
        </div>
    );
};

export default NotebookLMAudioWidget;
