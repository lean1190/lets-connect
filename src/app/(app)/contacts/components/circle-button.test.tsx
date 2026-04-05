import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import type { Circle } from '@/lib/circles/types';
import { CircleButton } from './circle-button';

function buildCircle(overrides: Partial<Circle> = {}): Circle {
  return {
    id: 'c1',
    name: 'Design',
    color: '#e11d48',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    user_id: null,
    description: null,
    icon: null,
    favorite: false,
    ...overrides
  };
}

function ColoredToggleHarness({ circle }: { circle: Circle }) {
  const [selected, setSelected] = useState(false);
  return (
    <CircleButton circle={circle} isSelected={selected} onClick={() => setSelected((v) => !v)} />
  );
}

describe('CircleButton', () => {
  it('shows neutral surface before click', () => {
    const circle = buildCircle();
    render(<ColoredToggleHarness circle={circle} />);
    const button = screen.getByRole('button', { name: circle.name });
    expect(button.className).toContain('bg-white');
  });

  it('uses inline background color when selected with a circle color', () => {
    const circle = buildCircle();
    render(<ColoredToggleHarness circle={circle} />);
    const button = screen.getByRole('button', { name: circle.name });
    fireEvent.click(button);
    expect(button).toHaveStyle({ backgroundColor: '#e11d48' });
  });

  it('removes inline background when toggled off after selection', () => {
    const circle = buildCircle();
    render(<ColoredToggleHarness circle={circle} />);
    const button = screen.getByRole('button', { name: circle.name });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(button.style.backgroundColor).toBe('');
  });

  it('uses blue filled style when selected without a circle color', () => {
    const circle = buildCircle({ color: null });
    render(<ColoredToggleHarness circle={circle} />);
    const button = screen.getByRole('button', { name: circle.name });
    fireEvent.click(button);
    expect(button.className).toContain('bg-blue-700');
  });
});
