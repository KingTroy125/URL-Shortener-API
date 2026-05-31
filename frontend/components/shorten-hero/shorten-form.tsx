'use client';

import type { KeyboardEvent } from 'react';
import { ArrowRight, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Define the props for the ShortenForm component
type ShortenFormProps = {
  error: string;
  isLoading: boolean;
  url: string;
  onChangeUrl: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onShorten: () => void;
};

// ShortenForm component that renders the input field, shorten button, and error message
export function ShortenForm({
  error,
  isLoading,
  url,
  onChangeUrl,
  onKeyDown,
  onShorten,
}: ShortenFormProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />

          <Input
            type="url"
            placeholder="Enter your long URL here..."
            value={url}
            onChange={(e) => onChangeUrl(e.target.value)}
            onKeyDown={onKeyDown}
            className="h-14 pl-12 pr-4 text-base rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm"
          />
        </div>

        <Button
          size="lg"
          onClick={onShorten}
          disabled={isLoading}
          className="h-14 px-8 font-medium rounded-2xl"
        >
          {isLoading ? (
            'Shortening...'
          ) : (
            <span className="flex items-center gap-2">
              Shorten
              <ArrowRight className="size-4" />
            </span>
          )}
        </Button>
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </>
  );
}
