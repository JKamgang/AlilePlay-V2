
import React, { useState, useCallback } from 'react';
import { Game } from '../../../types';
import { useApp } from '../../../contexts/AppContext';

const WORDS = ["PLAYGROUND", "STRATEGY", "GAMES", "REACT", "TYPESCRIPT", "DIGITAL", "UNIVERSE", "VICTORY"];

const HangmanGame: React.FC<{ game: Game }> = ({ game }) => {
    const { t } = useApp();
    const [word, setWord] = useState(WORDS[Math.floor(Math.random() * WORDS.length)]);
    const [guessed, setGuessed] = useState<string[]>([]);
    const [wrongCount, setWrongCount] = useState(0);

    const reset = () => {
        setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
        setGuessed([]);
        setWrongCount(0);
    };

    const handleGuess = (letter: string) => {
        if (guessed.includes(letter) || wrongCount >= 6) return;
        setGuessed(prev => [...prev, letter]);
        if (!word.includes(letter)) setWrongCount(prev => prev + 1);
    };

    const isWinner = word.split('').every(char => guessed.includes(char));
    const isLoser = wrongCount >= 6;

    return (
        <div className="flex flex-col items-center p-8 bg-light-surface dark:bg-dark-surface rounded-3xl shadow-xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-brand-primary mb-4">{t(game.nameKey)}</h2>

            <div className="flex gap-4 items-end mb-10 h-40">
                <div className="relative w-24 h-40 border-l-4 border-b-4 border-gray-400">
                    <div className="absolute top-0 left-0 w-16 h-1 bg-gray-400" />
                    <div className="absolute top-0 right-4 w-1 h-6 bg-gray-400" />
                    {wrongCount > 0 && <div className="absolute top-6 right-2 w-5 h-5 border-2 border-brand-primary rounded-full" />}
                    {wrongCount > 1 && <div className="absolute top-11 right-4 w-1 h-10 bg-brand-primary" />}
                    {wrongCount > 2 && <div className="absolute top-12 right-0 w-4 h-1 bg-brand-primary origin-right rotate-45" />}
                    {wrongCount > 3 && <div className="absolute top-12 right-5 w-4 h-1 bg-brand-primary origin-left -rotate-45" />}
                    {wrongCount > 4 && <div className="absolute top-21 right-4 w-1 h-6 bg-brand-primary origin-top rotate-45" />}
                    {wrongCount > 5 && <div className="absolute top-21 right-4 w-1 h-6 bg-brand-primary origin-top -rotate-45" />}
                </div>
                <div className="flex gap-2">
                    {word.split('').map((char, i) => (
                        <span key={i} className="text-4xl font-black border-b-4 border-gray-300 w-10 text-center">
                            {guessed.includes(char) ? char : ''}
                        </span>
                    ))}
                </div>
            </div>

            {(isWinner || isLoser) ? (
                <div className="text-center mb-8">
                    <p className={`text-2xl font-bold mb-4 ${isWinner ? 'text-green-500' : 'text-red-500'}`}>
                        {isWinner ? "Victory!" : `Game Over! Word was: ${word}`}
                    </p>
                    <button onClick={reset} className="px-8 py-3 bg-brand-primary text-white rounded-xl font-bold">Play Again</button>
                </div>
            ) : (
                <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
                    {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(char => (
                        <button
                            key={char}
                            onClick={() => handleGuess(char)}
                            disabled={guessed.includes(char)}
                            className={`w-10 h-10 rounded-lg font-bold transition-all ${guessed.includes(char) ? 'bg-gray-200 text-gray-400' : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white'}`}
                        >
                            {char}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HangmanGame;
