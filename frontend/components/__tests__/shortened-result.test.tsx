import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShortenedResult } from '../shorten-hero/shortened-result';

// Mock jest-dom for testing purposes

describe('ShortenedResult Component', () => {
  const mockOnCopy = jest.fn();

  const defaultProps = {
    copied: false,
    shortenedUrl: 'https://short.est/abc',
    onCopy: mockOnCopy,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test to check if the shortened URL is displayed correctly
  test('renders shortened URL with correct href and anchor attributes', () => {
    render(<ShortenedResult {...defaultProps} />);

    const link = screen.getByRole('link', { name: 'https://short.est/abc' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://short.est/abc');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  // Test to check if the Copy button is displayed correctly
  test('renders Copy button and copy icon when copied prop is false', () => {
    render(<ShortenedResult {...defaultProps} copied={false} />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    expect(copyButton).toBeInTheDocument();
    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
  });

  // Test to check if the Copied! button is displayed correctly
  test('renders Copied! button and check icon when copied prop is true', () => {
    render(<ShortenedResult {...defaultProps} copied={true} />);

    const copiedButton = screen.getByRole('button', { name: /copied!/i });
    expect(copiedButton).toBeInTheDocument();
    expect(screen.queryByText('Copy')).not.toBeInTheDocument();
  });

  // Test to check if the onCopy callback is triggered when the copy button is clicked
  test('calls onCopy callback when copy button is clicked', () => {
    render(<ShortenedResult {...defaultProps} />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    expect(mockOnCopy).toHaveBeenCalledTimes(1);
  });
});
