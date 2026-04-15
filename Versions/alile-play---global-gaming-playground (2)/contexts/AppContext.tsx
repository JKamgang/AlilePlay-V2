
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

  const t = (key: string): string => {
    return TRANSLATIONS[language][key] || key;
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
