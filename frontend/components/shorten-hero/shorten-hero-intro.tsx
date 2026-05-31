import { ShortenHeroBadge } from '@/components/shorten-hero/shorten-hero-badge';

export function ShortenHeroIntro() {
  return (
    <>
      <ShortenHeroBadge />

      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-foreground max-w-4xl mb-6 text-balance">
        Shorten URLs.
        <br />
        Share your links with ease.
      </h1>

      <p className="max-w-2xl text-muted-foreground text-sm sm:text-base font-normal leading-relaxed mb-10 text-pretty">
        Create short, memorable links in seconds. Get powerful analytics and
        insights to understand your audience better.
      </p>
    </>
  );
}
