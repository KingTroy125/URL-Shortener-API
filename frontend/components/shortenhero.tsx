'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ShortenHeroIntro } from '@/components/shorten-hero/shorten-hero-intro';
import { ShortenForm } from '@/components/shorten-hero/shorten-form';
import { ShortenedResult } from '@/components/shorten-hero/shortened-result';

export default function ShortenHero() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Validate URL format (basic check)
  const isValidUrl = (originalUrl: string): boolean => {
    const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(originalUrl);
  };

  // Handle URL shortening
  const handleShorten = async () => {
    setError('');
    setShortenedUrl('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    const urlToShorten = url.trim();

    if (!isValidUrl(urlToShorten)) {
      setError('Invalid URL format. Please enter a valid http or https URL.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shorten`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            originalUrl: urlToShorten,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      const data = await response.json();
      setShortenedUrl(data.shortUrl);
    } catch (error) {
      console.error(error);
      setError('Unable to connect to backend');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortenedUrl) return;

    await navigator.clipboard.writeText(shortenedUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleShorten();
    }
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <ShortenHeroIntro />

          <div className="w-full max-w-2xl">
            <ShortenForm
              error={error}
              isLoading={isLoading}
              url={url}
              onChangeUrl={(value) => {
                setUrl(value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              onShorten={handleShorten}
            />

            {shortenedUrl && (
              <ShortenedResult
                copied={copied}
                shortenedUrl={shortenedUrl}
                onCopy={handleCopy}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
