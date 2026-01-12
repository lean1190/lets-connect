import { getEvents } from '@/lib/houston/events/get';
import AuthGuard from '../components/auth-guard';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <AuthGuard>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Events</h1>

        {events.length === 0 ? (
          <div className="bg-card rounded-lg shadow border border-border p-8 text-center">
            <p className="text-muted-foreground">No events found. Import events to get started.</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-16rem)]">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {event.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(event.starts_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(event.ends_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {event.url}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-md truncate">
                        {event.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
