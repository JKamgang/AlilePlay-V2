import React, { useState, useEffect, useCallback } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

// Simple word list for demonstration
const WORD_LIST = ["REACT", "FRAME", "TYPES", "WORLD", "APPLE", "QUERY", "AGENT", "MODEL"];
const getSecretWord = () => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];

const TILE_STATUS = {
    EMPTY: 'empty',
    CORRECT: 'correct',
    MISPLACED: 'misplaced',
    INCORRECT: 'incorrect',
    TBD: 'tbd'
};

const Keyboard: React.FC<{ onKeyPress: (key: string) => void, keyStatuses: Record<string, string> }> = ({ onKeyPress, keyStatuses }) => {
    const rows = [
        "QWERTYUIOP".split(''),
        "ASDFGHJKL".split(''),
        ["Enter", ..."ZXCVBNM".split(''), "Backspace"]
    ];

    const getKeyClass = (key: string) => {
        switch (keyStatuses[key]) {
            case TILE_STATUS.CORRECT: return 'bg-green-600 text-white';
            case TILE_STATUS.MISPLACED: return 'bg-yellow-500 text-white';
            case TILE_STATUS.INCORRECT: return 'bg-gray-500 dark:bg-gray-700 text-white';
            default: return 'bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-400';
        }
    }

    return (
        <div className="space-y-1 sm:space-y-2">
            {rows.map((row, i) => (
                <div key={i} className="flex justify-center space-x-1 sm:space-x-2">
                    {row.map(key => (
                        <button
                            key={key}
                            onClick={() => onKeyPress(key)}
                            className={`h-12 sm:h-14 font-bold uppercase rounded-md transition-colors duration-200 flex-grow ${key.length > 1 ? 'px-2 sm:px-4' : 'w-8 sm:w-12'} ${getKeyClass(key)}`}
                        >
                            {key === 'Backspace' ? '⌫' : key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

interface WordMasterGameProps {
  game: Game;
  options: any;
}

const WordMasterGame: React.FC<WordMasterGameProps> = ({ game }) => {
    const { t } = useApp();
    const [secretWord, setSecretWord] = useState(getSecretWord());
    const [guesses, setGuesses] = useState<string[]>(Array(6).fill(''));
    const [statuses, setStatuses] = useState<string[][]>(Array(6).fill(Array(5).fill(TILE_STATUS.TBD)));
    const [currentGuess, setCurrentGuess] = useState('');
    const [activeRow, setActiveRow] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [message, setMessage] = useState('');
    const [keyStatuses, setKeyStatuses] = useState<Record<string, string>>({});

    const startNewGame = useCallback(() => {
        setSecretWord(getSecretWord());
        setGuesses(Array(6).fill(''));
        setStatuses(Array(6).fill(Array(5).fill(TILE_STATUS.TBD)));
        setCurrentGuess('');
        setActiveRow(0);
        setIsFinished(false);
        setMessage('');
        setKeyStatuses({});
    }, []);
    
    const handleKeyPress = useCallback((key: string) => {
        if (isFinished) return;

        if (key === 'Enter') {
            if (currentGuess.length === 5) {
                // For simplicity, we assume any 5-letter word is valid.
                // A real implementation would check against a dictionary.
                const newGuesses = [...guesses];
                newGuesses[activeRow] = currentGuess;
                setGuesses(newGuesses);
                
                const newStatuses = [...statuses];
                const newKeyStatuses = {...keyStatuses};
                const guessChars = currentGuess.split('');
                const secretChars = secretWord.split('');

                const rowStatus = Array(5).fill(TILE_STATUS.INCORRECT);

                // First pass for correct letters
                guessChars.forEach((char, i) => {
                    if (secretChars[i] === char) {
                        rowStatus[i] = TILE_STATUS.CORRECT;
                        secretChars[i] = '_'; // Mark as used
                        newKeyStatuses[char] = TILE_STATUS.CORRECT;
                    }
                });

                // Second pass for misplaced letters
                guessChars.forEach((char, i) => {
                    if (rowStatus[i] !== TILE_STATUS.CORRECT) {
                        const misplacedIndex = secretChars.indexOf(char);
                        if (misplacedIndex > -1) {
                            rowStatus[i] = TILE_STATUS.MISPLACED;
                            secretChars[misplacedIndex] = '_'; // Mark as used
                            if(newKeyStatuses[char] !== TILE_STATUS.CORRECT) {
                               newKeyStatuses[char] = TILE_STATUS.MISPLACED;
                            }
                        } else {
                            if (!newKeyStatuses[char]) {
                                newKeyStatuses[char] = TILE_STATUS.INCORRECT;
                            }
                        }
                    }
                });
                
                newStatuses[activeRow] = rowStatus;
                setStatuses(newStatuses);
                setKeyStatuses(newKeyStatuses);
                
                if (currentGuess === secretWord) {
                    setMessage(t('wordmaster_win'));
                    setIsFinished(true);
                } else if (activeRow === 5) {
                    setMessage(`${t('wordmaster_lose')} ${secretWord}`);
                    setIsFinished(true);
                }

                setActiveRow(prev => prev + 1);
                setCurrentGuess('');
            }
        } else if (key === 'Backspace') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (currentGuess.length < 5 && /^[A-Z]$/i.test(key)) {
            setCurrentGuess(prev => prev + key.toUpperCase());
        }
    }, [activeRow, currentGuess, guesses, isFinished, secretWord, statuses, t, keyStatuses]);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => handleKeyPress(e.key);
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyPress]);

    const getTileClass = (status: string) => {
        switch (status) {
            case TILE_STATUS.CORRECT: return 'bg-green-600 text-white border-green-600';
            case TILE_STATUS.MISPLACED: return 'bg-yellow-500 text-white border-yellow-500';
            case TILE_STATUS.INCORRECT: return 'bg-gray-500 text-white border-gray-500';
            case TILE_STATUS.TBD: return 'border-gray-300 dark:border-gray-600';
            default: return 'bg-light-surface dark:bg-dark-surface border-gray-400 dark:border-gray-500';
        }
    };
    
    return (
        <div className="flex flex-col items-center p-2 sm:p-4 w-full max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t(game.nameKey)}</h2>
            
            {message && (
                <div className="text-center p-2 mb-2 bg-light-surface dark:bg-dark-surface rounded-md font-semibold text-lg">
                    {message}
                </div>
            )}

            <div className="grid grid-rows-6 gap-1.5 mb-4">
                {guesses.map((guess, i) => (
                    <div key={i} className="grid grid-cols-5 gap-1.5">
                        {Array(5).fill(0).map((_, j) => {
                            const char = i === activeRow ? currentGuess[j] : guess[j];
                            return (
                                <div key={j} className={`w-14 h-14 sm:w-16 sm:h-16 border-2 flex items-center justify-center text-3xl font-bold uppercase transition-colors duration-500 ${getTileClass(statuses[i][j])}`}>
                                    {char}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            
            <Keyboard onKeyPress={handleKeyPress} keyStatuses={keyStatuses} />

             <button
                onClick={startNewGame}
                className="mt-6 px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors"
            >
                {t('new_game')}
            </button>
        </div>
    );
};

export default WordMasterGame;
