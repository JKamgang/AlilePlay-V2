
import React, { useState } from 'react';
import Header from './components/Header';
import ErrorBoundary from './features/ErrorBoundary';
import GameLibrary from './features/game-library/GameLibrary';
import GameScreen from './features/games/GameScreen';
import PricingPage from './features/pricing/PricingPage';
import AboutPage from './features/about/AboutPage';
import FeedbackPage from './features/feedback/FeedbackPage';
import { useApp } from './contexts/AppContext';
import AIChatWidget from './features/ai-chat/AIChatWidget';
import type { Game, AppView } from './types';

const App: React.FC = () => {
  const { theme } = useApp();
  const [currentView, setCurrentView] = useState<AppView>('library');
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
  };

  const startGame = (game: Game) => {
    setActiveGame(game);
    setCurrentView('game');
  };

  const exitGame = () => {
    setActiveGame(null);
    setCurrentView('library');
  };

  const renderView = () => {
    switch (currentView) {
      case 'game':
        return activeGame ? <GameScreen game={activeGame} onExit={exitGame} /> : <GameLibrary onPlay={startGame} />;
      case 'pricing':
        return <PricingPage />;
      case 'about':
        return <AboutPage />;
      case 'feedback':
        return <FeedbackPage />;
      case 'library':
      default:
        return <GameLibrary onPlay={startGame} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-sans transition-colors duration-300">
        <Header onNavigate={navigateTo} />
        <main className="p-4 sm:p-6 md:p-8">
          {renderView()}
        </main>
        <AIChatWidget />
      </div>
    </ErrorBoundary>
  );
};

export default App;
