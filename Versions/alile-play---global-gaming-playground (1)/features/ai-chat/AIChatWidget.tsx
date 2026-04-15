
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AIChatWidget: React.FC = () => {
    const { t } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Welcome to Alile Play! How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate Gemini API call
        setTimeout(() => {
            const aiResponse: Message = { sender: 'ai', text: "Thanks for your message! AI responses are currently in development. I'll be able to answer your questions about games, rules, and more very soon." };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1500);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 right-5 w-16 h-16 bg-brand-primary rounded-full text-white flex items-center justify-center shadow-lg hover:bg-brand-secondary transition-transform transform hover:scale-110"
                aria-label={t('ai_chat_title')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a2 2 0 012 2v5a2 2 0 01-2 2h-1l-3 3v-3h-3a2 2 0 01-2-2V9a2 2 0 012-2h4z" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-5 right-5 w-full max-w-sm h-[60vh] flex flex-col bg-light-surface dark:bg-dark-surface rounded-lg shadow-2xl animate-slide-in">
            <header className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg text-brand-primary">{t('ai_chat_title')}</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">&times;</button>
            </header>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <p className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                            {msg.text}
                        </p>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                        <p className="max-w-[80%] p-3 rounded-lg bg-gray-200 dark:bg-gray-600">
                           <span className="animate-pulse">...</span>
                        </p>
                    </div>
                )}
            </div>
            <footer className="p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('ai_chat_placeholder')}
                        className="flex-grow p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-brand-primary focus:border-brand-primary"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="bg-brand-primary text-white px-4 rounded-r-md hover:bg-brand-secondary disabled:bg-gray-400">
                        Send
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default AIChatWidget;
