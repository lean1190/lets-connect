import PageWithNavigationLayout from '../components/layouts/page-with-navigation-layout';

export default function FavoritesLoading() {
  return (
    <PageWithNavigationLayout title="Favorites">
      <div className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 bg-gray-200 dark:bg-muted rounded-full animate-pulse shrink-0"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-muted p-5"
            >
              <div className="absolute top-3 right-3">
                <div className="w-4 h-4 bg-gray-200 dark:bg-muted rounded animate-pulse" />
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-muted rounded-xl animate-pulse shrink-0" />

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-5 w-32 bg-gray-200 dark:bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWithNavigationLayout>
  );
}
