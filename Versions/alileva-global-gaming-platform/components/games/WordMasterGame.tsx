import React, { useState } from 'react';
import { TRANSLATIONS } from '../../constants';
import { WordAnalysis } from '../../types';
import { getWordAnalysis, suggestBestWord } from '../../services/geminiService';
import { ShieldCheckIcon } from '../Icons';

interface WordMasterGameProps {
  t: (key: keyof typeof TRANSLATIONS | string) => string;
}

const WordMasterGame: React.FC<WordMasterGameProps> = ({ t }) => {
  const [tiles, setTiles] = useState<string[]>(['G', 'A', 'M', 'I', 'N', 'G', 'W']);
  const [wordToAnalyze, setWordToAnalyze] = useState('');
  const [analysis, setAnalysis] = useState<WordAnalysis | null>(null);
  const [suggestion, setSuggestion] = useState<{word: string, points: number} | null>(null);
  const [detailLevel, setDetailLevel] = useState<'basic' | 'full'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const canFormWord = (word: string, availableTiles: string[]) => {
      const tempTiles = [...availableTiles];
      for (const char of word) {
          const index = tempTiles.indexOf(char);
          if (index === -1) {
              return false;
          }
          tempTiles.splice(index, 1);
      }
      return true;
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordToAnalyze.trim()) return;

    if (!canFormWord(wordToAnalyze, tiles)) {
        setError(t('word_not_possible'));
        setAnalysis(null);
        return;
    }

    setIsLoading(true);
    setError('');
    setAnalysis(null);
    setSuggestion(null);
    try {
        const result = await getWordAnalysis(wordToAnalyze, detailLevel);
        setAnalysis(result);
    } catch (err) {
        setError('Failed to get analysis.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleSuggest = async () => {
    setIsLoading(true);
    setError('');
    setAnalysis(null);
    setSuggestion(null);
    try {
        const result = await suggestBestWord(tiles);
        if (result) {
            setSuggestion(result);
            setWordToAnalyze(result.word); // Pre-fill for easy analysis
        }
    } catch (err) {
        setError('Failed to get suggestion.');
    } finally {
        setIsLoading(false);
    }
  };

  const AnalysisResult = () => {
      if (!analysis) return null;
      return (
          <div className="space-y-3 mt-4 text-sm animate-fade-in-down">
              <p><strong className="text-brand-accent capitalize">{t('definition')}:</strong> {analysis.definition}</p>
              {analysis.synonyms && <p><strong className="text-brand-accent capitalize">{t('synonyms')}:</strong> {analysis.synonyms.join(', ')}</p>}
              {analysis.antonyms && <p><strong className="text-brand-accent capitalize">{t('antonyms')}:</strong> {analysis.antonyms.join(', ')}</p>}
              {analysis.example && <p><strong className="text-brand-accent capitalize">{t('example')}:</strong> <em>"{analysis.example}"</em></p>}
              {analysis.etymology && <p><strong className="text-brand-accent capitalize">{t('etymology')}:</strong> {analysis.etymology}</p>}
          </div>
      )
  };

  const SuggestionResult = () => {
    if (!suggestion) return null;
    return (
        <div className="mt-4 p-3 bg-brand-primary/20 border border-brand-primary rounded-lg animate-fade-in-down">
            <h4 className="font-bold text-brand-accent">{t('ai_suggestion')}</h4>
            <p className="text-lg">{t('word')}: <span className="font-bold text-white">{suggestion.word}</span></p>
            <p className="text-lg">{t('points')}: <span className="font-bold text-white">{suggestion.points}</span></p>
        </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-6 p-4">
      {/* Game Board Side */}
      <div className="flex-grow w-full lg:w-2/3 flex flex-col items-center justify-center bg-gray-800/50 p-6 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-300 mb-4">Word Master Board</h3>
        <div className="grid grid-cols-15 w-full max-w-md aspect-square bg-blue-900/30 p-2 rounded-md">
            {/* Mock Scrabble board */}
            {Array.from({ length: 15 * 15 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-700 border border-gray-900/50 rounded-sm flex items-center justify-center text-xs text-gray-500">
                </div>
            ))}
        </div>
        <div className="mt-6">
            <h4 className="text-lg font-bold text-gray-400 mb-2">{t('your_tiles')}</h4>
            <div className="flex gap-2">
                {tiles.map((tile, i) => (
                    <div key={i} className="w-10 h-10 bg-yellow-200 text-gray-900 font-bold text-xl rounded-md flex items-center justify-center shadow-md">
                        {tile}
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* AI Coach Side */}
      <div className="w-full lg:w-1/3 bg-gray-800/50 p-6 rounded-lg flex flex-col">
        <h3 className="text-2xl font-bold text-brand-primary mb-4 flex items-center"><ShieldCheckIcon className="w-6 h-6 mr-2" /> {t('ai_word_coach')}</h3>
        <div className="space-y-4">
            <form onSubmit={handleAnalyze}>
                <input
                    type="text"
                    value={wordToAnalyze}
                    onChange={(e) => setWordToAnalyze(e.target.value.toUpperCase())}
                    placeholder="Type word to analyze"
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:ring-brand-primary focus:border-brand-primary"
                />
                 <fieldset className="my-3">
                    <legend className="text-sm font-medium text-gray-400 mb-1">{t('detail_level')}</legend>
                    <div className="flex gap-4">
                        <label className="flex items-center"><input type="radio" name="detail" value="basic" checked={detailLevel === 'basic'} onChange={() => setDetailLevel('basic')} className="h-4 w-4 text-brand-primary bg-gray-700 border-gray-600 focus:ring-brand-primary" /> <span className="ml-2 text-sm">{t('basic')}</span></label>
                        <label className="flex items-center"><input type="radio" name="detail" value="full" checked={detailLevel === 'full'} onChange={() => setDetailLevel('full')} className="h-4 w-4 text-brand-primary bg-gray-700 border-gray-600 focus:ring-brand-primary" /> <span className="ml-2 text-sm">{t('full_analysis')}</span></label>
                    </div>
                </fieldset>
                <button type="submit" disabled={isLoading} className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors disabled:bg-gray-600">
                    {isLoading && !suggestion ? 'Analyzing...' : t('analyze_word')}
                </button>
            </form>
             <button onClick={handleSuggest} disabled={isLoading} className="w-full bg-brand-secondary hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors disabled:bg-gray-600">
                 {isLoading && !analysis ? 'Thinking...' : t('get_suggestion')}
            </button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700 flex-grow overflow-y-auto text-gray-300">
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-400">{error}</p>}
            <AnalysisResult />
            <SuggestionResult />
        </div>
      </div>
    </div>
  );
};

export default WordMasterGame;