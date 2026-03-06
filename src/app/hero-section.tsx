'use client';

import { motion, useReducedMotion } from 'motion/react';
import { CtaButton } from '@/components/ui/cta-button';

const easeOutQuad = [0.25, 0.46, 0.45, 0.94] as const;

const heroSectionVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.4
    }
  }
} as const;

const fadeInUp = {
  hidden: {
    opacity: 0,
    filter: 'blur(5px)',
    y: 30
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeOutQuad
    }
  }
} as const;

export function HeroSection({ ctaHref }: { ctaHref: string }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.section
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      animate="visible"
      variants={heroSectionVariants}
      className="container mx-auto px-6 py-20 md:py-32 max-w-4xl mx-auto text-center"
    >
      <motion.h1 variants={fadeInUp} className="text-3xl md:text-7xl font-bold mb-6 leading-tight">
        Stay in touch with your
        <span className="bg-linear-to-r from-[#0A66C2] to-[#007AFF] bg-clip-text text-transparent">
          {' '}
          entrepreneurial circle
        </span>
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto"
      >
        A simple way to keep track of the connections that matter.
      </motion.p>

      <motion.div variants={fadeInUp} className="flex justify-center">
        <CtaButton href={ctaHref} />
      </motion.div>
    </motion.section>
  );
}
