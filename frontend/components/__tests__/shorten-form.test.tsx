import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShortenForm } from '../shorten-hero/shorten-form';

// Mock jest-dom for testing purposes
describe('ShortenForm Component', () => {
  const mockOnChangeUrl = jest.fn();
  const mockOnKeyDown = jest.fn();
  const mockOnShorten = jest.fn();

  const defaultProps = {
    error: '',
    isLoading: false,
    url: '',
    onChangeUrl: mockOnChangeUrl,
    onKeyDown: mockOnKeyDown,
    onShorten: mockOnShorten,
  };

  // Reset mock functions before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test to check if the component renders correctly with initial state
  test('renders initial state correctly with input and button', () => {
    render(<ShortenForm {...defaultProps} />);

    const input = screen.getByPlaceholderText(/enter your long url here/i);
    const button = screen.getByRole('button', { name: /shorten/i });

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(screen.queryByText('Shortening...')).not.toBeInTheDocument();
  });

  // Test to check if the input value is displayed correctly
  test('renders the input value passed through props', () => {
    render(<ShortenForm {...defaultProps} url="https://example.com" />);

    const input = screen.getByPlaceholderText(/enter your long url here/i);
    expect(input).toHaveValue('https://example.com');
  });

  // Test to check if the onChangeUrl callback is triggered when input text changes
  test('triggers onChangeUrl callback when input text changes', () => {
    render(<ShortenForm {...defaultProps} />);

    const input = screen.getByPlaceholderText(/enter your long url here/i);
    fireEvent.change(input, { target: { value: 'https://new-url.com' } });

    expect(mockOnChangeUrl).toHaveBeenCalledTimes(1);
    expect(mockOnChangeUrl).toHaveBeenCalledWith('https://new-url.com');
  });

  // Test to check if the onShorten callback is triggered when the button is clicked
  test('triggers onShorten callback when clicking the button', () => {
    render(<ShortenForm {...defaultProps} />);

    const button = screen.getByRole('button', { name: /shorten/i });
    fireEvent.click(button);

    expect(mockOnShorten).toHaveBeenCalledTimes(1);
  });

  // Test to check if the onKeyDown callback is triggered when a key is pressed down on the input
  test('triggers onKeyDown callback when key is pressed down on input', () => {
    render(<ShortenForm {...defaultProps} />);

    const input = screen.getByPlaceholderText(/enter your long url here/i);
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
  });

  // Test to check if the button is disabled and loading text is shown when isLoading prop is true
  test('disables the button and shows loading text when isLoading is true', () => {
    render(<ShortenForm {...defaultProps} isLoading={true} />);

    const button = screen.getByRole('button');
    const input = screen.getByPlaceholderText(/enter your long url here/i);

    expect(button).toBeDisabled();
    expect(screen.getByText('Shortening...')).toBeInTheDocument();
    expect(screen.queryByText('Shorten')).not.toBeInTheDocument();
  });

  // Test to check if the error message is displayed when the error prop is provided
  test('displays error message when error prop is provided', () => {
    render(<ShortenForm {...defaultProps} error="An error occurred" />);

    const errorMessage = screen.getByText('An error occurred');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-destructive');
  });
});
