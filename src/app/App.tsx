import React, { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Game, Language, GameMode } from '@/shared/types';
import Header from '@/widgets/Header/ui/Header';
import Footer from '@/widgets/Footer/ui/Footer';
import GameContainer from '@/widgets/GameContainer/ui/GameContainer';
import Dashboard from '@/pages/Dashboard/ui/Dashboard';
import SupportAgent from '@/features/support/ui/SupportAgent';
import ErrorBoundary from '@/shared/ui/ErrorBoundary/ErrorBoundary';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [selectedGame, setSelectedGame] = useState<(Game & { option?: string; mode?: GameMode }) | null>(null);

  const t = useCallback((key: keyof typeof TRANSLATIONS.en | string): string => {
    const translationsForLang = TRANSLATIONS[lang] || TRANSLATIONS.en;
    // Use type assertion to access string keys safely
    const dict = translationsForLang as Record<string, string>;
    return dict[key] || (TRANSLATIONS.en as Record<string, string>)[key] || key;
  }, [lang]);

  const handlePlayGame = (game: Game, option?: string, mode?: GameMode) => {
    setSelectedGame({
      ...game,
      option: option || game.options?.[0]?.value,
      mode: mode || game.modes?.[0]?.value,
    });
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary t={t}>
        <div className="bg-brand-dark min-h-screen font-sans text-gray-200 flex flex-col relative">
          <Header currentLang={lang} setLang={setLang} />
          <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
            {selectedGame ? (
              <GameContainer game={selectedGame} onClose={handleCloseGame} t={t} />
            ) : (
              <Dashboard handlePlayGame={handlePlayGame} t={t} />
            )}
          </main>
          {!selectedGame && <Footer />}
          <SupportAgent t={t} />
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;