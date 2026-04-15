
import React, { useState, useEffect } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const KSPGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [altitude, setAltitude] = useState(100);
    const [velocity, setVelocity] = useState(0);
    const [fuel, setFuel] = useState(100);
    const [isLanded, setIsLanded] = useState(false);
    const [thrusting, setThrusting] = useState(false);

    useEffect(() => {
        const handleDown = (e: KeyboardEvent) => e.key === ' ' && setThrusting(true);
        const handleUp = (e: KeyboardEvent) => e.key === ' ' && setThrusting(false);
        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);
        return () => {
            window.removeEventListener('keydown', handleDown);
            window.removeEventListener('keyup', handleUp);
        };
    }, []);

    useEffect(() => {
        if (altitude <= 0) {
            setIsLanded(true);
            return;
        }
        const interval = setInterval(() => {
            setAltitude(a => Math.max(0, a - velocity / 10));
            setVelocity(v => v + (thrusting && fuel > 0 ? -1.5 : 0.8));
            if (thrusting && fuel > 0) setFuel(f => Math.max(0, f - 2));
        }, 100);
        return () => clearInterval(interval);
    }, [altitude, velocity, thrusting, fuel]);

    return (
        <div className="flex flex-col items-center p-8 bg-blue-900 rounded-3xl shadow-2xl max-w-2xl mx-auto border-b-8 border-gray-400">
            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter italic">KSP Landing Protocol</h2>

            <div className="relative w-full h-96 bg-black/50 rounded-xl overflow-hidden mb-6 flex flex-col justify-end">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

                {/* Rocket */}
                <div
                    className="absolute transition-all duration-100 flex flex-col items-center"
                    style={{ bottom: `${altitude}%`, left: '50%', transform: 'translateX(-50%)' }}
                >
                    <div className="text-4xl">🚀</div>
                    {thrusting && fuel > 0 && <div className="text-2xl animate-bounce">🔥</div>}
                </div>

                {/* Ground */}
                <div className="h-4 w-full bg-gray-600" />
            </div>

            <div className="grid grid-cols-3 gap-4 w-full">
                <div className="bg-black/30 p-4 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-blue-300">VELOCITY</p>
                    <p className={`text-xl font-black ${Math.abs(velocity) > 5 ? 'text-red-500' : 'text-green-500'}`}>{velocity.toFixed(1)}</p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-blue-300">ALTITUDE</p>
                    <p className="text-xl font-black text-white">{altitude.toFixed(0)}m</p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-blue-300">FUEL</p>
                    <div className="h-2 bg-gray-700 mt-2 rounded-full">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${fuel}%` }} />
                    </div>
                </div>
            </div>

            {isLanded && (
                <div className="mt-6 text-center animate-bounce">
                    <p className={`text-2xl font-black ${velocity < 5 ? 'text-green-500' : 'text-red-500'}`}>
                        {velocity < 5 ? "SUCCESSFUL LANDING!" : "CRITICAL FAILURE!" }
                    </p>
                    <button onClick={() => { setAltitude(100); setVelocity(0); setFuel(100); setIsLanded(false); }} className="mt-4 text-white hover:underline uppercase font-bold">Retry Mission</button>
                </div>
            )}

            <p className="text-blue-400 text-[10px] mt-4 font-bold">HOLD SPACEBAR FOR THRUSTERS</p>
        </div>
    );
};

export default KSPGame;
