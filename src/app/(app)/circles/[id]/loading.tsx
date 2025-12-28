import { Card, CardContent } from '@/components/ui/card';

export default function EditCircleLoading() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
          </div>
          <div className="flex gap-6 items-center justify-end">
            <div className="h-9 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse" />
            <div className="h-9 w-32 bg-gray-200 dark:bg-muted rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
