import { Card, CardContent } from '@/components/ui/card';

export default function CirclesLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="hover:border-white/30 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-muted rounded-lg animate-pulse" />
              <div className="flex-1">
                <div className="h-8 w-48 bg-gray-200 dark:bg-muted rounded mb-1 animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-muted rounded mb-4 animate-pulse" />
              </div>
            </div>
            <div className="flex gap-4 mb-6 text-center">
              <div className="flex-1 bg-gray-50 dark:bg-muted rounded-lg p-3 h-18"></div>
              <div className="flex-1 bg-gray-50 dark:bg-muted rounded-lg p-3 h-18"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-9 flex-1 bg-gray-200 dark:bg-muted rounded animate-pulse" />
              <div className="h-9 flex-1 bg-gray-200 dark:bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
