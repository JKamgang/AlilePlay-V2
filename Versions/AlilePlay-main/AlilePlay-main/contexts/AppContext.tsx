
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
// Fix: Changed 'import type' to standard import so Language and Theme can be used as values (enums)
import { Language, Theme } from '../types';
import type { User } from '../types';
import { TRANSLATIONS, DEFAULT_USER } from '../constants';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  user: User;
  setUser: (user: User) => void;
  t: (key: string) => string;
  restoreState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'alile_play_snapshot_v22';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence Engine: Try to load from localStorage first
  const loadInitialState = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const initial = loadInitialState();
  const [user, setUser] = useState<User>(initial?.user || DEFAULT_USER);
  const [theme, setTheme] = useState<Theme>(initial?.theme || user.preferences.theme);
  const [language, setLanguage] = useState<Language>(initial?.language || user.preferences.language);

  // Sync to localStorage on every change
  useEffect(() => {
    const snapshot = { user, theme, language };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [user, theme, language]);

  const restoreState = () => {
    setUser(DEFAULT_USER);
    // Fix: Accessing Theme.DARK and Language.EN as values instead of types
    setTheme(Theme.DARK);
    setLanguage(Language.EN);
    localStorage.removeItem(STORAGE_KEY);
  };

  const t = (key: string): string => {
    const translation = TRANSLATIONS[language][key];
    if (translation) return translation;
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const value = useMemo(() => ({
    theme,
    setTheme,
    language,
    setLanguage,
    user,
    setUser,
    t,
    restoreState
  }), [theme, language, user]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
