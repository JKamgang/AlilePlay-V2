import { create } from 'zustand';
import { UserTier } from '@/shared/api/ai';

interface SubscriptionState {
    tier: UserTier;
    setTier: (tier: UserTier) => void;
    isPremium: () => boolean;
}

export const useSubscription = create<SubscriptionState>((set, get) => ({
    tier: 'free',
    setTier: (tier) => set({ tier }),
    isPremium: () => ['plan-a', 'plan-b', 'plan-c'].includes(get().tier)
}));
