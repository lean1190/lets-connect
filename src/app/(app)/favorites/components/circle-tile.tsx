import { IconStar, IconUsers } from '@tabler/icons-react';
import Link from 'next/link';
import { AppRoute } from '@/lib/constants/navigation';
import type { FavoriteCircle } from '@/lib/favorites/get';
import { getIconComponent } from '../icons';

export default function CircleTile({ circle }: { circle: FavoriteCircle }) {
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
