
import React, { useState } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const TicketToRideGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [trains, setTrains] = useState(45);
    const [routes, setRoutes] = useState(0);

    return (
        <div className="p-8 bg-blue-50 dark:bg-dark-bg rounded-3xl shadow-xl max-w-3xl mx-auto border-4 border-blue-200">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black text-blue-900">{t(game.nameKey)}</h2>
                <div className="flex gap-4">
                    <div className="text-center bg-white p-3 rounded-xl shadow-sm border">
                        <p className="text-[10px] font-bold text-gray-400">TRAINS</p>
                        <p className="text-xl font-black text-blue-600">{trains}</p>
                    </div>
                    <div className="text-center bg-white p-3 rounded-xl shadow-sm border">
                        <p className="text-[10px] font-bold text-gray-400">ROUTES</p>
                        <p className="text-xl font-black text-green-600">{routes}</p>
                    </div>
                </div>
            </div>

            <div className="relative aspect-video bg-blue-100 rounded-2xl border-2 border-blue-200 overflow-hidden shadow-inner mb-8">
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full shadow-lg" />
                <div className="absolute top-1/2 left-3/4 w-4 h-4 bg-blue-500 rounded-full shadow-lg" />
                <div className="absolute top-1/4 left-1/4 w-1/2 h-0.5 bg-gray-400 origin-left rotate-[25deg] border-dashed border-2" />
                <p className="absolute bottom-4 left-4 text-[10px] text-blue-400 font-bold uppercase">Continental Rail Map - Alile Sector</p>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={() => { setTrains(t => t - 4); setRoutes(r => r + 1); }}
                    className="flex-grow py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                    disabled={trains < 4}
                >
                    Claim Route (4 Trains)
                </button>
                <button className="flex-grow py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-2xl font-bold hover:bg-blue-50 shadow-sm">
                    Draw Destination
                </button>
            </div>
        </div>
    );
};

export default TicketToRideGame;
