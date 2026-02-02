'use client';

import { useState } from 'react';
import type { FavoritesData } from '@/lib/favorites/get';
import { FavoriteType } from '@/lib/favorites/types';
import CircleTile from './circle-tile';
import ContactTile from './contact-tile';

type Props = {
  favorites: FavoritesData;
};

type FilterType = 'all' | 'contacts' | 'circles';

export default function FavoritesGallery({ favorites }: Props) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredItems =
    filter === 'all'
      ? favorites.all
      : filter === 'contacts'
        ? favorites.contacts
        : favorites.circles;

  const contactCount = favorites.contacts.length;
  const circleCount = favorites.circles.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/25'
              : 'bg-gray-100 dark:bg-muted text-gray-600 dark:text-muted-foreground hover:bg-gray-200 dark:hover:bg-muted/80'
          }`}
        >
          All Stars ({favorites.all.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('contacts')}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === 'contacts'
              ? 'bg-linear-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25'
              : 'bg-gray-100 dark:bg-muted text-gray-600 dark:text-muted-foreground hover:bg-gray-200 dark:hover:bg-muted/80'
          }`}
        >
          Contacts ({contactCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('circles')}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === 'circles'
              ? 'bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-gray-100 dark:bg-muted text-gray-600 dark:text-muted-foreground hover:bg-gray-200 dark:hover:bg-muted/80'
          }`}
        >
          Circles ({circleCount})
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredItems.map((item) =>
          item.type === FavoriteType.Contact ? (
            <ContactTile key={`contact-${item.id}`} contact={item} />
          ) : (
            <CircleTile key={`circle-${item.id}`} circle={item} />
          )
        )}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-muted-foreground">
          No {filter === 'contacts' ? 'contacts' : filter === 'circles' ? 'circles' : 'items'}{' '}
          starred yet.
        </div>
      )}
    </div>
  );
}
