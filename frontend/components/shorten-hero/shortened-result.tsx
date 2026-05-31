'use client';

import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the props for the ShortenedResult component
type ShortenedResultProps = {
  copied: boolean;
  shortenedUrl: string;
  onCopy: () => void;
};

// ShortenedResult component that displays the shortened URL and a copy button
export function ShortenedResult({
  copied,
  shortenedUrl,
  onCopy,
}: ShortenedResultProps) {
  return (
    <div className="mt-6 p-4 rounded-2xl border border-border/50 bg-muted/30 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Your shortened URL
          </span>

          <a
            href={shortenedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-primary hover:underline break-all"
          >
            {shortenedUrl}
          </a>
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={onCopy}
          className="h-12 px-6 rounded-xl shrink-0 w-full sm:w-auto"
        >
          {copied ? (
            <>
              <Check className="size-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="size-4 mr-2" />
              Copy
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
