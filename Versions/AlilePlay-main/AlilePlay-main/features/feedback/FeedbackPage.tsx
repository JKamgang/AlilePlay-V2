
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

const FeedbackPage: React.FC = () => {
    const { t } = useApp();
    const [submitted, setSubmitted] = useState(false);

    const stats = [
        { label: 'Active Sessions', value: '1,248', change: '+12%', color: 'text-green-500' },
        { label: 'AI Helpful Rate', value: '94.2%', change: '+2.1%', color: 'text-blue-500' },
        { label: 'Avg Play Time', value: '18m', change: '-1m', color: 'text-red-400' },
        { label: 'Global Rank', value: '#12', change: 'UP 4', color: 'text-brand-primary' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
            <header className="text-center space-y-4">
                <h2 className="text-4xl font-black text-brand-primary uppercase tracking-tighter">{t('feedback_title')}</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                    We continuously monitor platform health and user sentiment to ensure a premium gaming experience.
                </p>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-light-surface dark:bg-dark-surface p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 transition-transform hover:-translate-y-1">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h4 className="text-3xl font-black">{stat.value}</h4>
                            <span className={`text-[10px] font-bold ${stat.color} mb-1`}>{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                <div className="bg-light-surface dark:bg-dark-surface p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
                    {submitted ? (
                        <div className="text-center py-20 space-y-4">
                            <div className="text-6xl animate-bounce">🏆</div>
                            <h3 className="text-2xl font-bold text-brand-primary">Feedback Received!</h3>
                            <p className="text-gray-500">Your insights help us optimize the playground.</p>
                            <button onClick={() => setSubmitted(false)} className="text-brand-primary font-bold hover:underline">Submit Another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h3 className="text-2xl font-bold mb-4">Voice of the Player</h3>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Usability Rating</label>
                                <div className="flex space-x-4">
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <button key={v} type="button" className="flex-grow py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-brand-primary hover:text-brand-primary transition-all font-bold">
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Suggestions or Improvement</label>
                                <textarea
                                    className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary font-medium"
                                    placeholder="Tell us what you'd love to see next..."
                                />
                            </div>
                            <button className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all">
                                Dispatch Feedback
                            </button>
                        </form>
                    )}
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-bold uppercase tracking-tighter">Evaluation Roadmap</h3>
                    <div className="space-y-4">
                        {[
                            { title: 'AI latency optimization', desc: 'Reducing response time by 40% for real-time strategy tips.', progress: 75 },
                            { title: 'Multiplayer Lobby Beta', desc: 'Implementing peer-to-peer WebSocket synchronization.', progress: 40 },
                            { title: 'Accessibility Compliance', desc: 'Meeting WCAG 2.1 Level AA standards for screen readers.', progress: 95 }
                        ].map((item, i) => (
                            <div key={i} className="p-4 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between mb-2">
                                    <h5 className="font-bold text-sm uppercase">{item.title}</h5>
                                    <span className="text-xs font-bold text-brand-primary">{item.progress}%</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">{item.desc}</p>
                                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-primary transition-all duration-1000" style={{ width: `${item.progress}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
