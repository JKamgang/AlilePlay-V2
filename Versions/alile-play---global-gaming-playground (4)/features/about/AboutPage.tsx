
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { GAMES } from '../../constants';

const AboutPage: React.FC = () => {
    const { t } = useApp();
    const [isCopied, setIsCopied] = useState(false);

    const copyFeatureManifest = () => {
        const manifest = GAMES.map(g => `- ${t(g.nameKey)} (${t(g.categoryKey)}): ${t(g.descriptionKey)}`).join('\n');
        const fullText = `Alile Play Feature Manifest\nDeveloped by: Jean Baptiste (Buford, GA)\nContact: JKamgang@hotmail.com\n\n${manifest}`;
        navigator.clipboard.writeText(fullText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20">
            <section className="text-center space-y-4">
                <h2 className="text-5xl font-black text-brand-primary tracking-tighter uppercase">{t('alile_play')}</h2>
                <div className="inline-block px-4 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    Architected by Jean Baptiste • Buford, GA
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
                    Alile Play is a high-performance gaming ecosystem designed for seamless play across all devices. 
                    From strategic deep-dives in Civ 2 to physics landing in KSP, this platform is the pinnacle of web-based gaming.
                </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-light-surface dark:bg-dark-surface p-8 rounded-3xl shadow-xl border-2 border-brand-primary/20">
                    <h3 className="text-2xl font-black mb-6 flex items-center uppercase tracking-tighter">
                        <span className="mr-2">👨‍💻</span> Platform Creator
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lead Engineer</p>
                            <p className="text-xl font-black">Jean Baptiste</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Origin</p>
                            <p className="text-lg font-bold">Buford, GA</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact</p>
                            <a href="mailto:JKamgang@hotmail.com" className="text-brand-primary font-black hover:underline">JKamgang@hotmail.com</a>
                        </div>
                    </div>
                </div>

                <div className="bg-light-surface dark:bg-dark-surface p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
                    <h3 className="text-2xl font-black mb-6 flex items-center uppercase tracking-tighter">
                        <span className="mr-2">⚙️</span> Technical Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {['React 19', 'TypeScript 5', 'Tailwind CSS', 'Gemini 3 Flash', 'Chess.js'].map(tech => (
                            <span key={tech} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-black rounded-full uppercase">
                                {tech}
                            </span>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                        <p className="text-[10px] font-mono text-brand-primary uppercase font-bold">
                            Status: Optimized & Pruned<br/>
                            Stability: Tier 1 Elite<br/>
                            Mobile: Responsive Layout
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-brand-primary p-10 rounded-3xl text-white flex flex-col items-center space-y-6 shadow-2xl shadow-brand-primary/30">
                <div className="text-center">
                    <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Self-Diagnostic Platform Audit</h3>
                    <p className="text-sm opacity-90 font-medium">Our AI Strategist monitors every line of code for inconsistencies. Need a system check?</p>
                </div>
                <button 
                    onClick={copyFeatureManifest}
                    className="bg-white text-brand-primary px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all transform active:scale-95 shadow-lg"
                >
                    {isCopied ? 'Manifest Copied!' : 'Export Performance Audit'}
                </button>
            </div>
        </div>
    );
};

export default AboutPage;
