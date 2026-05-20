import React from 'react';

interface TournamentBasicInfoProps {
    name: string;
    setName: (name: string) => void;
    game: string;
    setGame: (game: string) => void;
    fee: number;
    setFee: (fee: number) => void;
}

export const TournamentBasicInfo: React.FC<TournamentBasicInfoProps> = ({
    name,
    setName,
    game,
    setGame,
    fee,
    setFee
}) => {
    return (
        <>
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
        </>
    );
};
