import { describe, it, expect, beforeEach } from 'vitest';
import { useSubscription } from './useSubscription';


describe('useSubscription', () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    useSubscription.setState({ tier: 'free' });
  });

  it('should initialize with "free" tier', () => {
    const { tier } = useSubscription.getState();
    expect(tier).toBe('free');
  });

  it('should not be premium initially', () => {
    const { isPremium } = useSubscription.getState();
    expect(isPremium()).toBe(false);
  });

  it('should update the tier correctly', () => {
    useSubscription.getState().setTier('pro');
    expect(useSubscription.getState().tier).toBe('pro');
  });

  describe('isPremium', () => {
    it('should return true for "plan-a"', () => {
      useSubscription.getState().setTier('plan-a');
      expect(useSubscription.getState().isPremium()).toBe(true);
    });

    it('should return true for "plan-b"', () => {
      useSubscription.getState().setTier('plan-b');
      expect(useSubscription.getState().isPremium()).toBe(true);
    });

    it('should return true for "plan-c"', () => {
      useSubscription.getState().setTier('plan-c');
      expect(useSubscription.getState().isPremium()).toBe(true);
    });

    it('should return false for "free"', () => {
      useSubscription.getState().setTier('free');
      expect(useSubscription.getState().isPremium()).toBe(false);
    });

    it('should return false for "preview"', () => {
      useSubscription.getState().setTier('preview');
      expect(useSubscription.getState().isPremium()).toBe(false);
    });

    it('should return false for "pro" as it is not in the explicit list currently', () => {
      // NOTE: the code implementation is currently: ['plan-a', 'plan-b', 'plan-c'].includes(get().tier)
      // We are writing a test for the existing logic, even if "pro" or "enterprise" might logically be expected to be premium.
      // If that's a bug in useSubscription, we're testing the current implementation gap.
      useSubscription.getState().setTier('pro');
      expect(useSubscription.getState().isPremium()).toBe(false);
    });

    it('should return false for "enterprise" as it is not in the explicit list currently', () => {
      useSubscription.getState().setTier('enterprise');
      expect(useSubscription.getState().isPremium()).toBe(false);
    });
  });
});
