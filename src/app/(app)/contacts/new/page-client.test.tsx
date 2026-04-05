import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Circle } from '@/lib/circles/types';
import { NewContactPageClient } from './page-client';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: vi.fn(),
    replace: vi.fn()
  })
}));

vi.mock('@next-safe-action/adapter-react-hook-form/hooks', async (importOriginal) => {
  const rhf = await import('react-hook-form');
  const actual =
    await importOriginal<typeof import('@next-safe-action/adapter-react-hook-form/hooks')>();
  type HookOpts = {
    formProps?: { defaultValues?: Record<string, unknown> };
    actionProps?: { currentState?: { circles: unknown[] } };
  };
  return {
    ...actual,
    useHookFormAction: (_a: unknown, _r: unknown, opts: HookOpts = {}) => {
      const form = rhf.useForm({
        defaultValues: opts.formProps?.defaultValues as never
      });
      return {
        form,
        action: { status: 'idle' as const },
        handleSubmitWithAction: (e?: { preventDefault?: () => void }) => {
          e?.preventDefault?.();
          return Promise.resolve();
        }
      };
    },
    useHookFormOptimisticAction: (_a: unknown, _r: unknown, opts: HookOpts = {}) => {
      const initialCircles = opts.actionProps?.currentState?.circles ?? [];
      const form = rhf.useForm({
        defaultValues: opts.formProps?.defaultValues as never
      });
      return {
        form,
        action: {
          status: 'idle' as const,
          optimisticState: { circles: initialCircles },
          result: null
        },
        handleSubmitWithAction: (e?: { preventDefault?: () => void }) => {
          e?.preventDefault?.();
          return Promise.resolve();
        }
      };
    }
  };
});

function buildCircle(overrides: Partial<Circle> = {}): Circle {
  return {
    id: 'circle-1',
    name: 'Music',
    color: '#22c55e',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    user_id: null,
    description: null,
    icon: null,
    favorite: false,
    ...overrides
  };
}

describe('NewContactPageClient', () => {
  it('circle button gains fill color when selected', () => {
    const circle = buildCircle();
    render(<NewContactPageClient profileLink="https://example.com/u" initialCircles={[circle]} />);
    const button = screen.getByRole('button', { name: circle.name });
    fireEvent.click(button);
    expect(button).toHaveStyle({ backgroundColor: circle.color });
  });

  it('circle button loses fill color when toggled off', () => {
    const circle = buildCircle();
    render(<NewContactPageClient profileLink="https://example.com/u" initialCircles={[circle]} />);
    const button = screen.getByRole('button', { name: circle.name });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(button.style.backgroundColor).toBe('');
  });
});
