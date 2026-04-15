
import React from 'react';
import { PLANS } from '../../constants';
import { useApp } from '../../contexts/AppContext';
import type { MonetizationPlan } from '../../types';

const PlanCard: React.FC<{ plan: MonetizationPlan }> = ({ plan }) => {
    const { t } = useApp();

    return (
        <div className={`border rounded-lg p-6 flex flex-col relative
            ${plan.isFeatured ? 'border-brand-primary border-2' : 'border-gray-300 dark:border-gray-700'}
            bg-light-surface dark:bg-dark-surface
        `}>
            {plan.isFeatured && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {t('featured_plan')}
                </div>
            )}
            <h3 className="text-2xl font-bold text-center mb-2">{t(plan.nameKey)}</h3>
            <div className="text-4xl font-extrabold text-center mb-6">
                {plan.price < 0 ? 'Custom' : plan.price === 0 ? 'Free' : `$${plan.price}`}
                {plan.price > 0 && <span className="text-base font-normal text-gray-500">/mo</span>}
            </div>
            <ul className="space-y-3 mb-8 text-center flex-grow">
                {plan.featuresKey.map(key => (
                    <li key={key} className="flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {t(key)}
                    </li>
                ))}
            </ul>
            <button className={`w-full py-2 px-4 rounded-lg font-semibold
                ${plan.isFeatured ? 'bg-brand-primary text-white hover:bg-brand-secondary' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'}
                transition-colors
            `}>
                {plan.price < 0 ? 'Contact Us' : t('btn_select_plan')}
            </button>
        </div>
    );
};


const PricingPage: React.FC = () => {
    const { t } = useApp();
  return (
    <div className="container mx-auto py-12 animate-fade-in">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-brand-primary">{t('pricing')}</h2>
        <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Choose a plan that fits your play style. Unlock more games, more plays, and more fun!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {PLANS.map(plan => <PlanCard key={plan.id} plan={plan} />)}
        </div>
    </div>
  );
};

export default PricingPage;
