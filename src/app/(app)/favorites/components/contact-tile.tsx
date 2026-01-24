import { IconUser } from '@tabler/icons-react';
import Link from 'next/link';
import type { FavoriteContact } from '@/lib/favorites/get';
import { FavoriteButton } from '../../components/favorite-button';

export default function ContactTile({ contact }: { contact: FavoriteContact }) {
  return (
    <Link
      href={contact.url ?? ''}
      target="_blank"
      className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 dark:from-violet-500/20 dark:via-purple-500/10 dark:to-fuchsia-500/20 border border-violet-200/50 dark:border-violet-500/20 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/10 hover:border-violet-300 dark:hover:border-violet-500/40"
    >
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton id={contact.id} type="contact" initialFavorite={contact.favorite} />
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
