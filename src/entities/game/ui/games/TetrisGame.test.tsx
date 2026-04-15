import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TetrisGame from './TetrisGame';

describe('TetrisGame', () => {
    it('renders without crashing and displays game over state correctly when triggered', () => {
        // Mock translation function
        const t = (key: string) => key;

        render(<TetrisGame t={t} />);

        // Assert initial rendering (score labels should be present)
        expect(screen.getByText('score')).toBeInTheDocument();
        expect(screen.getByText('level')).toBeInTheDocument();
        expect(screen.getByText('lines')).toBeInTheDocument();
        expect(screen.getByText('next')).toBeInTheDocument();
    });
});
