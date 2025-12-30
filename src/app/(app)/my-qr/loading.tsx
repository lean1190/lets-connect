import { Card } from '@/components/ui/card';

export default function MyQrLoading() {
  return (
    <div className="flex flex-col items-center">
      <Card className="p-6 mb-4">
        <div className="w-[200px] h-[200px] bg-gray-200 dark:bg-muted rounded animate-pulse" />
      </Card>
      <div className="h-4 w-64 bg-gray-200 dark:bg-muted rounded animate-pulse mb-6" />
      <div className="h-4 w-48 bg-gray-200 dark:bg-muted rounded animate-pulse mb-4" />
      <div className="h-9 w-32 bg-gray-200 dark:bg-muted rounded animate-pulse" />
    </div>
  );
}
