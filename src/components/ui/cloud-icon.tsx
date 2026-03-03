import { motion } from 'motion/react';

export function CloudIcon({
  strokeWidth = 2,
  className = ''
}: {
  strokeWidth?: number;
  className?: string;
}) {
  const cloudPath = 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z';
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
      // Gentle floating animation applied to the whole SVG
      animate={{ y: [0, -2, 0] }}
      transition={{
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity
      }}
    >
      <motion.path
        d={cloudPath}
        // Smooth "drawing" effect when the component mounts
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          delay: 1.5,
          duration: 1.5,
          ease: 'easeInOut'
        }}
      />
    </motion.svg>
  );
}
