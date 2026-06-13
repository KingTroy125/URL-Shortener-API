import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ShortenHero from '@/components/shortenhero';

// Mock clipboard API since JSDOM does not support it
const mockWriteText = jest.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  configurable: true,
  writable: true,
});

const API_URL = 'http://mock-api.com';
process.env.NEXT_PUBLIC_API_URL = API_URL;

// Suppress console.error during tests for expected error states
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ShortenHero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders the initial state of the URL shortener form', () => {
    render(<ShortenHero />);
    expect(screen.getByPlaceholderText(/enter your long url here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shorten/i })).toBeInTheDocument();
    expect(screen.queryByText(/your shortened url/i)).not.toBeInTheDocument();
  });

  // --- Loading States ---
  test('handles loading states during shortening request', async () => {
    let resolveFetch: (value: any) => void = () => {};
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });
    
    (global.fetch as jest.Mock).mockReturnValue(fetchPromise);

    render(<ShortenHero />);
    const input = screen.getByPlaceholderText(/enter your long url here/i);
    const button = screen.getByRole('button', { name: /shorten/i });

    // Type a long URL and trigger shortening
    fireEvent.change(input, { target: { value: 'https://example.com/some/long/path/to/resource' } });
    fireEvent.click(button);

    // Verify loading states: button is disabled and text shows "Shortening..."
    expect(button).toBeDisabled();
    expect(screen.getByText('Shortening...')).toBeInTheDocument();

    // Resolve the fetch request
    await act(async () => {
      resolveFetch({
        ok: true,
        json: async () => ({ shortUrl: 'https://short.est/abc' }),
      });
    });

    // Verify loading states have ended and result is displayed
    expect(button).not.toBeDisabled();
    expect(screen.queryByText('Shortening...')).not.toBeInTheDocument();
    expect(screen.getByText('Shorten')).toBeInTheDocument();
    expect(screen.getByText('https://short.est/abc')).toBeInTheDocument();
  });

  // --- Error States ---
  test('displays error when URL is empty or only whitespace', () => {
    render(<ShortenHero />);
    const button = screen.getByRole('button', { name: /shorten/i });

    // Submit empty form
    fireEvent.click(button);

    expect(screen.getByText('Please enter a URL')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();

    // Type whitespace and submit
    const input = screen.getByPlaceholderText(/enter your long url here/i);
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(screen.getByText('Please enter a URL')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('displays server-side error returned by backend', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'This URL is already shortened or invalid' }),
    });

    render(<ShortenHero />);
    const input = screen.getByPlaceholderText(/enter your long url here/i);
    const button = screen.getByRole('button', { name: /shorten/i });

    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('This URL is already shortened or invalid')).toBeInTheDocument();
    });
  });

  test('displays fallback server error when shortUrl is missing from a successful JSON response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ error: 'Malformed response structure from API' }),
    });

    render(<ShortenHero />);
    const input = screen.getByPlaceholderText(/enter your long url here/i);
    const button = screen.getByRole('button', { name: /shorten/i });

    fireEvent.change(input, { target: { value: 'https://valid-url.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Malformed response structure from API')).toBeInTheDocument();
    });
  });

  test('displays connection error on network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network offline'));

    render(<ShortenHero />);
    const input = screen.getByPlaceholderText(/enter your long url here/i);
    const button = screen.getByRole('button', { name: /shorten/i });

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Unable to connect to backend')).toBeInTheDocument();
    });
  });

  // --- Copy Button Behavior ---
  test('handles copy to clipboard and button text transition', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ shortUrl: 'https://short.est/xyz' }),
    });

    render(<ShortenHero />);
    const input = screen.getByPlaceholderText(/enter your long url here/i);
    const shortenButton = screen.getByRole('button', { name: /shorten/i });

    // Get the shortened URL first
    fireEvent.change(input, { target: { value: 'https://example.com/another/long/url' } });
    fireEvent.click(shortenButton);

    // Wait for the copy button to appear
    let copyButton: HTMLElement;
    await waitFor(() => {
      copyButton = screen.getByRole('button', { name: /copy/i });
      expect(copyButton).toBeInTheDocument();
    });

    // Click the copy button
    fireEvent.click(copyButton!);

    // Wait for the copy promise to resolve and component state to update
    await act(async () => {});

    // Verify navigator.clipboard.writeText was called
    expect(mockWriteText).toHaveBeenCalledWith('https://short.est/xyz');

    // Verify copy button changes text to "Copied!"
    expect(screen.getByRole('button', { name: /copied!/i })).toBeInTheDocument();

    // Fast-forward 2 seconds to see the label revert
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Verify the copy button has reverted to "Copy"
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });
});
