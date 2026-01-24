'use client';

import { IconStar } from '@tabler/icons-react';
import { useOptimisticAction } from 'next-safe-action/hooks';
import { toggleFavorite } from '@/lib/favorites/actions/toggle';
import { Button } from '../../../components/ui/button';

type Props = {
  id: string;
  type: 'contact' | 'circle';
  initialFavorite: boolean;
};

export function FavoriteButton({ id, type, initialFavorite }: Props) {
  const { execute, optimisticState, isPending } = useOptimisticAction(toggleFavorite, {
    currentState: initialFavorite,
    updateFn: (_state, input) => input.favorite
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    execute({ id, type, favorite: !optimisticState });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      className={`transition-all ${
        optimisticState
          ? 'text-amber-500 hover:text-amber-600'
          : 'text-gray-400 hover:text-amber-500'
      }`}
      aria-label={optimisticState ? 'Remove from favorites' : 'Add to favorites'}
    >
      <IconStar
        className={`w-5 h-5 transition-all ${isPending ? 'animate-pulse' : ''}`}
        fill={optimisticState ? 'currentColor' : 'none'}
        stroke={2}
      />
    </Button>
  );
}
