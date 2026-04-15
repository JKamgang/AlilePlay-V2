import React, { useState, useRef, useEffect } from 'react';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';
import { aiRouter } from '@/shared/api/ai/aiRouter';

interface ChatWidgetProps {
    t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ t }) => {
    const [messages, setMessages] = useState<{ user: string; text: string; system?: boolean }[]>([
        { user: 'System', text: 'Welcome to Alileva Global Chat!', system: true }
    ]);
    const [input, setInput] = useState('');
    const [isModerating, setIsModerating] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isModerating) return;

        setIsModerating(true);
        const prompt = `Is the following message aggressive, hateful, bullying, or highly inappropriate? Answer with only "yes" or "no".\n\nMessage: "${input}"`;
        const responseText = await aiRouter.generateContent({
            userTier: 'free',
            taskType: 'basic',
            prompt: prompt,
        });

        const isAggressive = responseText.toLowerCase().includes('yes');

        if (isAggressive) {
            setMessages(prev => [...prev, { user: 'System', text: t('chat_moderation_error'), system: true }]);
        } else {
            setMessages(prev => [...prev, { user: 'You', text: input }]);
        }

        setInput('');
        setIsModerating(false);
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700/50 flex flex-col h-[400px]">
            <header className="p-4 border-b border-gray-700/50 flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    {t('global_chat')}
                </h3>
            </header>
            <main ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-3 scroll-smooth">
                {messages.map((m, i) => (
                    <div key={i} className={`text-sm ${m.system ? 'text-center italic opacity-70' : ''}`}>
                        {!m.system && <span className="font-bold text-brand-primary mr-2">{m.user}:</span>}
                        <span className={m.system ? 'text-red-400' : 'text-gray-300'}>{m.text}</span>
                    </div>
                ))}
            </main>
            <footer className="p-3 border-t border-gray-700/50 flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('type_message')}
                    className="flex-grow bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-brand-primary"
                />
                <button
                    onClick={handleSend}
                    disabled={isModerating}
                    className="bg-brand-primary hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-colors disabled:opacity-50"
                >
                    {isModerating ? '...' : t('send')}
                </button>
            </footer>
        </div>
    );
};

export default ChatWidget;