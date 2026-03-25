'use client';

import { AnimatePresence, motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { CirclesIcon } from '@/components/ui/circles-icon';
import { CloudIcon } from '@/components/ui/cloud-icon';
import { QrIcon } from '@/components/ui/qr-icon';

const easeOutQuad = [0.25, 0.46, 0.45, 0.94] as const;

const featureSectionVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.4
    }
  }
} as const;

const fadeIn = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: easeOutQuad }
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
    transition: { duration: 0.5, ease: easeOutQuad }
  }
} as const;

const featureListVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.4
    }
  }
} as const;

export function FeatureSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div className="container mx-auto px-6 pt-8 pb-20" ref={ref}>
      <AnimatePresence>
        {isInView && (
          <motion.section initial={'hidden'} animate="visible" variants={featureSectionVariants}>
            <motion.div variants={fadeIn} className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Build your network</h2>
              <p className="text-xl text-gray-400">
                Everything you need to maintain meaningful connections
              </p>
            </motion.div>

            <motion.div
              variants={featureListVariants}
              className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              {features.map((feature) => (
                <FeatureItem key={feature.title} {...feature} />
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FeatureItem({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className="rounded-3xl border border-white/10 border-b-0 bg-[#111111] p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.65),inset_0_1px_0_0_rgba(255,255,255,0.06)] md:p-10"
    >
      <div className="w-14 h-14 bg-[#0A66C2]/20 rounded-lg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

const features = [
  {
    icon: <QrIcon className="w-8 h-8 text-blue-400" />,
    title: 'Scan & Connect',
    description:
      'Instantly scan LinkedIn and WhatsApp QR codes to save contacts with context about why you connected.'
  },
  {
    icon: <CirclesIcon className="w-8 h-8 text-blue-400" />,
    title: 'Organize Your Network',
    description:
      'Organize your contacts in circles and add notes so you never forget the context of your connections.'
  },
  {
    icon: <CloudIcon className="w-8 h-8 text-blue-400" />,
    title: 'Sync Everywhere',
    description:
      'Access your network from any device. Your data is securely synced across all your devices.'
  }
];
