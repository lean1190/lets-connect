'use client';

import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import { cn } from '@/lib/utils';

type PopoverContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

function Popover({
  children,
  ...props
}: React.ComponentProps<'div'> & {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('PopoverTrigger must be used within Popover');

  const { setOpen, open } = context;

  if (asChild && isValidElement(children)) {
    const childProps = children.props as { onClick?: (e: React.MouseEvent) => void };
    return cloneElement(children, {
      ...props,
      onClick: (e: React.MouseEvent) => {
        setOpen(!open);
        childProps.onClick?.(e);
      }
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <button type="button" onClick={() => setOpen(!open)} {...props}>
      {children}
    </button>
  );
}

function PopoverContent({
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  children: React.ReactNode;
}) {
  const context = useContext(PopoverContext);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!context) throw new Error('PopoverContent must be used within Popover');

  const { open, setOpen } = context;

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      data-slot="popover-content"
      className={cn(
        'absolute z-50 mt-2 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Popover, PopoverContent, PopoverTrigger };
