import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import WordMasterGame from './WordMasterGame';
import { aiRouter } from '@/shared/api/ai/aiRouter';

vi.mock('@/shared/api/ai/aiRouter', () => ({
  aiRouter: {
    generateContent: vi.fn(),
  },
}));

describe('WordMasterGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates and plays a word correctly', async () => {
    const t = (key: string) => key;
    const { container } = render(<WordMasterGame t={t as any} />);

    const playWordBtn = screen.getByText('play_word');

    // Get rack tiles
    const rackTiles = container.querySelectorAll('.flex.justify-center.items-center.gap-1 > div');
    expect(rackTiles.length).toBe(7);

    const letter1 = rackTiles[0].textContent?.charAt(0) || '';
    const letter2 = rackTiles[1].textContent?.charAt(0) || '';
    const letter3 = rackTiles[2].textContent?.charAt(0) || '';

    const expectedWord = `${letter1}${letter2}${letter3}`;

    // Get board cells
    const boardCells = container.querySelectorAll('.grid-cols-15 > div');
    expect(boardCells.length).toBe(225);

    // Place tile 1 at center (7, 7) => index 7*15 + 7 = 112
    fireEvent.click(rackTiles[0]);
    fireEvent.click(boardCells[112]);

    // Place tile 2 at (7, 8) => index 113
    fireEvent.click(rackTiles[1]);
    fireEvent.click(boardCells[113]);

    // Place tile 3 at (7, 9) => index 114
    fireEvent.click(rackTiles[2]);
    fireEvent.click(boardCells[114]);

    // Mock the AI response
    const mockResponse = JSON.stringify({
      definition: 'test definition',
      synonyms: ['test'],
      antonyms: [],
      example: 'test example',
      etymology: 'test origin',
      score: 10
    });
    vi.mocked(aiRouter.generateContent).mockResolvedValueOnce(mockResponse);

    // Click play word
    fireEvent.click(playWordBtn);

    await waitFor(() => {
      expect(aiRouter.generateContent).toHaveBeenCalledWith({
        userTier: 'free',
        taskType: 'basic',
        prompt: expect.stringContaining(`"${expectedWord}"`)
      });
    });

    // Check if the AI analysis result is rendered
    expect(await screen.findByText('test definition')).toBeInTheDocument();
  });
});
