import { Card, CardContent } from '@/components/ui/card';

export default function ContactsLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="hover:border-white/30 transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
