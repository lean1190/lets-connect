import { AnimateWhenVisible } from '@/components/animate-when-visible';
import { CtaButton } from '@/components/ui/cta-button';

export function HeroSection({ ctaHref }: { ctaHref: string }) {
  return (
    <AnimateWhenVisible>
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-7xl font-bold mb-6 leading-tight">
            Stay in touch with your
            <span className="bg-linear-to-r from-[#0A66C2] to-[#007AFF] bg-clip-text text-transparent">
              {' '}
              entrepreneurial circle
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            A simple way to keep track of the connections that matter.
          </p>
          <div className="flex justify-center">
            <CtaButton href={ctaHref} />
          </div>
        </div>
      </section>
    </AnimateWhenVisible>
  );
}
