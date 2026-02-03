'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type AnimateWhenVisibleProps = {
  children: React.ReactNode;
  className?: string;
};

const animationClasses =
  'data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=visible]:slide-in-from-bottom-8 duration-500 fill-mode-[both]';

export function AnimateWhenVisible({ children, className }: AnimateWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => (entry?.isIntersecting ? setIsVisible(true) : undefined),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-state={isVisible ? 'visible' : 'hidden'}
      className={cn(animationClasses, className)}
    >
      {children}
    </div>
  );
}
