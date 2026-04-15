
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Language, Theme } from '../types';
import { SunIcon, MoonIcon, UserCircleIcon, GlobeAltIcon } from './icons';

interface HeaderProps {
  onNavigate: (view: 'library' | 'pricing') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { theme, setTheme, language, setLanguage, t, user } = useApp();

  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  const toggleLanguage = () => {
    setLanguage(language === Language.EN ? Language.ES : Language.EN);
  };

  return (
    <header className="bg-light-surface dark:bg-dark-surface shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl md:text-2xl font-bold text-brand-primary cursor-pointer" onClick={() => onNavigate('library')}>
              {t('alile_play')}
            </h1>
            <nav className="hidden md:flex space-x-4">
              <button onClick={() => onNavigate('library')} className="text-light-text/80 dark:text-dark-text/80 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">{t('game_library')}</button>
              <button onClick={() => onNavigate('pricing')} className="text-light-text/80 dark:text-dark-text/80 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">{t('pricing')}</button>
            </nav>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <GlobeAltIcon className="w-6 h-6" />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="w-8 h-8 text-gray-400" />
              <span className="hidden sm:inline font-medium">{user.name}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
