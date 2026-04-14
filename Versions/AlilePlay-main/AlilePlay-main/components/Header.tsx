
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Language, Theme, AppView } from '../types';
import { SunIcon, MoonIcon, UserCircleIcon, GlobeAltIcon } from './icons';

interface HeaderProps {
  onNavigate: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { theme, setTheme, language, setLanguage, t, user } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };
  
  const toggleLanguage = () => {
    // Cycle through EN -> FR -> ES -> ZH
    const sequence = [Language.EN, Language.FR, Language.ES, Language.ZH];
    const currentIndex = sequence.indexOf(language);
    const nextIndex = (currentIndex + 1) % sequence.length;
    setLanguage(sequence[nextIndex]);
  };

  const handleNavigate = (view: AppView) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-light-surface dark:bg-dark-surface shadow-md sticky top-0 z-50 transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl md:text-2xl font-black text-brand-primary cursor-pointer hover:scale-105 transition-transform" onClick={() => handleNavigate('library')}>
              {t('alile_play')}
            </h1>
            <nav className="hidden lg:flex space-x-6">
              <button onClick={() => handleNavigate('library')} className="text-sm font-bold text-light-text/80 dark:text-dark-text/80 hover:text-brand-primary transition-colors uppercase tracking-widest">{t('game_library')}</button>
              <button onClick={() => handleNavigate('pricing')} className="text-sm font-bold text-light-text/80 dark:text-dark-text/80 hover:text-brand-primary transition-colors uppercase tracking-widest">{t('pricing')}</button>
              <button onClick={() => handleNavigate('about')} className="text-sm font-bold text-light-text/80 dark:text-dark-text/80 hover:text-brand-primary transition-colors uppercase tracking-widest">{t('about')}</button>
              <button onClick={() => handleNavigate('feedback')} className="text-sm font-bold text-light-text/80 dark:text-dark-text/80 hover:text-brand-primary transition-colors uppercase tracking-widest">{t('feedback')}</button>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-4">
               <button onClick={toggleLanguage} title="Change Language" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative flex items-center space-x-1">
                <GlobeAltIcon className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase text-brand-primary">{language}</span>
              </button>
              <button onClick={toggleTheme} title="Toggle Theme" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
              </button>
            </div>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-brand-primary focus:outline-none bg-brand-primary/10"
              aria-label="Toggle Navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>

            <div className="hidden md:flex items-center space-x-2 border-l border-gray-200 dark:border-gray-700 pl-4 ml-2">
              <UserCircleIcon className="w-8 h-8 text-brand-primary" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-brand-primary uppercase tracking-tighter leading-none">By Jean Baptiste</span>
                <span className="text-xs font-bold leading-tight truncate max-w-[80px]">Buford, GA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden animate-fade-in bg-light-surface dark:bg-dark-surface border-t border-gray-100 dark:border-gray-800 shadow-2xl">
          <div className="px-4 pt-4 pb-8 space-y-2">
            <button onClick={() => handleNavigate('library')} className="block w-full text-left px-4 py-4 text-lg font-black text-light-text dark:text-dark-text bg-black/5 dark:bg-white/5 rounded-xl">{t('game_library')}</button>
            <button onClick={() => handleNavigate('pricing')} className="block w-full text-left px-4 py-4 text-lg font-black text-light-text dark:text-dark-text bg-black/5 dark:bg-white/5 rounded-xl">{t('pricing')}</button>
            <button onClick={() => handleNavigate('about')} className="block w-full text-left px-4 py-4 text-lg font-black text-light-text dark:text-dark-text bg-black/5 dark:bg-white/5 rounded-xl">{t('about')}</button>
            <button onClick={() => handleNavigate('feedback')} className="block w-full text-left px-4 py-4 text-lg font-black text-light-text dark:text-dark-text bg-black/5 dark:bg-white/5 rounded-xl">{t('feedback')}</button>
            
            <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-800 mt-4">
              <button onClick={toggleTheme} className="flex-1 flex items-center justify-center space-x-2 bg-brand-primary text-white py-4 rounded-xl font-bold mr-2">
                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
              </button>
              <button onClick={toggleLanguage} className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 dark:bg-gray-800 py-4 rounded-xl font-bold ml-2">
                <GlobeAltIcon className="w-5 h-5" />
                <span>{language.toUpperCase()}</span>
              </button>
            </div>
            
            <div className="pt-6 text-center">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Jean Baptiste • Buford, GA</p>
               <p className="text-[10px] font-medium text-gray-400">JKamgang@hotmail.com</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
