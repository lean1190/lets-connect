import { motion } from 'motion/react';
import type { ComponentProps } from 'react';

type CircleMotionVariants = NonNullable<ComponentProps<typeof motion.circle>['variants']>;

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

const circleVariants: CircleMotionVariants = {
  hidden: {
    opacity: 0,
    pathLength: 0
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    y: [0, -2, 0],
    x: [0, -2, 0],
    transition: {
      default: { duration: 3, ease: 'easeInOut' },
      y: { duration: 3, ease: 'easeInOut', repeat: Infinity },
      x: { duration: 3, ease: 'easeInOut', repeat: Infinity }
    }
  }
};

export function CirclesIcon({
  strokeWidth = 2,
  className = ''
}: {
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="hidden"
      animate="visible"
      variants={circleSvgVariants}
    >
      <motion.circle cx="8" cy="18" r="4" variants={circleVariants} />

      <motion.circle cx="18" cy="18" r="4" variants={circleVariants} />

      <motion.circle cx="12" cy="8" r="4" variants={circleVariants} />
    </motion.svg>
  );
}
