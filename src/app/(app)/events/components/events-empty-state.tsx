import { IconCalendar } from '@tabler/icons-react';
import { Card, CardContent } from '@/components/ui/card';

export function EventsEmptyState() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <IconCalendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No events available</p>
        </div>
      </CardContent>
    </Card>
  );
}
