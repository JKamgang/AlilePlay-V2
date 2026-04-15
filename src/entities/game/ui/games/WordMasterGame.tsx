import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { LETTER_SCORES, BOARD_LAYOUT, TILE_BAG } from '@/shared/constants';
import { WordAnalysis } from '@/shared/types';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';
import { aiRouter } from '@/shared/api/ai/aiRouter';
import { ShieldCheckIcon } from '@/shared/ui/Icons/Icons';

interface WordMasterGameProps {
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

type PlacedTile = { tile: string; rackIndex: number };
type BoardState = (string | null)[][];

const createInitialBoard = (): BoardState => Array.from({ length: 15 }, () => Array(15).fill(null));

const WordMasterGame: React.FC<WordMasterGameProps> = ({ t }) => {
  const [boardState, setBoardState] = useState<BoardState>(createInitialBoard());
  const [tileBag, setTileBag] = useState<string[]>([]);
  const [playerTiles, setPlayerTiles] = useState<string[]>([]);
  const [placements, setPlacements] = useState<Map<string, PlacedTile>>(new Map());
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFirstMove, setIsFirstMove] = useState(true);

  const [analysis, setAnalysis] = useState<WordAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const drawTiles = useCallback((currentTiles: string[], currentTileBag: string[]) => {
      const needed = 7 - currentTiles.length;
      if (needed <= 0 || currentTileBag.length === 0) return { newTiles: currentTiles, newBag: currentTileBag };

      const newBag = [...currentTileBag];
      const drawnTiles = [];
      for (let i = 0; i < needed; i++) {
          if (newBag.length > 0) {
              const randomIndex = Math.floor(Math.random() * newBag.length);
              drawnTiles.push(newBag.splice(randomIndex, 1)[0]);
          }
      }
      return { newTiles: [...currentTiles, ...drawnTiles], newBag: newBag };
  }, []);

  useEffect(() => {
    const { newTiles, newBag } = drawTiles([], TILE_BAG.split(''));
    setPlayerTiles(newTiles);
    setTileBag(newBag);
  }, [drawTiles]);

  const handleTileClick = (index: number) => {
    setSelectedTileIndex(prev => prev === index ? null : index);
  };

  const handleBoardClick = (y: number, x: number) => {
    if (selectedTileIndex === null || boardState[y][x] !== null || placements.has(`${y},${x}`)) return;

    const tile = playerTiles[selectedTileIndex];
    const newPlacements = new Map(placements);
    newPlacements.set(`${y},${x}`, { tile, rackIndex: selectedTileIndex });
    setPlacements(newPlacements);
    setSelectedTileIndex(null);
  };

  const handleClearPlacements = useCallback(() => {
    setPlacements(new Map());
    setError('');
  }, []);

  const handlePlayWord = () => {
    setError('');
    if (placements.size === 0) return;

    // fix: Explicitly cast Map keys to string to resolve "Property 'split' does not exist on type 'unknown'"
    const placedCoords = Array.from<string>(placements.keys()).map(key => key.split(',').map(Number));
    const isHorizontal = placedCoords.every(c => c[0] === placedCoords[0][0]);
    const isVertical = placedCoords.every(c => c[1] === placedCoords[0][1]);

    if (!isHorizontal && !isVertical && placedCoords.length > 1) {
      setError(t('invalid_placement'));
      return;
    }

    let isConnected = false;
    let coversCenter = false;
    for (const [y, x] of placedCoords) {
        if (isFirstMove && y === 7 && x === 7) coversCenter = true;
        const neighbors = [[y-1,x], [y+1,x], [y,x-1], [y,x+1]];
        if (neighbors.some(([ny, nx]) => boardState[ny]?.[nx])) {
            isConnected = true;
        }
    }

    if (isFirstMove && !coversCenter) {
        setError(t('first_word_error'));
        return;
    }
    if (!isFirstMove && !isConnected && boardState.flat().some(c => c) && placements.size > 0) {
        setError(t('invalid_placement'));
        return;
    }

    let wordScore = 0;
    let wordMultiplier = 1;
    // fix: Explicitly cast Map values to PlacedTile to resolve "Property 'tile' does not exist on type 'unknown'"
    const word = Array.from<PlacedTile>(placements.values()).map(p => p.tile).join('');

    placements.forEach((placement, key) => {
        const [y, x] = key.split(',').map(Number);
        // fix: Added type assertion for placement to resolve "Property 'tile' does not exist on type 'unknown'"
        const letter = placement.tile;
        let letterScore = LETTER_SCORES[letter] || 0;
        const bonus = BOARD_LAYOUT[y][x];
        if (bonus === '2L') letterScore *= 2;
        if (bonus === '3L') letterScore *= 3;
        if (bonus === '2W' || bonus === 'STAR') wordMultiplier *= 2;
        if (bonus === '3W') wordMultiplier *= 3;
        wordScore += letterScore;
    });

    wordScore *= wordMultiplier;
    setScore(prev => prev + wordScore);

    const newBoard = boardState.map(row => [...row]);
    const usedRackIndices = new Set<number>();
    placements.forEach((placement, key) => {
        const [y, x] = key.split(',').map(Number);
        // fix: Added type assertion for placement to resolve "Property 'tile' does not exist on type 'unknown'"
        newBoard[y][x] = placement.tile;
        // fix: Added type assertion for placement to resolve "Property 'rackIndex' does not exist on type 'unknown'"
        usedRackIndices.add(placement.rackIndex);
    });
    setBoardState(newBoard);

    const remainingTiles = playerTiles.filter((_, index) => !usedRackIndices.has(index));
    const { newTiles, newBag } = drawTiles(remainingTiles, tileBag);

    setPlayerTiles(newTiles);
    setTileBag(newBag);
    setPlacements(new Map());
    setIsFirstMove(false);
    handleAnalyzeWord(word);
  };

  const handleAnalyzeWord = async (word: string) => {
    if (!word.trim()) return;
    setIsLoading(true);
    setAnalysis(null);
    try {
        const prompt = `Provide a detailed analysis for the word "${word}". Also provide a reasonable point score as if it were a Scrabble word.
        Format your response exactly as JSON like this, with NO backticks or markdown, just the raw JSON:
        {"definition": "the definition", "synonyms": ["word1", "word2"], "antonyms": ["word3"], "example": "an example", "etymology": "the origin", "score": 10}`;
        const responseText = await aiRouter.generateContent({
            userTier: 'free',
            taskType: 'basic',
            prompt: prompt,
        });

        let jsonStr = responseText.trim();
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.slice(7, -3);
        } else if (jsonStr.startsWith("```")) {
            jsonStr = jsonStr.slice(3, -3);
        }

        const result = JSON.parse(jsonStr) as WordAnalysis;
        setAnalysis(result);
    } catch (e) {
        console.error("Error analyzing word:", e);
        setError('Failed to get analysis.');
    } finally {
        setIsLoading(false);
    }
  };

  const currentPlacedWord = useMemo(() => Array.from<PlacedTile>(placements.values()).map(p => p.tile).join(''), [placements]);
  const displayTiles = useMemo(() => {
      const placedRackIndices = new Set(Array.from<PlacedTile>(placements.values()).map(p => p.rackIndex));
      return playerTiles.map((tile, index) => ({
          tile,
          placed: placedRackIndices.has(index)
      }));
  }, [playerTiles, placements]);

  const bonusStyles: { [key: string]: string } = {
    '2L': 'bg-cyan-800/70 text-cyan-200', '3L': 'bg-blue-800/70 text-blue-200',
    '2W': 'bg-pink-800/70 text-pink-200', '3W': 'bg-red-800/70 text-red-200',
    'STAR': 'bg-yellow-600/70 text-yellow-100',
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-4 p-2 sm:p-4">
      <div className="w-full lg:w-3/5 flex flex-col items-center">
        <div className="w-full max-w-xl aspect-square grid grid-cols-15 bg-blue-900/30 p-1 sm:p-2 rounded-md shadow-lg">
            {boardState.map((row, y) => row.map((cell, x) => {
                const key = `${y},${x}`;
                const placement = placements.get(key);
                const bonus = BOARD_LAYOUT[y][x];
                const bonusClass = bonus ? bonusStyles[bonus] : 'bg-gray-700/50';

                return (
                    <div key={key} className={`aspect-square border border-gray-900/50 rounded-sm flex items-center justify-center relative transition-colors ${!cell && !placement && 'hover:bg-brand-primary/20 cursor-pointer'} ${bonusClass}`} onClick={() => handleBoardClick(y,x)}>
                        {bonus && !cell && !placement && <span className="text-[8px] sm:text-[10px] font-bold opacity-70">{bonus === 'STAR' ? '★' : bonus}</span>}
                        {(cell || placement) && (
                            <div className="w-[95%] h-[95%] bg-yellow-200 text-gray-900 font-bold text-lg sm:text-xl rounded-sm flex items-center justify-center shadow-inner relative">
                                {cell || placement?.tile}
                                <span className="absolute bottom-0 right-1 text-[8px] sm:text-[10px] text-gray-700">{LETTER_SCORES[cell || placement!.tile]}</span>
                            </div>
                        )}
                    </div>
                )
            }))}
        </div>

        <div className="mt-4 p-2 bg-gray-900/50 rounded-lg w-full max-w-xl">
             <div className="flex justify-center items-center gap-1 sm:gap-2 min-h-[56px]">
                {displayTiles.map(({tile, placed}, index) => (
                    <div key={index}
                         className={`w-9 h-9 sm:w-12 sm:h-12 bg-yellow-200 text-gray-900 font-bold text-xl sm:text-2xl rounded-md flex items-center justify-center shadow-md relative transition-all duration-200 ${selectedTileIndex === index ? 'ring-2 ring-brand-accent scale-110 -translate-y-2' : ''} ${placed ? 'opacity-30' : 'cursor-pointer hover:bg-yellow-300'}`}
                         onClick={() => !placed && handleTileClick(index)}
                    >
                        {tile}
                        <span className="absolute bottom-0 right-1 text-xs text-gray-700">{LETTER_SCORES[tile]}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-center gap-2 mt-3">
                <button onClick={handlePlayWord} className="bg-brand-secondary hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded text-sm transition-colors disabled:bg-gray-600">{t('play_word')}</button>
                <button onClick={handleClearPlacements} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded text-sm transition-colors">{t('clear_placement')}</button>
            </div>
             {error && <p className="text-red-400 text-center text-sm mt-2">{error}</p>}
        </div>
      </div>

      <div className="w-full lg:w-2/5 bg-gray-800/50 p-4 rounded-lg flex flex-col">
        <div className="flex justify-between items-center mb-4">
             <h3 className="text-xl font-bold text-brand-primary flex items-center"><ShieldCheckIcon className="w-6 h-6 mr-2" /> {t('ai_word_coach')}</h3>
             <div className="text-right">
                <span className="text-gray-400 font-semibold">{t('score')}</span>
                <p className="text-2xl font-bold">{score}</p>
             </div>
        </div>

        <div className="space-y-3">
           <input type="text" value={currentPlacedWord} readOnly placeholder="Place tiles on board" className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white"/>
            <button onClick={() => handleAnalyzeWord(currentPlacedWord)} disabled={isLoading || currentPlacedWord.length === 0} className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors disabled:bg-gray-600">
                {isLoading ? 'Analyzing...' : t('analyze_word')}
            </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700 flex-grow overflow-y-auto text-gray-300 text-sm">
            {isLoading && <p>Loading...</p>}
            {!isLoading && !analysis && (
              <div className="text-center text-gray-400 pt-8">
                <p>Play a word or place tiles and click analyze.</p>
              </div>
            )}
            {analysis && (
               <div className="space-y-2 animate-fade-in-down">
                  {analysis.score && <p><strong className="text-brand-accent capitalize">{t('points')}:</strong> {analysis.score}</p>}
                  <p><strong className="text-brand-accent capitalize">{t('definition')}:</strong> {analysis.definition}</p>
                  {analysis.synonyms && <p><strong className="text-brand-accent capitalize">{t('synonyms')}:</strong> {analysis.synonyms.join(', ')}</p>}
                  {analysis.antonyms && <p><strong className="text-brand-accent capitalize">{t('antonyms')}:</strong> {analysis.antonyms.join(', ')}</p>}
                  {analysis.example && <p><strong className="text-brand-accent capitalize">{t('example')}:</strong> <em>"{analysis.example}"</em></p>}
                  {analysis.etymology && <p><strong className="text-brand-accent capitalize">{t('etymology')}:</strong> {analysis.etymology}</p>}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WordMasterGame;