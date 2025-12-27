import { Card, CardContent } from '@/components/ui/card';

export default function ContactsLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="hover:border-white/30 transition-all">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="h-8 w-48 bg-gray-200 rounded mb-1 animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded mb-4 animate-pulse" />
            </div>
            <div className="flex gap-4 mb-6 text-center">
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <div className="h-3 w-20 bg-gray-200 rounded mx-auto mb-1 animate-pulse" />
                <div className="h-6 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <div className="h-3 w-16 bg-gray-200 rounded mx-auto mb-1 animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 rounded mx-auto animate-pulse" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-9 flex-1 bg-gray-200 rounded animate-pulse" />
              <div className="h-9 flex-1 bg-gray-200 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
