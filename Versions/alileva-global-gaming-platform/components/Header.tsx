
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeaderProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS) => string;
}

const Header: React.FC<HeaderProps> = ({ currentLang, setLang, t }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="text-xl font-bold ml-3 text-white">Alileva Games</span>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <select
                value={currentLang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-md focus:ring-brand-primary focus:border-brand-primary block w-full pl-3 pr-8 py-2 appearance-none"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="zh">中文</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            <img src="https://i.pravatar.cc/40?u=admin" alt="User" className="w-10 h-10 rounded-full ml-4 border-2 border-brand-primary"/>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
