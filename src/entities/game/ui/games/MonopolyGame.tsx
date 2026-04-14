import React, { useState } from 'react';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';

interface MonopolyGameProps {
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

const PROPERTIES = [
    { name: 'Start', type: 'go' },
    { name: 'Park Place', type: 'prop', price: 200, rent: 50 },
    { name: 'Chance', type: 'chance' },
    { name: 'Broadwalk', type: 'prop', price: 400, rent: 100 },
    { name: 'Jail', type: 'jail' },
    { name: 'States Ave', type: 'prop', price: 150, rent: 30 },
    { name: 'Tax', type: 'tax', price: 100 },
    { name: 'Pacific Ave', type: 'prop', price: 300, rent: 60 },
    { name: 'Parking', type: 'parking' },
    { name: 'Wall St', type: 'prop', price: 500, rent: 150 },
    { name: 'Chance', type: 'chance' },
    { name: 'Main St', type: 'prop', price: 100, rent: 20 },
];

const MonopolyGame: React.FC<MonopolyGameProps> = () => {
    const [players, setPlayers] = useState([{ id: 1, pos: 0, money: 1500, color: 'bg-red-500', name: 'Player 1' }]);
    const [owned, setOwned] = useState<Record<number, number>>({});
    const [logs, setLogs] = useState<string[]>(['Welcome to Alileva Monopoly!']);
    const [isRolling, setIsRolling] = useState(false);

    const log = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

    const rollDice = () => {
        setIsRolling(true);
        setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            const newPos = (players[0].pos + roll) % PROPERTIES.length;
            const currentTile = PROPERTIES[newPos];

            let newMoney = players[0].money;
            log(`Rolled a ${roll}. Landed on ${currentTile.name}.`);

            if (currentTile.type === 'tax') {
                newMoney -= currentTile.price!;
                log(`Paid $${currentTile.price} in taxes.`);
            } else if (currentTile.type === 'prop') {
                const owner = owned[newPos];
                if (owner && owner !== players[0].id) {
                    newMoney -= currentTile.rent!;
                    log(`Paid $${currentTile.rent} rent.`);
                }
            }

            setPlayers([{ ...players[0], pos: newPos, money: newMoney }]);
            setIsRolling(false);
        }, 600);
    };

    const buyProperty = () => {
        const pos = players[0].pos;
        const tile = PROPERTIES[pos];
        if (tile.type === 'prop' && !owned[pos] && players[0].money >= tile.price!) {
            setOwned({ ...owned, [pos]: players[0].id });
            setPlayers([{ ...players[0], money: players[0].money - tile.price! }]);
            log(`Bought ${tile.name} for $${tile.price}.`);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 p-4 text-white">
            <div className="relative w-full max-w-md aspect-square bg-emerald-800 rounded-lg p-4 border-8 border-emerald-950 grid grid-cols-4 grid-rows-4 gap-1">
                {PROPERTIES.map((prop, i) => (
                    <div key={i} className={`flex flex-col items-center justify-center text-[10px] text-center p-1 rounded ${prop.type === 'prop' ? 'bg-white text-gray-900' : 'bg-emerald-700 text-white'} border border-emerald-900 relative`}>
                        <span className="font-bold leading-tight">{prop.name}</span>
                        {prop.type === 'prop' && <span className="text-[8px] mt-1">${prop.price}</span>}
                        {players[0].pos === i && <div className={`w-4 h-4 rounded-full ${players[0].color} absolute top-1 right-1 shadow-md animate-bounce`} />}
                        {owned[i] && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500" />}
                    </div>
                ))}
            </div>

            <div className="flex-1 bg-gray-800/80 p-6 rounded-xl border border-gray-700 shadow-xl min-w-[300px]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold">{players[0].name}</h3>
                        <p className="text-2xl font-mono text-emerald-400">${players[0].money}</p>
                    </div>
                    <button
                        disabled={isRolling}
                        onClick={rollDice}
                        className="bg-brand-primary hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform active:scale-95 disabled:opacity-50"
                    >
                        {isRolling ? 'Rolling...' : 'Roll Dice'}
                    </button>
                </div>

                <div className="space-y-4">
                    <button
                        disabled={PROPERTIES[players[0].pos].type !== 'prop' || !!owned[players[0].pos] || players[0].money < (PROPERTIES[players[0].pos].price || 0)}
                        onClick={buyProperty}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded font-bold disabled:bg-gray-700"
                    >
                        Buy Property
                    </button>

                    <div className="bg-gray-900 p-4 rounded h-32 overflow-y-auto border border-gray-700">
                        {logs.map((msg, i) => <p key={i} className={`text-sm mb-1 ${i === 0 ? 'text-white' : 'text-gray-500'}`}>{msg}</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonopolyGame;