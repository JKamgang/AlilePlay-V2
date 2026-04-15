import { describe, it, expect, beforeEach } from 'vitest';
import { useSubscription } from './useSubscription';

describe('useSubscription store', () => {
    beforeEach(() => {
        useSubscription.getState().setTier('free');
    });

    it('should have initial tier as "free"', () => {
        expect(useSubscription.getState().tier).toBe('free');
    });

    it('should update tier when setTier is called', () => {
        useSubscription.getState().setTier('plan-a');
        expect(useSubscription.getState().tier).toBe('plan-a');
    });

    it('isPremium should return false for "free" and "preview"', () => {
        useSubscription.getState().setTier('free');
        expect(useSubscription.getState().isPremium()).toBe(false);

        useSubscription.getState().setTier('preview');
        expect(useSubscription.getState().isPremium()).toBe(false);
    });

    it('isPremium should return true for "plan-a", "plan-b", "plan-c"', () => {
        useSubscription.getState().setTier('plan-a');
        expect(useSubscription.getState().isPremium()).toBe(true);

        useSubscription.getState().setTier('plan-b');
        expect(useSubscription.getState().isPremium()).toBe(true);

        useSubscription.getState().setTier('plan-c');
        expect(useSubscription.getState().isPremium()).toBe(true);
    });

    it('isPremium should return false for "pro" and "enterprise"', () => {
        useSubscription.getState().setTier('pro');
        expect(useSubscription.getState().isPremium()).toBe(false);

        useSubscription.getState().setTier('enterprise');
        expect(useSubscription.getState().isPremium()).toBe(false);
    });
});
