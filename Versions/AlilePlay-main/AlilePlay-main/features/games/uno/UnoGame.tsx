import React, { useState, useEffect, useCallback } from 'react';
import type { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

// Types
type Color = 'red' | 'green' | 'blue' | 'yellow' | 'wild';
type Value = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wildDraw4';
interface UnoCard {
  color: Color;
  value: Value;
  id: number;
}
type PlayerHand = UnoCard[];

// Constants
const COLORS: Exclude<Color, 'wild'>[] = ['red', 'green', 'blue', 'yellow'];
const VALUES: Exclude<Value, 'wild' | 'wildDraw4'>[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];

const createDeck = (): UnoCard[] => {
  const deck: UnoCard[] = [];
  let id = 0;
  COLORS.forEach(color => {
    deck.push({ color, value: '0', id: id++ });
    for (let i = 0; i < 2; i++) {
      VALUES.slice(1).forEach(value => deck.push({ color, value, id: id++ }));
    }
  });
  for (let i = 0; i < 4; i++) {
    deck.push({ color: 'wild', value: 'wild', id: id++ });
    deck.push({ color: 'wild', value: 'wildDraw4', id: id++ });
  }
  return deck;
};

const shuffleDeck = (deck: UnoCard[]): UnoCard[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const isPlayable = (card: UnoCard, topCard: UnoCard): boolean => {
  if (!topCard) return true; // Should not happen in a real game
  if (card.color === 'wild') return true;
  return card.color === topCard.color || card.value === topCard.value;
};

const drawCards = (
  deck: UnoCard[],
  discardPile: UnoCard[],
  hand: PlayerHand,
  count: number
): { newDeck: UnoCard[], newDiscardPile: UnoCard[], newHand: PlayerHand } => {
  let currentDeck = [...deck];
  let currentDiscard = [...discardPile];

  if (currentDeck.length < count) {
    const topCard = currentDiscard.length > 0 ? currentDiscard[currentDiscard.length - 1] : undefined;
    const toShuffle = currentDiscard.slice(0, -1);
    currentDeck.push(...shuffleDeck(toShuffle));
    currentDiscard = topCard ? [topCard] : [];
  }

  const numToDraw = Math.min(count, currentDeck.length);
  const drawnCards = currentDeck.slice(0, numToDraw);
  const remainingDeck = currentDeck.slice(numToDraw);
  const newHand = [...hand, ...drawnCards];

  return { newDeck: remainingDeck, newDiscardPile: currentDiscard, newHand };
};


// --- Components ---

const CardComponent: React.FC<{ card: UnoCard; onClick?: () => void; isFaceDown?: boolean; isDisabled?: boolean }> = ({ card, onClick, isFaceDown = false, isDisabled = false }) => {
  if (isFaceDown) {
    return <div onClick={onClick} className="w-20 h-28 sm:w-24 sm:h-36 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center text-brand-primary font-bold text-4xl shadow-lg cursor-pointer">UNO</div>
  }

  const colorClasses: Record<Color, string> = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-400',
    wild: 'bg-gradient-to-br from-red-500 via-green-500 via-blue-500 to-yellow-400',
  };

  const valueMap: Record<Value, string> = {
    'skip': '🚫', 'reverse': '🔄', 'draw2': '+2', 'wild': '🎨', 'wildDraw4': '+4',
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
  };

  return (
    <button onClick={onClick} disabled={isDisabled} className={`w-20 h-28 sm:w-24 sm:h-36 rounded-lg border-2 border-black/20 flex flex-col justify-center items-center font-bold text-white shadow-lg transition-transform hover:scale-105 hover:-translate-y-2 disabled:cursor-not-allowed disabled:opacity-70 ${colorClasses[card.color]}`}>
      <span className="text-4xl">{valueMap[card.value]}</span>
      <span className="absolute top-1 left-2 text-xl">{valueMap[card.value]}</span>
      <span className="absolute bottom-1 right-2 text-xl transform rotate-180">{valueMap[card.value]}</span>
    </button>
  );
};

const ColorChooser: React.FC<{ onSelect: (color: Color) => void }> = ({ onSelect }) => (
  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-lg flex space-x-2">
      {COLORS.map(color => (
        <button key={color} onClick={() => onSelect(color)} className={`w-16 h-16 rounded-full bg-${color}-500 hover:scale-110 transition-transform`}></button>
      ))}
    </div>
  </div>
);

const UnoGame: React.FC<{ game: Game; options: any; }> = ({ game }) => {
  const { t } = useApp();
  const [playerHand, setPlayerHand] = useState<PlayerHand>([]);
  const [aiHand, setAiHand] = useState<PlayerHand>([]);
  const [deck, setDeck] = useState<UnoCard[]>([]);
  const [discardPile, setDiscardPile] = useState<UnoCard[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [message, setMessage] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [isChoosingColor, setIsChoosingColor] = useState(false);
  const [playedCard, setPlayedCard] = useState<UnoCard | null>(null);

  const topCard = discardPile[discardPile.length - 1];

  const startGame = useCallback(() => {
    let newDeck = shuffleDeck(createDeck());
    let firstCardIndex = newDeck.findIndex(c => !isNaN(parseInt(c.value)));
    const firstCard = newDeck.splice(firstCardIndex, 1)[0];

    const initialPlayerHand = newDeck.splice(0, 7);
    const initialAiHand = newDeck.splice(0, 7);

    setDeck(newDeck);
    setDiscardPile([firstCard]);
    setPlayerHand(initialPlayerHand);
    setAiHand(initialAiHand);
    setIsPlayerTurn(true);
    setWinner(null);
    setMessage('Your turn!');
    setIsChoosingColor(false);
  }, []);

  useEffect(() => { startGame(); }, [startGame]);

  const handleTurnEnd = useCallback((card: UnoCard, wasPlayer: boolean) => {
    let nextPlayerIsSkipped = false;
    let cardsToDraw = 0;

    switch (card.value) {
        case 'skip':
        case 'reverse':
            nextPlayerIsSkipped = true;
            setMessage(`${wasPlayer ? 'AI' : 'You are'} skipped!`);
            break;
        case 'draw2':
            cardsToDraw = 2;
            nextPlayerIsSkipped = true;
            setMessage(`${wasPlayer ? 'AI draws 2 and is' : 'You draw 2 and are'} skipped!`);
            break;
        case 'wildDraw4':
            cardsToDraw = 4;
            nextPlayerIsSkipped = true;
            setMessage(`${wasPlayer ? 'AI draws 4 and is' : 'You draw 4 and are'} skipped!`);
            break;
    }

    if (cardsToDraw > 0) {
        const opponentHand = wasPlayer ? aiHand : playerHand;
        const { newDeck, newDiscardPile, newHand } = drawCards(deck, discardPile, opponentHand, cardsToDraw);
        setDeck(newDeck);
        setDiscardPile(newDiscardPile);
        if (wasPlayer) setAiHand(newHand);
        else setPlayerHand(newHand);
    }

    if (!nextPlayerIsSkipped) {
      setIsPlayerTurn(p => !p);
    }
  }, [aiHand, playerHand, deck, discardPile]);

  const handleColorChoice = useCallback((color: Color) => {
    if (!playedCard) return;
    const newTopCard: UnoCard = { ...playedCard, color: color };
    setDiscardPile(prev => [...prev, newTopCard]);
    setIsChoosingColor(false);
    setPlayedCard(null);
    handleTurnEnd(newTopCard, isPlayerTurn);
  }, [playedCard, handleTurnEnd, isPlayerTurn]);

  const playCard = useCallback((hand: PlayerHand, cardIndex: number) => {
    const card = hand[cardIndex];
    const newHand = hand.filter((_, i) => i !== cardIndex);

    if (newHand.length === 0) {
        setWinner(isPlayerTurn ? 'Player' : 'AI');
        return newHand;
    }

    if (card.color === 'wild') {
        setPlayedCard(card);
        if (isPlayerTurn) {
            setIsChoosingColor(true);
        } else {
            const colorCounts: Record<string, number> = {};
            newHand.forEach(c => {
                if(c.color !== 'wild') colorCounts[c.color] = (colorCounts[c.color] || 0) + 1;
            });
            const chosenColor = Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b, COLORS[0]);
            setTimeout(() => handleColorChoice(chosenColor as Color), 500);
        }
    } else {
        setDiscardPile(prev => [...prev, card]);
        handleTurnEnd(card, isPlayerTurn);
    }
    return newHand;
  }, [handleColorChoice, handleTurnEnd, isPlayerTurn]);

  const handlePlayerPlay = useCallback((cardIndex: number) => {
    if (!isPlayerTurn || isChoosingColor) return;
    const card = playerHand[cardIndex];
    if (isPlayable(card, topCard)) {
      setPlayerHand(playCard(playerHand, cardIndex));
    }
  }, [isPlayerTurn, playerHand, topCard, isChoosingColor, playCard]);

  const handlePlayerDraw = useCallback(() => {
    if (!isPlayerTurn || isChoosingColor) return;
    const { newDeck, newDiscardPile, newHand } = drawCards(deck, discardPile, playerHand, 1);
    setDeck(newDeck);
    setDiscardPile(newDiscardPile);
    setPlayerHand(newHand);
    setIsPlayerTurn(false);
  }, [isPlayerTurn, isChoosingColor, deck, discardPile, playerHand]);

  const aiTurn = useCallback(() => {
    const playableCardIndex = aiHand.findIndex(card => isPlayable(card, topCard));
    if (playableCardIndex !== -1) {
        setTimeout(() => setAiHand(playCard(aiHand, playableCardIndex)), 500);
    } else {
        const { newDeck, newDiscardPile, newHand } = drawCards(deck, discardPile, aiHand, 1);
        setDeck(newDeck);
        setDiscardPile(newDiscardPile);
        setAiHand(newHand);
        setIsPlayerTurn(true);
    }
  }, [aiHand, topCard, playCard, deck, discardPile]);

  useEffect(() => {
    if (!isPlayerTurn && !winner && !isChoosingColor) {
        setMessage("AI's Turn...");
        const timeout = setTimeout(aiTurn, 1000);
        return () => clearTimeout(timeout);
    } else if (isPlayerTurn && !winner) {
        setMessage(playerHand.length === 1 ? 'UNO!' : 'Your Turn!');
    }
  }, [isPlayerTurn, winner, aiTurn, isChoosingColor, playerHand.length]);

  return (
    <div className="w-full h-[85vh] flex flex-col items-center justify-between p-2 bg-green-700 dark:bg-green-900 rounded-lg relative overflow-hidden font-sans">
      {winner && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50 animate-fade-in">
          <h2 className="text-5xl font-bold text-white mb-4">{winner === 'Player' ? 'You Win!' : 'AI Wins!'}</h2>
          <button onClick={startGame} className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary text-xl">{t('new_game')}</button>
        </div>
      )}
      {isChoosingColor && isPlayerTurn && <ColorChooser onSelect={handleColorChoice} />}

      <div className="w-full text-center text-white font-bold text-lg">AI Hand ({aiHand.length})</div>
      <div className="flex justify-center space-x-[-40px] sm:space-x-[-60px] min-h-[144px]">
        {aiHand.map((_, i) => <CardComponent key={i} card={{color: 'wild', value: 'wild', id: -1}} isFaceDown />)}
      </div>

      <div className="flex items-center space-x-4 my-2">
        <CardComponent card={{color: 'wild', value: 'wild', id: -1}} isFaceDown onClick={handlePlayerDraw} />
        {topCard && <CardComponent card={topCard} />}
      </div>

      <div className="w-full text-center text-white font-bold text-lg">Your Hand ({playerHand.length})</div>
      <div className="w-full flex justify-center items-end space-x-[-20px] sm:space-x-[-30px] p-2 min-h-[144px] overflow-x-auto">
         {playerHand.map((card, i) => (
             <CardComponent key={card.id} card={card} onClick={() => handlePlayerPlay(i)} isDisabled={!isPlayerTurn || !isPlayable(card, topCard)} />
         ))}
      </div>

      <div className="absolute bottom-2 left-2 bg-black/50 text-white p-2 rounded-lg font-semibold">{message}</div>
    </div>
  );
};

export default UnoGame;
