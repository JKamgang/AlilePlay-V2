import React, { useState } from 'react';

export const AdminWidget: React.FC = () => {
    const [primaryColor, setPrimaryColor] = useState('#3b82f6'); // default tailwind blue
    const [themeName, setThemeName] = useState('Alile Default');

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrimaryColor(e.target.value);
        document.documentElement.style.setProperty('--color-brand-primary', e.target.value);
    };

    const [authMode, setAuthMode] = useState<'guest' | 'login' | 'admin'>('guest');
    const [groupMode, setGroupMode] = useState<'public' | 'private' | 'corporate'>('public');

    return (
        <div className="p-4 bg-slate-800 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Admin / Platform Config</h3>
                {authMode === 'admin' ? (
                    <button onClick={() => setAuthMode('guest')} className="text-xs bg-red-600 px-2 py-1 rounded text-white">Logout Admin</button>
                ) : (
                    <button onClick={() => setAuthMode('admin')} className="text-xs bg-brand-primary px-2 py-1 rounded text-white">Admin Login</button>
                )}
            </div>

            {authMode === 'admin' ? (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-300 mb-1">Theme Name</label>
                    <input
                        type="text"
                        value={themeName}
                        onChange={(e) => setThemeName(e.target.value)}
                        className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-300 mb-1">Primary Color</label>
                    <input
                        type="color"
                        value={primaryColor}
                        onChange={handleColorChange}
                        className="w-full h-10 rounded cursor-pointer"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-300 mb-1">Group Participation Mode</label>
                    <select
                        value={groupMode}
                        onChange={(e) => setGroupMode(e.target.value as 'public' | 'private' | 'corporate')}
                        className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:outline-none"
                    >
                        <option value="public">Public / Open</option>
                        <option value="private">Private (Friends & Family)</option>
                        <option value="corporate">Corporate / Bundle</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Controls how users can access tournaments and multiplayer lobbies.</p>
                </div>
                <div>
                    <label className="block text-sm text-gray-300 mb-1">Headless API Status</label>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="text-sm text-gray-300">Active - Endpoints ready</span>
                    </div>
                </div>
            </div>
            ) : (
                <div className="text-sm text-gray-400">
                    You are viewing as {authMode}. Admin settings are hidden.
                </div>
            )}
        </div>
    );
};
