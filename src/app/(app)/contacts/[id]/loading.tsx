import { Card, CardContent } from '@/components/ui/card';

export default function ContactEditLoading() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-muted rounded animate-pulse" />
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
          <div className="flex gap-6 items-center justify-between">
            <div className="h-9 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse" />
            <div className="flex gap-6 items-center">
              <div className="h-9 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse" />
              <div className="h-9 w-32 bg-gray-200 dark:bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
