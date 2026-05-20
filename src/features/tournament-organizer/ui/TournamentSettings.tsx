import React from 'react';

interface TournamentSettingsProps {
    isRecordingEnabled: boolean;
    setIsRecordingEnabled: (enabled: boolean) => void;
}

export const TournamentSettings: React.FC<TournamentSettingsProps> = ({
    isRecordingEnabled,
    setIsRecordingEnabled
}) => {
    return (
        <>
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
        </>
    );
};
