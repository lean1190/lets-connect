import { Card, CardContent } from '@/components/ui/card';
import PageWithBackButtonLayout from '../../components/layouts/page-with-back-button-layout';

export default function EditCircleLoading() {
  return (
    <PageWithBackButtonLayout title="Edit circle">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-muted rounded animate-pulse" />
              <div className="h-9 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse" />
              <div className="h-9 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-16 bg-gray-200 dark:bg-muted rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-12 bg-gray-200 dark:bg-muted rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="h-9 w-24 bg-gray-200 dark:bg-muted rounded animate-pulse" />
              <div className="flex gap-4">
                <div className="h-9 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse" />
                <div className="h-9 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageWithBackButtonLayout>
  );
}
