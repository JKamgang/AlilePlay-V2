import React from 'react';
import DashboardWidget from '@/widgets/DashboardWidget/ui/DashboardWidget';
import { TrophyIcon } from '@/shared/ui/Icons/Icons';
import { MOCK_TOURNAMENTS } from '@/shared/constants';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';

interface TournamentsWidgetProps {
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

const TournamentsWidget: React.FC<TournamentsWidgetProps> = ({ t }) => {
  return (
    <DashboardWidget title={t('tournaments')} icon={<TrophyIcon className="w-6 h-6"/>}>
      <ul className="space-y-3 text-gray-300 text-sm">
        {MOCK_TOURNAMENTS.map(tournament => (
            <li key={tournament.id} className="p-2 bg-gray-800/50 rounded-md">
                <p className="font-bold text-white">{t(tournament.gameKey)}</p>
                <p>Prize: {tournament.prize} | Starts in: <span className="text-brand-accent">{t(tournament.startsInKey)}</span></p>
            </li>
        ))}
      </ul>
    </DashboardWidget>
  );
};

export default TournamentsWidget;