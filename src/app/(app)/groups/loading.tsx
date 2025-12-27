import { Card, CardContent } from '@/components/ui/card';

export default function GroupsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="hover:border-white/30 transition-all">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded mx-auto animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
