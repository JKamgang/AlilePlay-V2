import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotebookLMAudioWidget from './NotebookLMAudioWidget';
import { aiRouter } from '@/shared/api/ai/aiRouter';

// Mock the AI router
vi.mock('@/shared/api/ai/aiRouter', () => ({
    aiRouter: {
        generateContent: vi.fn(),
    },
}));

describe('NotebookLMAudioWidget', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the initial state correctly', () => {
        render(<NotebookLMAudioWidget gameData="Test Data" userTier="pro" />);

        expect(screen.getByText('🎧 NotebookLM-style Audio Summary')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Generate Podcast Script' })).toBeInTheDocument();
        expect(screen.queryByText('Generating Audio Script...')).not.toBeInTheDocument();
    });

    it('generates an audio script successfully (Happy Path)', async () => {
        const mockResponse = "Welcome to the podcast! Here is the summary...";
        (aiRouter.generateContent as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

        render(<NotebookLMAudioWidget gameData="Score: 100" userTier="pro" />);

        const button = screen.getByRole('button', { name: 'Generate Podcast Script' });
        fireEvent.click(button);

        // Verify loading state
        expect(screen.getByRole('button', { name: 'Generating Audio Script...' })).toBeDisabled();

        // Verify aiRouter was called correctly
        expect(aiRouter.generateContent).toHaveBeenCalledWith({
            userTier: 'pro',
            taskType: 'voice',
            prompt: 'Convert this game data into a Podcast-style audio script summary (NotebookLM style): Score: 100'
        });

        // Verify the response is displayed
        await waitFor(() => {
            expect(screen.getByText(mockResponse)).toBeInTheDocument();
        });

        // Verify loading state is reset
        expect(screen.getByRole('button', { name: 'Generate Podcast Script' })).not.toBeDisabled();
    });

    it('handles errors during script generation (Error Path)', async () => {
        const mockError = new Error("API rate limit exceeded");
        (aiRouter.generateContent as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

        render(<NotebookLMAudioWidget gameData="Score: 100" userTier="pro" />);

        const button = screen.getByRole('button', { name: 'Generate Podcast Script' });
        fireEvent.click(button);

        // Verify loading state
        expect(screen.getByRole('button', { name: 'Generating Audio Script...' })).toBeDisabled();

        // Verify the error message is displayed
        await waitFor(() => {
            expect(screen.getByText('API rate limit exceeded')).toBeInTheDocument();
        });

        // Verify loading state is reset
        expect(screen.getByRole('button', { name: 'Generate Podcast Script' })).not.toBeDisabled();
    });

    it('handles missing gameData property (Edge Case)', async () => {
        const mockResponse = "Default summary";
        (aiRouter.generateContent as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

        render(<NotebookLMAudioWidget userTier="free" />);

        const button = screen.getByRole('button', { name: 'Generate Podcast Script' });
        fireEvent.click(button);

        // Verify aiRouter was called with the fallback text
        expect(aiRouter.generateContent).toHaveBeenCalledWith({
            userTier: 'free',
            taskType: 'voice',
            prompt: 'Convert this game data into a Podcast-style audio script summary (NotebookLM style): No data provided.'
        });

        await waitFor(() => {
            expect(screen.getByText(mockResponse)).toBeInTheDocument();
        });
    });
});
