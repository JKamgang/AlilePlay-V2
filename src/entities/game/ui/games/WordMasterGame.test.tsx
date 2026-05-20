import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WordMasterGame from './WordMasterGame';
import { aiRouter } from '@/shared/api/ai/aiRouter';

// Mock the aiRouter
vi.mock('@/shared/api/ai/aiRouter', () => ({
    aiRouter: {
        generateContent: vi.fn(),
    },
}));

describe('WordMasterGame', () => {
    const mockT = (key: string) => key;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should handle error when analyzing word fails', async () => {
        // Mock to throw an error
        vi.mocked(aiRouter.generateContent).mockRejectedValueOnce(new Error('Network Error'));

        render(<WordMasterGame t={mockT} />);

        // We need to place a tile so the analyze button is enabled
        // Wait for tiles to be rendered (from initial draw)
        const tiles = await screen.findAllByText(/^[A-Z]$/);

        // Find one tile that is not placed (opacity-30 is added when placed)
        const unplacedTile = tiles.find(tile => !tile.parentElement?.classList.contains('opacity-30'));
        if (!unplacedTile) {
            throw new Error('No unplaced tile found');
        }

        // Click the tile to select it
        fireEvent.click(unplacedTile);

        // Click on the center of the board to place it (7,7)
        // Find all board cells. There are 15x15 = 225 cells. Center is index 112.
        const boardCells = document.querySelectorAll('.aspect-square.border');
        const centerCell = boardCells[112];
        fireEvent.click(centerCell);

        // The analyze button should now be enabled.
        const analyzeButton = screen.getByText('analyze_word');
        expect(analyzeButton).not.toBeDisabled();

        // Click analyze
        fireEvent.click(analyzeButton);

        // Check if loading state was set (button text changes)
        expect(screen.getByText('Analyzing...')).toBeInTheDocument();

        // Wait for error state to be set and loading to finish
        await waitFor(() => {
            expect(screen.getByText('Failed to get analysis.')).toBeInTheDocument();
        });

        // The button should go back to "analyze_word" (loading finished)
        expect(screen.getByText('analyze_word')).toBeInTheDocument();
    });
});
