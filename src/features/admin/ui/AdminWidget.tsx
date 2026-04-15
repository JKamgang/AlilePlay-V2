import React, { useState } from 'react';

export const AdminWidget: React.FC = () => {
    const [primaryColor, setPrimaryColor] = useState('#3b82f6'); // default tailwind blue
    const [themeName, setThemeName] = useState('Alile Default');

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrimaryColor(e.target.value);
        document.documentElement.style.setProperty('--color-brand-primary', e.target.value);
    };

    return (
        <div className="p-4 bg-slate-800 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Admin / White-Labeling</h3>
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
                    <label className="block text-sm text-gray-300 mb-1">Headless API Status</label>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="text-sm text-gray-300">Active - Endpoints ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
