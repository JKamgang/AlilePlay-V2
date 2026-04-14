
import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Language, ChatMessage, Game, GameOption } from './types';
import { GAMES, TRANSLATIONS, MOCK_LEADERBOARD, MOCK_CHAT, AI_CREW } from './constants';
import Header from './components/Header';
import GameCard from './components/GameCard';
import DashboardWidget from './components/DashboardWidget';
import Footer from './components/Footer';
import { AnalyticsIcon, UsersIcon, ShieldCheckIcon, ChatBubbleIcon, SparklesIcon, CogIcon, DollarSignIcon, GlobeIcon, HandshakeIcon, RocketIcon, FeedbackIcon } from './components/Icons';
import { getMockAnalytics, moderateChatMessage } from './services/geminiService';
import GameContainer from './components/GameContainer';

// Game Options Modal Component
interface GameOptionsModalProps {
  game: Game;
  onClose: () => void;
  onStart: (optionValue: string) => void;
  t: (key: keyof typeof TRANSLATIONS | string) => string;
}

const GameOptionsModal: React.FC<GameOptionsModalProps> = ({ game, onClose, onStart, t }) => {
  const [selectedOption, setSelectedOption] = useState(game.options?.[0]?.value || '');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(selectedOption);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in-down" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-4">{game.name}: {t('select_option')}</h2>
        <form onSubmit={handleStart}>
          <div className="space-y-3 mb-6">
            {game.options?.map(option => (
              <label key={option.value} className="flex items-center text-white bg-gray-900 p-3 rounded-md cursor-pointer hover:bg-gray-700 transition-colors">
                <input
                  type="radio"
                  name="game-option"
                  value={option.value}
                  checked={selectedOption === option.value}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="h-4 w-4 text-brand-primary bg-gray-700 border-gray-600 focus:ring-brand-primary"
                />
                <span className="ml-3">{t(option.label)}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
              {t('cancel')}
            </button>
            <button type="submit" className="bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
              {t('start_game')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT);
  const [chatInput, setChatInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [selectedGameForOptions, setSelectedGameForOptions] = useState<Game | null>(null);
  const [activeGame, setActiveGame] = useState<Game & { option?: string } | null>(null);


  useEffect(() => {
    const fetchAnalytics = async () => {
        const data = await getMockAnalytics();
        setAnalyticsData(data);
    };
    fetchAnalytics();

    // Simulate AI agents posting in chat
    const chatInterval = setInterval(() => {
        const agent = AI_CREW[Math.floor(Math.random() * AI_CREW.length)];
        const message: ChatMessage = {
            id: Date.now(),
            user: agent.name,
            text: `Hello everyone! Remember to check out the new features on the platform. Have fun!`,
            isFlagged: false,
        };
        setChatMessages(prev => [...prev, message]);
    }, 25000); // Post every 25 seconds

    return () => clearInterval(chatInterval);
  }, []);

  // Fix: Ensure the translation function always returns a string to satisfy TypeScript types.
  const t = (key: keyof typeof TRANSLATIONS | string): string => {
    const translations = TRANSLATIONS as { [key: string]: { [lang in Language]: string } };
    return translations[key]?.[language] || String(key);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');

    const { isAggressive } = await moderateChatMessage(userMessage);

    const newMessage: ChatMessage = {
      id: Date.now(),
      user: 'You',
      text: userMessage,
      isFlagged: isAggressive,
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInput.trim()) return;

    setFeedbackStatus('submitting');
    // Simulate audit trail for admin monitoring
    console.log(`[AUDIT TRAIL] Feedback received at ${new Date().toISOString()}: "${feedbackInput}"`);

    setTimeout(() => {
      setFeedbackStatus('submitted');
      setFeedbackInput('');
      setTimeout(() => {
        setFeedbackStatus('idle');
      }, 3000);
    }, 1000);
  };
  
  const handlePlayClick = (game: Game) => {
    if (game.status !== 'playable') return;

    if (game.options && game.options.length > 0) {
        setSelectedGameForOptions(game);
    } else {
        console.log(`Starting game: ${game.name}`);
        setActiveGame(game);
    }
  };

  const handleStartGameWithOptions = (optionValue: string) => {
      if (selectedGameForOptions) {
          console.log(`Starting game: ${selectedGameForOptions.name} with option: ${optionValue}`);
          setActiveGame({ ...selectedGameForOptions, option: optionValue });
      }
      setSelectedGameForOptions(null); // Close modal
  };

  const handleCloseGame = () => {
    setActiveGame(null);
  }

  const groupedGames: Record<string, Game[]> = useMemo(() => {
    return GAMES.reduce((acc, game) => {
        (acc[game.category] = acc[game.category] || []).push(game);
        return acc;
    }, {} as Record<string, Game[]>);
  }, []);

  if (activeGame) {
    return <GameContainer game={activeGame} onClose={handleCloseGame} t={t} />;
  }

  return (
    <div className="min-h-screen bg-brand-dark font-sans">
      <Header currentLang={language} setLang={setLanguage} t={t} />

      {selectedGameForOptions && (
        <GameOptionsModal 
          game={selectedGameForOptions}
          onClose={() => setSelectedGameForOptions(null)}
          onStart={handleStartGameWithOptions}
          t={t}
        />
      )}
      
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 animate-fade-in-down">
          {t('welcome')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Main Content: Game Grid */}
          <div className="md:col-span-2 lg:col-span-3 xl:col-span-3 space-y-6">
            <DashboardWidget title={t('select_game')} icon={<SparklesIcon />}>
              <div className="space-y-8">
                {Object.entries(groupedGames).map(([category, gamesInCategory]) => (
                  <div key={category}>
                    <h3 className="text-xl font-bold text-gray-300 mb-4 border-b-2 border-gray-800 pb-2">{t(category)}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {gamesInCategory.map(game => <GameCard key={game.id} game={game} onPlay={handlePlayClick} t={t}/>)}
                    </div>
                  </div>
                ))}
              </div>
            </DashboardWidget>
            
            <DashboardWidget title={t('platform_analytics')} icon={<AnalyticsIcon />}>
                <div className="h-64 pr-4">
                   <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#F9FAFB' }} />
                            <Legend />
                            <Line type="monotone" dataKey="players" stroke="#4F46E5" strokeWidth={2} name={t('players')} />
                            <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name={t('revenue')} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </DashboardWidget>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <DashboardWidget title={t('leaderboard')} icon={<UsersIcon />}>
              <ul className="space-y-3">
                {MOCK_LEADERBOARD.map((player, index) => (
                  <li key={player.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className={`font-bold w-6 ${index < 3 ? 'text-brand-accent' : ''}`}>{index + 1}.</span>
                      <img src={`https://i.pravatar.cc/32?u=${player.id}`} alt={player.name} className="w-8 h-8 rounded-full mr-3" />
                      <span>{player.name}</span>
                    </div>
                    <span className="font-semibold text-brand-secondary">{player.score.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </DashboardWidget>

            <DashboardWidget title={t('live_chat')} icon={<ChatBubbleIcon />}>
              <div className="space-y-3 text-sm h-48 overflow-y-auto pr-2 mb-4">
                 {chatMessages.slice(-10).map(msg => ( // Show last 10 messages
                  <div key={msg.id} className={`${msg.isFlagged ? 'p-2 border border-red-500 rounded-md bg-red-900/20' : ''}`}>
                    <p><span className={`font-bold ${msg.user === 'You' ? 'text-brand-primary' : msg.user.includes(' ') ? 'text-yellow-400' : 'text-brand-accent'}`}>{msg.user}:</span> {msg.text}</p>
                    {msg.isFlagged && <p className="text-xs text-red-400 mt-1 flex items-center"><ShieldCheckIcon className="w-3 h-3 mr-1" /> {t('flagged_by_ai')}</p>}
                  </div>
                ))}
              </div>
               <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t('type_message')}
                    className="flex-grow bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:ring-brand-primary focus:border-brand-primary"
                />
                <button type="submit" className="bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200">
                    {t('send')}
                </button>
            </form>
            </DashboardWidget>

            <DashboardWidget title={t('provide_feedback')} icon={<FeedbackIcon />}>
              {feedbackStatus === 'submitted' ? (
                <div className="text-center text-green-400 flex items-center justify-center h-full">
                  <p>{t('feedback_received')}</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit}>
                  <textarea
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder={t('your_feedback')}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:ring-brand-primary focus:border-brand-primary mb-2"
                    disabled={feedbackStatus === 'submitting'}
                  />
                  <button
                    type="submit"
                    className="w-full bg-brand-secondary hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200 disabled:bg-gray-600"
                    disabled={feedbackStatus === 'submitting' || !feedbackInput.trim()}
                  >
                    {feedbackStatus === 'submitting' ? t('submitting') : t('submit')}
                  </button>
                </form>
              )}
            </DashboardWidget>

             <DashboardWidget title={t('user_verification')} icon={<ShieldCheckIcon />}>
                <div className="text-sm space-y-2">
                    <p className="flex items-center text-green-400">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        Email Verified (OAuth)
                    </p>
                    <p className="flex items-center text-yellow-400">
                         <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.001-1.742 3.001H4.42c-1.532 0-2.492-1.667-1.742-3.001l5.58-9.92zM10 5a1 1 0 011 1v3a1 1 0 11-2 0V6a1 1 0 011-1zm1 5a1 1 0 10-2 0v2a1 1 0 102 0v-2z" clipRule="evenodd"></path></svg>
                        Profile Completion Required (3 plays left)
                    </p>
                     <p className="flex items-center text-red-400">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                        ID Submission Pending
                    </p>
                </div>
            </DashboardWidget>
          </div>
        </div>

        {/* AI and Monetization Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-white mb-4">{t('platform_management')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <DashboardWidget title={t('ai_crew_status')} icon={<CogIcon />}>
                <ul className="space-y-2 text-sm">
                    {AI_CREW.map(agent => (
                         <li key={agent.id} className="flex items-center justify-between">
                            <span>{agent.name}</span>
                            <span className="flex items-center text-green-400">
                                <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                                {t('online')}
                            </span>
                        </li>
                    ))}
                </ul>
            </DashboardWidget>
            <DashboardWidget title={t('monetization')} icon={<DollarSignIcon />}>
                <div className="text-sm space-y-2">
                    <p>{t('plan')}: <span className="font-bold text-brand-accent">Pro Tier</span></p>
                    <p>{t('ads_revenue')}: <span className="font-bold text-brand-secondary">$1,250.75</span></p>
                    <button className="w-full text-center bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded mt-2 text-sm transition-colors duration-200">
                        {t('manage_subscription')}
                    </button>
                </div>
            </DashboardWidget>
             <DashboardWidget title={t('white_label')} icon={<HandshakeIcon />}>
                 <p className="text-sm text-gray-300 mb-3">{t('white_label_desc')}</p>
                 <button className="w-full text-center bg-brand-secondary hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200">
                    {t('learn_more')}
                </button>
            </DashboardWidget>
             <DashboardWidget title={t('affiliate_program')} icon={<RocketIcon />}>
                 <p className="text-sm text-gray-300 mb-3">{t('affiliate_desc')}</p>
                 <button className="w-full text-center bg-brand-accent hover:bg-amber-400 text-gray-900 font-bold py-2 px-4 rounded text-sm transition-colors duration-200">
                    {t('join_now')}
                </button>
            </DashboardWidget>
             <DashboardWidget title={t('deployment_options')} icon={<GlobeIcon />}>
                 <p className="text-sm text-gray-300">{t('deployment_desc')}</p>
                 <div className="flex justify-around mt-3 text-gray-400">
                    <span>Desktop</span> • <span>Cloud</span> • <span>Mobile</span> • <span>Avionics</span>
                 </div>
            </DashboardWidget>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
