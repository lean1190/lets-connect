'use client';

import * as TablerIcons from '@tabler/icons-react';
import { IconCircles, IconStar, IconUser, IconUsers } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { AppRoute } from '@/lib/constants/navigation';
import type { FavoriteCircle, FavoriteContact, FavoritesData } from '@/lib/favorites/get';

type Props = {
  favorites: FavoritesData;
};

type FilterType = 'all' | 'contacts' | 'circles';

function getIconComponent(iconName: string | null | undefined) {
  if (!iconName) return IconCircles;
  const IconComponent = (
    TablerIcons as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>
  )[iconName];
  return IconComponent || IconCircles;
}

function ContactTile({ contact }: { contact: FavoriteContact }) {
  return (
    <Link
      href={contact.profileLink}
      target="_blank"
      className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 dark:from-violet-500/20 dark:via-purple-500/10 dark:to-fuchsia-500/20 border border-violet-200/50 dark:border-violet-500/20 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/10 hover:border-violet-300 dark:hover:border-violet-500/40"
    >
      <div className="absolute top-3 right-3">
        <IconStar className="w-4 h-4 text-amber-400 fill-amber-400" />
      </div>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/25">
          <IconUser className="w-6 h-6 text-white" stroke={2} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-foreground truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {contact.name}
          </h3>
          {contact.reason && (
            <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1 line-clamp-2">
              {contact.reason}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function CircleTile({ circle }: { circle: FavoriteCircle }) {
  const IconComponent = getIconComponent(circle.icon);

  return (
    <Link
      href={`${AppRoute.EditCircle}${circle.id}${AppRoute.Contacts}`}
      className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-cyan-500/20 border border-emerald-200/50 dark:border-emerald-500/20 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-500/40"
    >
      <div className="absolute top-3 right-3">
        <IconStar className="w-4 h-4 text-amber-400 fill-amber-400" />
      </div>

      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
          style={{
            background: circle.color
              ? `linear-gradient(135deg, ${circle.color}, ${circle.color}dd)`
              : 'linear-gradient(135deg, #10b981, #14b8a6)',
            boxShadow: circle.color ? `0 10px 25px -5px ${circle.color}40` : undefined
          }}
        >
          <IconComponent className="w-6 h-6 text-white" stroke={'2'} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-foreground truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {circle.name}
          </h3>
          {circle.description && (
            <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1 line-clamp-2">
              {circle.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-muted-foreground">
          <IconUsers className="w-4 h-4" />
          <span>{circle.contactCount}</span>
        </div>
      </div>
    </Link>
  );
}

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
          item.type === 'contact' ? (
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
