import React, { useMemo, useState } from 'react';
import { Game, GameMode } from '@/shared/types';
import { GAMES, MOCK_LEADERBOARD, MOCK_ANALYTICS_DATA } from '@/shared/constants';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';
import GameCard from '@/entities/game/ui/GameCard';
import DashboardWidget from '@/widgets/DashboardWidget/ui/DashboardWidget';
import TournamentsWidget from '@/widgets/TournamentsWidget/ui/TournamentsWidget';
import ChatWidget from '@/features/chat/ui/ChatWidget';
import { ChartBarIcon, TrophyIcon } from '@/shared/ui/Icons/Icons';
import { SubscriptionWidget } from '@/features/subscription';
import { AdminWidget } from '@/features/admin';
import { LearningHubWidget } from '@/features/learning-hub';
import { TournamentCreatorWidget } from '@/features/tournament-organizer';
import { AffiliateDashboardWidget } from '@/features/affiliate';

interface DashboardProps {
  handlePlayGame: (game: Game, option?: string, mode?: GameMode) => void;
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

const Dashboard: React.FC<DashboardProps> = ({ handlePlayGame, t }) => {
    const [leaderboardFilter, setLeaderboardFilter] = useState('overall');

    const groupedGames = useMemo(() => {
        return GAMES.reduce((acc, game) => {
            const category = t(game.categoryKey);
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(game);
            return acc;
        }, {} as Record<string, Game[]>);
    }, [t]);

    const sortedLeaderboard = useMemo(() => {
        return [...MOCK_LEADERBOARD].sort((a, b) => {
            const scoreA = leaderboardFilter === 'overall' ? a.overallScore : (a.scores[leaderboardFilter] || 0);
            const scoreB = leaderboardFilter === 'overall' ? b.overallScore : (b.scores[leaderboardFilter] || 0);
            return scoreB - scoreA;
        });
    }, [leaderboardFilter]);

    return (
        <div className="space-y-8 sm:space-y-12 animate-fade-in">
            {/* Dashboard Widgets */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
                <SubscriptionWidget />
                <AdminWidget />
                <LearningHubWidget />
                <TournamentCreatorWidget />
                <AffiliateDashboardWidget />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                <DashboardWidget title={t('leaderboard')} icon={<TrophyIcon className="w-6 h-6"/>}>
                    <div className="flex gap-2 mb-3">
                        <button onClick={() => setLeaderboardFilter('overall')} className={`px-2 py-1 text-[10px] font-semibold rounded-full transition-colors ${leaderboardFilter === 'overall' ? 'bg-brand-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{t('overall')}</button>
                        <button onClick={() => setLeaderboardFilter('scrabble')} className={`px-2 py-1 text-[10px] font-semibold rounded-full transition-colors ${leaderboardFilter === 'scrabble' ? 'bg-brand-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{t('game_word_master')}</button>
                        <button onClick={() => setLeaderboardFilter('chess')} className={`px-2 py-1 text-[10px] font-semibold rounded-full transition-colors ${leaderboardFilter === 'chess' ? 'bg-brand-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{t('game_chess')}</button>
                    </div>
                    <ul className="space-y-2 text-gray-300">
                        {sortedLeaderboard.slice(0, 3).map((player, index) => (
                            <li key={player.id} className="flex justify-between items-center text-sm p-1.5 bg-gray-800/40 rounded">
                                <span className="flex items-center">
                                    <span className="font-bold text-gray-400 w-6">{index + 1}.</span>
                                    <img src={player.avatar} alt={player.name} className="w-6 h-6 rounded-full mr-2"/>
                                    {player.name}
                                </span>
                                <span className="font-bold text-white">{leaderboardFilter === 'overall' ? player.overallScore : (player.scores[leaderboardFilter] || 0)}</span>
                            </li>
                        ))}
                    </ul>
                </DashboardWidget>
                <TournamentsWidget t={t}/>
                <DashboardWidget title={t('player_activity')} icon={<ChartBarIcon className="w-6 h-6"/>}>
                    <div className="text-gray-300 text-sm">
                        <p>{t('live_players')}: <span className="font-bold text-white">1,337</span></p>
                        <div className="h-20 bg-gray-800/50 mt-4 rounded-md flex items-end p-2 gap-px">
                        {MOCK_ANALYTICS_DATA.map((d, i) => (
                            <div key={i} className="flex-1 bg-brand-primary/60 hover:bg-brand-primary rounded-t-sm transition-all" style={{ height: `${(d.value / 300) * 100}%`}}></div>
                        ))}
                        </div>
                    </div>
                </DashboardWidget>
                <ChatWidget t={t} />
            </section>

            {/* Game Grid */}
            <section>
                <h2 className="text-3xl font-bold text-white mb-6">{t('select_a_game')}</h2>
                 {Object.entries(groupedGames).map(([category, gamesInCategory]) => (
                    <div key={category} className="mb-8">
                        <h3 className="text-xl font-semibold text-brand-primary mb-4">{category}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                            {/* fix: Added type assertion to gamesInCategory to resolve "Property 'map' does not exist on type 'unknown'" */}
                            {(gamesInCategory as Game[]).map((game) => (
                                <GameCard key={game.id} game={game} onPlay={handlePlayGame} t={t} />
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};
export default Dashboard;