'use client';

import { IconStar } from '@tabler/icons-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { toggleFavorite } from '@/lib/favorites/actions/toggle';
import { Button } from './ui/button';

type Props = {
  id: string;
  type: 'contact' | 'circle';
  initialFavorite: boolean;
};

export function FavoriteButton({ id, type, initialFavorite }: Props) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const { execute, status } = useAction(toggleFavorite, {
    onSuccess: ({ data }) => {
      if (data) {
        setIsFavorite(data.favorite);
      }
    }
  });

  const handleToggle = () => {
    execute({ id, type, favorite: !isFavorite });
  };

  const isLoading = status === 'executing';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isLoading}
      className={`transition-all ${
        isFavorite ? 'text-amber-500 hover:text-amber-600' : 'text-gray-400 hover:text-amber-500'
      }`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <IconStar
        className={`w-5 h-5 transition-all ${isLoading ? 'animate-pulse' : ''}`}
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke={2}
      />
    </Button>
  );
}
