import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import type * as React from 'react';
import { cn } from '@/lib/utils';

const variants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold shadow-2xl shadow-[#0A66C2]/50 hover:shadow-[#0A66C2]/70 hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm bg-gradient-to-r from-[#0A66C2] to-[#007AFF] text-white cursor-pointer outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'px-6 py-2 text-base',
        sm: 'px-8 py-2 text-lg',
        lg: 'px-10 py-4 text-xl',
        xl: 'px-12 py-8 text-2xl'
      }
    },
    defaultVariants: {
      size: 'lg'
    }
  }
);

type BaseCtaButtonProps = {
  children?: React.ReactNode;
  className?: string;
} & VariantProps<typeof variants>;

type CtaButtonAsLink = BaseCtaButtonProps & {
  href: string;
  type?: never;
  onClick?: never;
};

type CtaButtonAsButton = BaseCtaButtonProps & {
  href?: never;
  type?: 'button' | 'submit';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

type CtaButtonProps = CtaButtonAsLink | CtaButtonAsButton;

const ButtonContent = ({ children }: { children: React.ReactNode }) => (
  <>
    <span className="relative z-10 flex items-center gap-2">{children}</span>
    <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
  </>
);

export function CtaButton({
  children = "Let's connect",
  className,
  size,
  ...props
}: CtaButtonProps) {
  const buttonClassName = cn(variants({ size }), className);

  if ('href' in props && props.href) {
    return (
      <Link href={props.href}>
        <button type="button" className={buttonClassName}>
          <ButtonContent>{children}</ButtonContent>
        </button>
      </Link>
    );
  }

  return (
    <button type={props.type || 'button'} onClick={props.onClick} className={buttonClassName}>
      <ButtonContent>{children}</ButtonContent>
    </button>
  );
}
