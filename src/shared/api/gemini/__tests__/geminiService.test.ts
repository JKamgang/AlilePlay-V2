import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getMockAnalytics } from '../geminiService';
import { MOCK_ANALYTICS_DATA } from '@/shared/constants';

describe('getMockAnalytics', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return mock analytics data after a 500ms delay', async () => {
        const promise = getMockAnalytics();

        // Advance timers by exactly 500ms
        await vi.advanceTimersByTimeAsync(500);

        const data = await promise;
        expect(data).toEqual(MOCK_ANALYTICS_DATA);
    });
});
