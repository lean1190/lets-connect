import { IconStar } from '@tabler/icons-react';
import { getFavorites } from '@/lib/favorites/get';
import PageWithNavigationLayout from '../components/page-with-navigation-layout';
import FavoritesGallery from './favorites-gallery';

export default async function FavoritesPage() {
  const favorites = await getFavorites();
  const isEmpty = favorites.all.length === 0;

  return (
    <PageWithNavigationLayout title="Favorites">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-linear-to-br from-amber-400/20 to-orange-500/20 blur-2xl rounded-full" />
            <IconStar
              className="relative w-20 h-20 text-amber-400"
              stroke={1.5}
              fill="currentColor"
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-2">
            No favorites yet
          </h2>
          <p className="text-gray-600 dark:text-muted-foreground max-w-sm">
            Star your most important contacts and circles to see them here for quick access
          </p>
        </div>
      ) : (
        <FavoritesGallery favorites={favorites} />
      )}
    </PageWithNavigationLayout>
  );
}
