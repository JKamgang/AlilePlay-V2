import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import InfographicWidget from './InfographicWidget';
import { aiRouter } from '@/shared/api/ai/aiRouter';

// Mock the aiRouter
vi.mock('@/shared/api/ai/aiRouter', () => ({
    aiRouter: {
        generateContent: vi.fn(),
    },
}));

describe('InfographicWidget', () => {
    const mockUserTier = 'free';
    const mockDataString = 'Sample data for infographic';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the component with initial state', () => {
        render(<InfographicWidget userTier={mockUserTier} dataString={mockDataString} />);

        expect(screen.getByText('📊 AI Infographic Generator')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Generate Infographic Data' })).toBeInTheDocument();
        expect(screen.queryByText(/Generating Layout/i)).not.toBeInTheDocument();
    });

    it('shows loading state and generates infographic successfully', async () => {
        const mockResponse = 'Mocked infographic plan';
        (aiRouter.generateContent as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

        render(<InfographicWidget userTier={mockUserTier} dataString={mockDataString} />);

        const button = screen.getByRole('button', { name: 'Generate Infographic Data' });

        // Click to start generation
        fireEvent.click(button);

        // Assert loading state
        expect(button).toHaveTextContent('Generating Layout...');
        expect(button).toBeDisabled();

        // Wait for the mock to resolve and state to update
        await waitFor(() => {
            expect(screen.getByText(mockResponse)).toBeInTheDocument();
        });

        // Assert loading state is removed
        expect(button).toHaveTextContent('Generate Infographic Data');
        expect(button).not.toBeDisabled();

        // Assert API was called correctly
        expect(aiRouter.generateContent).toHaveBeenCalledWith({
            userTier: mockUserTier,
            taskType: 'complex',
            prompt: `Analyze this data and provide a detailed visual layout for an infographic: ${mockDataString}`
        });
    });

    it('shows loading state and generates infographic successfully with empty dataString', async () => {
        const mockResponse = 'Mocked infographic plan';
        (aiRouter.generateContent as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

        render(<InfographicWidget userTier={mockUserTier} />);

        const button = screen.getByRole('button', { name: 'Generate Infographic Data' });

        // Click to start generation
        fireEvent.click(button);

        // Wait for the mock to resolve and state to update
        await waitFor(() => {
            expect(screen.getByText(mockResponse)).toBeInTheDocument();
        });

        // Assert API was called correctly with default text
        expect(aiRouter.generateContent).toHaveBeenCalledWith({
            userTier: mockUserTier,
            taskType: 'complex',
            prompt: `Analyze this data and provide a detailed visual layout for an infographic: No data provided.`
        });
    });

    it('handles errors during generation', async () => {
        const errorMessage = 'API Error';
        (aiRouter.generateContent as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error(errorMessage));

        render(<InfographicWidget userTier={mockUserTier} dataString={mockDataString} />);

        const button = screen.getByRole('button', { name: 'Generate Infographic Data' });

        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        expect(button).toHaveTextContent('Generate Infographic Data');
        expect(button).not.toBeDisabled();
    });

    it('handles non-Error objects during generation', async () => {
        (aiRouter.generateContent as ReturnType<typeof vi.fn>).mockRejectedValueOnce('Some random string error');

        render(<InfographicWidget userTier={mockUserTier} dataString={mockDataString} />);

        const button = screen.getByRole('button', { name: 'Generate Infographic Data' });

        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Failed to generate infographic layout.')).toBeInTheDocument();
        });
    });
});
