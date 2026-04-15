
import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Language, Theme, User } from '../types';
import { TRANSLATIONS, DEFAULT_USER } from '../constants';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  user: User;
  setUser: (user: User) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [theme, setTheme] = useState<Theme>(user.preferences.theme);
  const [language, setLanguage] = useState<Language>(user.preferences.language);

  // Enhanced translation engine with safety fallback
  const t = (key: string): string => {
    const translation = TRANSLATIONS[language][key];
    if (translation) return translation;

    // Self-healing fallback: clean the key if it's missing from translations
    // Prevents "game_library" or "wordmaster_win" from appearing raw.
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
