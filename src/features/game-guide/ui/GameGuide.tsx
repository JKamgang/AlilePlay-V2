import React from 'react';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';

interface GameGuideProps {
  gameId: string;
  onClose: () => void;
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

const GameGuide: React.FC<GameGuideProps> = ({ gameId, onClose, t }) => {
  const titleKey = `${gameId}_guide_title`;
  const contentKey = `${gameId}_guide_content`;

  const guideTitle = t(Object.keys(TRANSLATIONS.en).includes(titleKey) ? titleKey : 'default_guide_title');
  const guideContent = t(Object.keys(TRANSLATIONS.en).includes(contentKey) ? contentKey : 'default_guide_content');


  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in-down p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{guideTitle}</h2>
           <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </header>
        <main className="p-6 overflow-y-auto text-gray-300">
          <p className="whitespace-pre-wrap">{guideContent}</p>
        </main>
        <footer className="p-4 border-t border-gray-700 text-right">
           <button onClick={onClose} className="bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
              {t('close')}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default GameGuide;