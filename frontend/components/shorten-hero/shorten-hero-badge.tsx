import { Badge } from '@/components/ui/badge';

export function ShortenHeroBadge() {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className="w-12 sm:w-20 h-px bg-linear-to-l from-primary/30 to-transparent" />

      <Badge variant="hero">
        <span className="text-sm font-normal">URL Shortener</span>
      </Badge>

      <div className="w-12 sm:w-20 h-px bg-linear-to-r from-primary/30 to-transparent" />
    </div>
  );
}
