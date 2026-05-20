import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotebookLMAudioWidget from './NotebookLMAudioWidget';
import { aiRouter } from '@/shared/api/ai/aiRouter';

// Mock the aiRouter
vi.mock('@/shared/api/ai/aiRouter', () => ({
    aiRouter: {
        generateContent: vi.fn(),
    },
}));

describe('NotebookLMAudioWidget', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays error message when audio generation fails', async () => {
        // Arrange: Mock the generateContent to reject with an error
        const errorMessage = 'API rate limit exceeded';
        vi.mocked(aiRouter.generateContent).mockRejectedValueOnce(new Error(errorMessage));

        // Act: Render and click the button
        render(<NotebookLMAudioWidget userTier="free" gameData="Mock Game Data" />);

        const button = screen.getByRole('button', { name: /Generate Podcast Script/i });
        fireEvent.click(button);

        // Assert: Button should show loading state, then show error message
        expect(button).toBeDisabled();

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        // Button should be re-enabled after error
        expect(button).not.toBeDisabled();
    });

    it('displays audio script successfully on happy path', async () => {
        // Arrange: Mock successful generation
        const mockScript = 'Welcome to the podcast! Today we discuss Mock Game Data.';
        vi.mocked(aiRouter.generateContent).mockResolvedValueOnce(mockScript);

        // Act: Render and click
        render(<NotebookLMAudioWidget userTier="free" gameData="Mock Game Data" />);

        const button = screen.getByRole('button', { name: /Generate Podcast Script/i });
        fireEvent.click(button);

        // Assert
        await waitFor(() => {
            expect(screen.getByText(mockScript)).toBeInTheDocument();
        });

        // Ensure no error is shown
        expect(screen.queryByText(/Failed to generate/i)).not.toBeInTheDocument();
    });

    it('shows default error message if error has no message', async () => {
        // Arrange: Reject without a message
        vi.mocked(aiRouter.generateContent).mockRejectedValueOnce({});

        // Act
        render(<NotebookLMAudioWidget userTier="free" />);

        const button = screen.getByRole('button', { name: /Generate Podcast Script/i });
        fireEvent.click(button);

        // Assert
        await waitFor(() => {
            expect(screen.getByText('Failed to generate audio summary.')).toBeInTheDocument();
        });
    });
});
