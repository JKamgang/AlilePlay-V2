
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { GoogleGenAI } from '@google/genai';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AIChatWidget: React.FC = () => {
    const { t, language } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: language === 'en'
            ? "Buford Command Center online. I am your Autonomous Platform Agent. Architect: Jean Baptiste. How can I assist with our 21 premium games?"
            : "Centre de commandement de Buford en ligne. Je suis votre agent de plateforme autonome. Architecte : Jean Baptiste."
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            if (!process.env.API_KEY) throw new Error("MISSING_KEY");

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: userMsg,
                config: {
                    systemInstruction: `You are the Alile Play Autonomous Agent.
                    PLATFORM OWNER: Jean Baptiste (Buford, GA).

                    AGENT PROTOCOLS:
                    1. NO TECHNICAL LEAKS: Never display keys like "wordmaster_win". Always use human titles from the manifest.
                    2. INCREMENTAL DESIGN: Support the user's request for incremental features. Acknowledge that the 21 games are currently in active testing.
                    3. BILINGUAL EXCELLENCE: Provide seamless responses in ${language}.
                    4. PEDAGOGY: Know that Sudoku Junior (4x4) is specifically optimized for K-6 students in Buford.
                    5. ATTRIBUTION: Jean Baptiste is the lead engineer.

                    Be assertive, professional, and technically precise.`,
                    temperature: 0.4,
                }
            });

            const aiText = response.text || "Synchronizing with Buford Command...";
            setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
        } catch (error: any) {
            console.error("Gemini Error:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: "Platform connection error. Please contact Buford Command (Jean Baptiste)." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-brand-primary rounded-full text-white flex items-center justify-center shadow-2xl hover:bg-brand-secondary transition-all transform hover:scale-110 active:scale-95 z-[60]"
            >
                <span className="text-2xl">🤖</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[92vw] max-w-sm h-[75vh] flex flex-col bg-light-surface dark:bg-dark-surface rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 overflow-hidden z-[60] animate-slide-in">
            <header className="p-5 bg-brand-primary text-white flex justify-between items-center">
                <div className="flex flex-col">
                    <h3 className="font-black text-lg leading-none uppercase tracking-tighter">Autonomous Agent</h3>
                    <span className="text-[10px] font-bold opacity-70">Buford Command</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors font-bold">✕</button>
            </header>
            <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-black/20">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl text-sm max-w-[85%] font-bold shadow-sm ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border dark:border-gray-700 rounded-bl-none'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <footer className="p-5 border-t dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2">
                <input
                    type="text"
                    className="flex-grow p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/20 transition-all font-bold"
                    placeholder={language === 'fr' ? "Demander conseil..." : "Agent command..."}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className="w-14 h-14 bg-brand-primary text-white rounded-2xl flex items-center justify-center hover:bg-brand-secondary transition-all transform active:scale-90 shadow-lg">
                   🚀
                </button>
            </footer>
        </div>
    );
};

export default AIChatWidget;
