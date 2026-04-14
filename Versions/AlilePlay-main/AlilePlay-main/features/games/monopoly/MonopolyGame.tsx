import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';
import { BOARD_SPACES, CHANCE_CARDS, COMMUNITY_CHEST_CARDS } from './monopolyConstants';
import type { PlayerState, PropertySpace, BoardSpace, Card } from './monopolyTypes';
import { PlusIcon, MinusIcon, ArrowPathIcon } from '../../../components/icons';
import './monopoly.css';


// --- Icon Components ---
const SpaceIcon: React.FC<{ space: BoardSpace }> = ({ space }) => {
    switch (space.type) {
        case 'railroad': return <svg className="space-icon" viewBox="0 0 100 100"><path d="M20 20h60v10H20zM20 70h60v10H20zM30 30h40v40H30z" fill="black" /><text x="50" y="60" textAnchor="middle" fill="white" fontSize="24">🚂</text></svg>;
        case 'utility':
            if (space.name.includes("Electric")) return <svg className="space-icon" viewBox="0 0 100 100"><path d="M50 10 C 30 10, 30 40, 50 60 C 70 40, 70 10, 50 10 M 40 60 h 20 v 20 h -20 z" fill="#FFD700" stroke="black" strokeWidth="3" /></svg>;
            return <svg className="space-icon" viewBox="0 0 100 100"><path d="M20 30 Q 50 10, 80 30 T 50 80 Q 20 60, 20 30" fill="#4682B4" stroke="black" strokeWidth="3" /></svg>;
        case 'chance': return <div className="text-6xl font-bold text-blue-600">?</div>;
        case 'community-chest': return <svg className="space-icon" viewBox="0 0 100 100"><rect x="15" y="30" width="70" height="50" fill="#F4A460" stroke="black" strokeWidth="3"/><rect x="10" y="25" width="80" height="10" fill="#DEB887" stroke="black" strokeWidth="3"/></svg>;
        case 'tax': return <svg className="space-icon" viewBox="0 0 100 100"><path d="M50 10 L 70 30 L 50 50 L 30 30 Z" fill="#ADD8E6" stroke="black" strokeWidth="3" /><path d="M50 50 L 70 70 L 50 90 L 30 70 Z" fill="#ADD8E6" stroke="black" strokeWidth="3" /></svg>;
        case 'go-to-jail': return <svg className="space-icon" viewBox="0 0 100 100"><text x="50" y="60" textAnchor="middle" fontSize="60">👮</text></svg>;
        case 'jail': return <svg className="space-icon" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" fill="orange" /><path d="M30 20v60 M50 20v60 M70 20v60" stroke="black" strokeWidth="5"/></svg>;
        case 'free-parking': return <svg className="space-icon" viewBox="0 0 100 100"><text x="50" y="65" textAnchor="middle" fontSize="70">🚗</text></svg>;
        case 'go': return <svg className="space-icon" viewBox="0 0 100 100"><text x="50" y="70" textAnchor="middle" fontSize="80" fill="red" transform="rotate(-45 50 50)">➔</text></svg>;
        default: return null;
    }
};

const MonopolyGame: React.FC<{ game: Game; options: any; }> = ({ game: gameInfo }) => {
    const { t } = useApp();

    const [players, setPlayers] = useState<PlayerState[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [dice, setDice] = useState([1, 1]);
    const [isRolling, setIsRolling] = useState(false);
    const [hasRolled, setHasRolled] = useState(false);
    const [gameLog, setGameLog] = useState<string[]>([]);
    const [winner, setWinner] = useState<PlayerState | null>(null);
    const [purchaseCandidate, setPurchaseCandidate] = useState<PropertySpace | null>(null);
    const [cardToShow, setCardToShow] = useState<{ type: 'Chance' | 'Community Chest', card: Card } | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    const log = useCallback((message: string) => {
        setGameLog(prev => [message, ...prev.slice(0, 4)]);
    }, []);

    const startGame = useCallback(() => {
        setPlayers([
            { id: 0, name: 'Player 1', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0, token: '🎩' },
            { id: 1, name: 'AI', money: 1500, position: 0, properties: [], inJail: false, jailTurns: 0, token: '🤖' },
        ]);
        setCurrentPlayerIndex(0);
        setDice([1, 1]);
        setHasRolled(false);
        setWinner(null);
        setPurchaseCandidate(null);
        setCardToShow(null);
        setGameLog(['Welcome to Monopoly!', 'Player 1\'s turn.']);
    }, []);

    useEffect(() => {
        startGame();
    }, [startGame]);
    
    const handleZoom = (direction: 'in' | 'out' | 'reset') => {
        if (direction === 'reset') {
            setZoomLevel(1);
        } else {
            setZoomLevel(prev => {
                const newZoom = direction === 'in' ? prev + 0.1 : prev - 0.1;
                return Math.max(0.5, Math.min(1.5, newZoom)); // Clamp between 50% and 150%
            });
        }
    };

    const handlePayment = useCallback((playerId: number, amount: number, recipientId: number | null = null): boolean => {
        let canPay = true;
        setPlayers(prevPlayers => {
            const newPlayers = [...prevPlayers];
            const payer = { ...newPlayers[playerId] };
            
            if (payer.money < amount) {
                canPay = false;
                setWinner(newPlayers[recipientId ?? 1 - playerId]);
                log(`${payer.name} is bankrupt!`);
                return newPlayers; 
            }

            payer.money -= amount;
            log(`${payer.name} paid $${amount}.`);

            if (recipientId !== null) {
                const recipient = { ...newPlayers[recipientId] };
                recipient.money += amount;
                newPlayers[recipientId] = recipient;
            }
            newPlayers[playerId] = payer;
            return newPlayers;
        });
        return canPay;
    }, [log]);

    const endTurn = useCallback(() => {
        if(winner) return;
        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
        setCurrentPlayerIndex(nextPlayerIndex);
        setHasRolled(false);
        log(`${players[nextPlayerIndex].name}'s turn.`);
    }, [currentPlayerIndex, players, winner, log]);

    const movePlayer = useCallback((steps: number) => {
        let landedOn: BoardSpace;
        setPlayers(prevPlayers => {
            const newPlayers = [...prevPlayers];
            const player = { ...newPlayers[currentPlayerIndex] };
            
            if (player.position + steps >= 40) {
                player.money += 200;
                log(`${player.name} passed GO and collected $200.`);
            }
            player.position = (player.position + steps) % 40;
            landedOn = BOARD_SPACES[player.position];
            newPlayers[currentPlayerIndex] = player;
            log(`${player.name} moved to ${landedOn.name}.`);
            return newPlayers;
        });
        setTimeout(() => {
            // Re-fetch the space from the constant array to ensure we have the correct one
             const landedOnSpace = BOARD_SPACES[players[currentPlayerIndex].position];
            handleSpaceAction(landedOnSpace);
        }, 300);
    }, [currentPlayerIndex, players, log]);

    const handleSpaceAction = (space: BoardSpace) => {
        const player = players[currentPlayerIndex];
        switch (space.type) {
            case 'property': case 'railroad': case 'utility':
                const owner = players.find(p => p.properties.includes(space.id));
                if (owner) {
                    if (owner.id !== player.id) {
                        let rent = 0;
                        if(space.type === 'property') rent = space.rent[0];
                        else if (space.type === 'railroad') rent = 25 * (2 ** (players[owner.id].properties.filter(pId => BOARD_SPACES[pId].type === 'railroad').length - 1));
                        else rent = (dice[0] + dice[1]) * 4;
                        log(`${player.name} must pay $${rent} rent to ${owner.name}.`);
                        handlePayment(player.id, rent, owner.id);
                    }
                    endTurn();
                } else {
                    setPurchaseCandidate(space as PropertySpace);
                }
                break;
            case 'chance':
                setCardToShow({ type: 'Chance', card: CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)] });
                break;
            case 'community-chest':
                setCardToShow({ type: 'Community Chest', card: COMMUNITY_CHEST_CARDS[Math.floor(Math.random() * COMMUNITY_CHEST_CARDS.length)] });
                break;
            case 'tax':
                log(`${player.name} must pay $${space.amount} in taxes.`);
                handlePayment(player.id, space.amount);
                endTurn();
                break;
            case 'go-to-jail':
                log(`${player.name} is going to jail!`);
                setPlayers(prev => {
                    const newPlayers = [...prev];
                    newPlayers[currentPlayerIndex].position = 10;
                    newPlayers[currentPlayerIndex].inJail = true;
                    return newPlayers;
                });
                endTurn();
                break;
            default:
                endTurn();
        }
    }
    
    const handleCardAction = () => {
        if (!cardToShow) return;
        const player = players[currentPlayerIndex];
        log(`${player.name} drew: "${cardToShow.card.description}"`);
        
        switch (cardToShow.card.action) {
            case 'get_money':
                setPlayers(prev => {
                    const newPlayers = [...prev];
                    newPlayers[currentPlayerIndex].money += cardToShow.card.amount ?? 0;
                    return newPlayers;
                });
                break;
            case 'pay_money':
                handlePayment(currentPlayerIndex, cardToShow.card.amount ?? 0);
                break;
            case 'move':
                setPlayers(prev => {
                    const newPlayers = [...prev];
                    const targetPos = cardToShow.card.position ?? 0;
                    if (newPlayers[currentPlayerIndex].position > targetPos) {
                       newPlayers[currentPlayerIndex].money += 200;
                       log(`${player.name} passed GO and collected $200.`);
                    }
                    newPlayers[currentPlayerIndex].position = targetPos;
                    return newPlayers;
                });
                setTimeout(() => handleSpaceAction(BOARD_SPACES[cardToShow.card.position ?? 0]), 100);
                break;
            case 'go_to_jail':
                 setPlayers(prev => {
                    const newPlayers = [...prev];
                    newPlayers[currentPlayerIndex].position = 10;
                    newPlayers[currentPlayerIndex].inJail = true;
                    return newPlayers;
                });
                break;
        }
        setCardToShow(null);
        if (!['move'].includes(cardToShow.card.action)) {
            endTurn();
        }
    };

    const handleBuy = () => {
        if (!purchaseCandidate) return;
        const player = players[currentPlayerIndex];
        if (player.money >= purchaseCandidate.price) {
            handlePayment(player.id, purchaseCandidate.price);
            setPlayers(prev => {
                const newPlayers = [...prev];
                newPlayers[currentPlayerIndex].properties.push(purchaseCandidate.id);
                return newPlayers;
            });
            log(`${player.name} bought ${purchaseCandidate.name}.`);
        } else {
            log(`${player.name} cannot afford ${purchaseCandidate.name}.`);
        }
        setPurchaseCandidate(null);
        endTurn();
    };

    const handlePass = () => {
        log(`${players[currentPlayerIndex].name} declined to buy ${purchaseCandidate?.name}.`);
        setPurchaseCandidate(null);
        endTurn();
    };

    const handleRoll = () => {
        if (hasRolled || winner || isRolling) return;
        
        const player = players[currentPlayerIndex];
        if (player.inJail) {
             log(`${player.name} is in jail. Paying $50 to get out.`);
             if (handlePayment(currentPlayerIndex, 50)) {
                 setPlayers(prev => {
                    const newPlayers = [...prev];
                    newPlayers[currentPlayerIndex].inJail = false;
                    return newPlayers;
                 });
             } else {
                 return;
             }
        }

        setIsRolling(true);
        const rollInterval = setInterval(() => {
            setDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]);
        }, 50);

        setTimeout(() => {
            clearInterval(rollInterval);
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            setDice([d1, d2]);
            setHasRolled(true);
            setIsRolling(false);
            log(`${player.name} rolled a ${d1} and a ${d2}.`);
            movePlayer(d1 + d2);
        }, 1000);
    };

    useEffect(() => {
        if (currentPlayerIndex === 1 && !winner && !hasRolled) setTimeout(handleRoll, 1000);
    }, [currentPlayerIndex, winner, hasRolled]);
    
    useEffect(() => {
        if (currentPlayerIndex === 1 && purchaseCandidate) {
             setTimeout(() => {
                if (players[1].money > purchaseCandidate.price + 200) handleBuy();
                else handlePass();
            }, 1000);
        }
    }, [currentPlayerIndex, purchaseCandidate, players]);

    useEffect(() => {
        if (currentPlayerIndex === 1 && cardToShow) setTimeout(handleCardAction, 1500);
    }, [currentPlayerIndex, cardToShow]);
    
    if (players.length === 0) return <div>Loading...</div>;

    return (
        <div className="w-full max-w-screen-2xl mx-auto p-4 font-serif bg-green-200 dark:bg-gray-800 rounded-lg shadow-xl flex gap-6 h-[85vh]">
             {winner && <WinnerModal winner={winner} onNewGame={startGame} t={t} />}
             {purchaseCandidate && currentPlayerIndex === 0 && <PropertyPurchaseModal property={purchaseCandidate} onBuy={handleBuy} onPass={handlePass} />}
             {cardToShow && <CardDrawModal cardInfo={cardToShow} onAcknowledge={handleCardAction} isPlayerTurn={currentPlayerIndex === 0} />}

            <PlayerInfo player={players[0]} isActive={currentPlayerIndex === 0} />
            
            <div className="flex-grow flex items-center justify-center relative">
                <div className="board-viewport">
                    <div
                        className="monopoly-board"
                        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
                    >
                        <div className="center-panel">
                            <h1 className="title">MONOPOLY</h1>
                            <div className="dice-area">
                                <div className="dice">{dice[0]}</div>
                                <div className="dice">{dice[1]}</div>
                            </div>
                            <button onClick={handleRoll} disabled={hasRolled || currentPlayerIndex !== 0 || winner != null || isRolling} className="roll-button">
                                {isRolling ? 'Rolling...' : 'Roll Dice'}
                            </button>
                            <div className="game-log">
                                {gameLog.map((msg, i) => <p key={i}>{msg}</p>)}
                            </div>
                        </div>
                        {BOARD_SPACES.map((space, index) => {
                            const owner = players.find(p => p.properties.includes(index));
                            return (
                                <div key={index} className={`space ${space.type} corner-${space.corner || ''} row-${space.position.row} col-${space.position.col}`}>
                                    {space.type === 'property' && <div className="color-bar" style={{ backgroundColor: space.color }}></div>}
                                    <div className="name">{space.name}</div>
                                    <SpaceIcon space={space} />
                                    {('price' in space) && <div className="price">${space.price}</div>}
                                    {('amount' in space) && <div className="price">Pay ${space.amount}</div>}
                                    {owner && <div className="owner-token" style={{backgroundColor: owner.id === 0 ? 'blue' : 'red'}}>{owner.token}</div>}
                                    <div className="players-on-space">
                                        {players.map(p => p.position === index && <div key={p.id} className="player-token">{p.token}</div>)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2 bg-white/80 dark:bg-dark-surface/80 p-2 rounded-lg shadow-lg">
                    <button onClick={() => handleZoom('in')} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors border border-gray-300 dark:border-gray-500" aria-label="Zoom In">
                        <PlusIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => handleZoom('out')} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors border border-gray-300 dark:border-gray-500" aria-label="Zoom Out">
                        <MinusIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => handleZoom('reset')} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors border border-gray-300 dark:border-gray-500" aria-label="Reset Zoom">
                        <ArrowPathIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <PlayerInfo player={players[1]} isActive={currentPlayerIndex === 1} />
        </div>
    );
};

// --- Child Components for Modals and UI elements ---

const PlayerInfo: React.FC<{ player: PlayerState; isActive: boolean }> = ({ player, isActive }) => (
    <div className={`w-80 flex-shrink-0 bg-light-surface dark:bg-dark-surface p-4 rounded-lg shadow-lg player-info ${isActive ? 'active' : ''}`}>
        <h2 className="text-2xl font-bold mb-2 flex justify-between items-center">{player.name} <span className="text-3xl">{player.token}</span></h2>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">${player.money.toLocaleString()}</p>
        <h3 className="font-bold mb-2 border-b-2 pb-1">Properties ({player.properties.length}):</h3>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {player.properties.map(id => <OwnedPropertyCard key={id} property={BOARD_SPACES[id] as PropertySpace} />)}
        </div>
    </div>
);

const OwnedPropertyCard: React.FC<{ property: PropertySpace }> = ({ property }) => (
    <div className="owned-property-card">
        <div className="color-bar" style={{ backgroundColor: property.color }}></div>
        <div className="name">{property.name}</div>
    </div>
);

const WinnerModal: React.FC<{ winner: PlayerState; onNewGame: () => void; t: (key: string) => string }> = ({ winner, onNewGame, t }) => (
    <div className="modal-backdrop animate-fade-in">
        <div className="bg-light-surface dark:bg-dark-surface p-8 rounded-xl shadow-2xl text-center">
            <h2 className="text-5xl font-bold text-brand-primary mb-4">{winner.name} Wins!</h2>
            <button onClick={onNewGame} className="mt-4 px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary text-xl">{t('new_game')}</button>
        </div>
    </div>
);

const PropertyPurchaseModal: React.FC<{ property: PropertySpace; onBuy: () => void; onPass: () => void }> = ({ property, onBuy, onPass }) => (
    <div className="modal-backdrop animate-fade-in">
        <div className="property-card-modal transform transition-all scale-100">
            <div className="color-bar" style={{ backgroundColor: property.color }}>
                <h3 className="title">Title Deed: {property.name}</h3>
            </div>
            <div className="content">
                <div className="rent-info">
                    <p>RENT <strong>${property.rent[0]}</strong>.</p>
                    <p>With 1 House <strong>${property.rent[1]}</strong>.</p>
                    <p>With 2 Houses <strong>${property.rent[2]}</strong>.</p>
                    <p>With 3 Houses <strong>${property.rent[3]}</strong>.</p>
                    <p>With 4 Houses <strong>${property.rent[4]}</strong>.</p>
                    <p>With HOTEL <strong>${property.rent[5]}</strong>.</p>
                </div>
                <div className="costs-info">
                    <span>Mortgage Value ${property.mortgage}</span>
                    <span>Houses cost ${property.houseCost}. each</span>
                </div>
                <p className="price-tag">Price ${property.price}</p>
                <div className="flex space-x-4 justify-center">
                    <button onClick={onBuy} className="px-8 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 text-lg">Buy</button>
                    <button onClick={onPass} className="px-8 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 text-lg">Pass</button>
                </div>
            </div>
        </div>
    </div>
);

const CardDrawModal: React.FC<{ cardInfo: { type: 'Chance' | 'Community Chest', card: Card }, onAcknowledge: () => void, isPlayerTurn: boolean }> = ({ cardInfo, onAcknowledge, isPlayerTurn }) => (
    <div className="modal-backdrop animate-fade-in">
        <div className={cardInfo.type === 'Chance' ? 'chance-card' : 'community-chest-card'}>
            <h3 className="card-title">{cardInfo.type}</h3>
            <p className="card-description">{cardInfo.card.description}</p>
            {isPlayerTurn && (
                <button onClick={onAcknowledge} className="px-8 py-2 bg-gray-100 text-black font-bold rounded-lg hover:bg-white text-lg border-2 border-black">OK</button>
            )}
        </div>
    </div>
);

export default MonopolyGame;