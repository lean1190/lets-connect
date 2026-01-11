import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function EventsLoading() {
  return (
    <>
      <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-6 bg-gray-200 dark:bg-muted animate-pulse" />

      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            <div className="h-7 w-32 bg-gray-200 dark:bg-muted rounded animate-pulse" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, cardIndex) => (
                <Card key={cardIndex} className="border-l-4">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-3">
                          <div className="h-6 flex-1 bg-gray-200 dark:bg-muted rounded animate-pulse" />
                          <div className="h-5 w-16 bg-gray-200 dark:bg-muted rounded animate-pulse" />
                        </div>
                        <div className="h-8 w-48 bg-gray-200 dark:bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full bg-gray-200 dark:bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-muted rounded animate-pulse" />
                  </CardContent>
                  <CardFooter>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-muted rounded animate-pulse" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
