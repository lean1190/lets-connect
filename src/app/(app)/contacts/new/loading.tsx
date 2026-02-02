import { Card, CardContent } from '@/components/ui/card';
import LoadingPageLayout from '../../components/layouts/loading-page-layout';

export default function NewContactLoading() {
  return (
    <LoadingPageLayout title="New contact" showBackButton>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-muted rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-muted rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-muted rounded animate-pulse" />
              <div className="h-24 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-muted rounded animate-pulse" />
              <div className="flex flex-wrap gap-2">
                <div className="h-8 w-20 bg-gray-200 dark:bg-muted rounded-full animate-pulse" />
                <div className="h-8 w-24 bg-gray-200 dark:bg-muted rounded-full animate-pulse" />
                <div className="h-8 w-18 bg-gray-200 dark:bg-muted rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex gap-4 items-center justify-end">
              <div className="h-9 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse" />
              <div className="h-9 w-32 bg-gray-200 dark:bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </LoadingPageLayout>
  );
}
