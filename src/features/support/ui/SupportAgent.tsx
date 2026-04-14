import React, { useState } from 'react';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';
import { getSupportResponse } from '@/shared/api/gemini/geminiService';

interface SupportAgentProps {
    t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

const SupportAgent: React.FC<SupportAgentProps> = ({ t }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isThinking) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsThinking(true);

        const response = await getSupportResponse(userMsg);
        setMessages(prev => [...prev, { role: 'ai', text: response }]);
        setIsThinking(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            {isOpen ? (
                <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col h-[500px] animate-fade-in-down overflow-hidden">
                    <header className="bg-brand-primary p-4 text-white flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-white/20 rounded-full mr-3 flex items-center justify-center">🤖</div>
                            <h4 className="font-bold">{t('support_agent')}</h4>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-2xl font-light hover:scale-110 transition-transform">&times;</button>
                    </header>
                    <main className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-900/50">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 mt-10">
                                <p>{t('ask_ai_support')}</p>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-brand-primary text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {isThinking && <div className="text-xs text-brand-accent animate-pulse">{t('ai_thinking')}</div>}
                    </main>
                    <footer className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="flex-grow bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-sm text-white focus:ring-1 focus:ring-brand-primary"
                            placeholder="Type a message..."
                        />
                        <button onClick={handleSend} className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center hover:bg-indigo-500 transition-colors">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </footer>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-brand-primary hover:bg-indigo-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all transform hover:scale-110 active:scale-95"
                >
                    💬
                </button>
            )}
        </div>
    );
};

export default SupportAgent;