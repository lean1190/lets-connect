import { Card, CardContent } from '@/components/ui/card';

export default function GroupContactsLoading() {
  return (
    <>
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-muted rounded animate-pulse" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="hover:border-white/30 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 w-32 bg-gray-200 dark:bg-muted rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-muted rounded animate-pulse" />
              </div>
              <div className="h-4 w-full bg-gray-200 dark:bg-muted rounded mb-4 animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-muted rounded mb-4 animate-pulse" />
              <div className="h-9 w-full bg-gray-200 dark:bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
