import type { Circle } from '@/lib/circles/types';

type Props = {
  circle: Circle;
  isSelected: boolean;
  onClick: () => void;
};

export function CircleButton({ circle, isSelected, onClick }: Props) {
  const bgColor = isSelected ? circle.color || undefined : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isSelected
          ? bgColor
            ? 'border border-transparent text-white'
            : 'bg-blue-700 border border-transparent text-white'
          : 'bg-white dark:bg-card border border-gray-300 dark:border-border text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-accent'
      }`}
    >
      {circle.name}
    </button>
  );
}
