import { motion, type Variants } from 'motion/react';

const circleSvgVariants = {
  hidden: {},
  visible: {
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
      staggerChildren: 0.5
    }
  }
} as const;

const rectVariants: Variants = {
  hidden: {
    opacity: 0.5
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 3,
      ease: 'easeInOut' as const,
      repeat: Infinity,
      repeatType: 'reverse' as const
    }
  }
};

export function QrIcon({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      initial="hidden"
      animate="visible"
      variants={circleSvgVariants}
    >
      <motion.rect
        x="4"
        y="2"
        width="6"
        height="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        variants={rectVariants}
      />
      <motion.rect
        x="6"
        y="4"
        width="2"
        height="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        variants={rectVariants}
      />

      <motion.rect
        x="4"
        y="14"
        width="6"
        height="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        variants={rectVariants}
      />

      <motion.rect
        x="14"
        y="2"
        width="6"
        height="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        variants={rectVariants}
      />

      <motion.rect
        x="8"
        y="8"
        width="8"
        height="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        variants={rectVariants}
      />
      <motion.rect
        x="10"
        y="10"
        width="1"
        height="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        variants={rectVariants}
      />

      <motion.rect
        x="14"
        y="14"
        width="6"
        height="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        variants={rectVariants}
      />
      <motion.rect
        x="14"
        y="14"
        width="2"
        height="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        variants={rectVariants}
      />
    </motion.svg>
  );
}
