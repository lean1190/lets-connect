import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { foundNewsletterUrl } from '@/lib/constants/links';

export function EventsHero() {
  return (
    <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-6">
      <Link
        href="https://www.foundhamburg.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full hover:opacity-90 transition-opacity"
      >
        <Image
          src="/found.png"
          alt="found Hamburg"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </Link>
      <div className="absolute top-3 left-3 text-xs text-white/80 font-medium">Powered by</div>
      <Link
        href={foundNewsletterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 right-3"
      >
        <Button size="xs" variant="secondary">
          Subscribe
        </Button>
      </Link>
    </div>
  );
}
