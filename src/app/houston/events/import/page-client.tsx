'use client';

import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseDateRange } from '@/lib/dates/parse';
import { fetchEventsFromUrl } from '@/lib/houston/events/found/actions/fetch';
import { importEvents } from '@/lib/houston/events/found/actions/import';

type ParsedEvent = {
  dateRange: string;
  name: string;
  description: string;
  url?: string;
  starts_at: string;
  ends_at: string;
};

type Props = {
  initialUrl: string | null;
};

export function ImportEventsPageClient({ initialUrl }: Props) {
  const [url, setUrl] = useState(initialUrl || '');
  const [parsedEvents, setParsedEvents] = useState<ParsedEvent[]>([]);
  const [baseYear, setBaseYear] = useState(new Date().getFullYear());

  const { execute: fetchEvents, status: fetchStatus } = useAction(fetchEventsFromUrl, {
    onSuccess: ({ data }) => {
      if (data?.events) {
        const parsed = data.events.map((event) => {
          try {
            const { starts_at, ends_at } = parseDateRange(event.dateRange, baseYear);
            return {
              ...event,
              starts_at,
              ends_at
            };
          } catch (error) {
            console.error(`Error parsing date for ${event.name}:`, error);
            const fallbackDate = new Date(baseYear, 0, 1).toISOString();
            return {
              ...event,
              starts_at: fallbackDate,
              ends_at: fallbackDate
            };
          }
        });
        setParsedEvents(parsed);
      }
    }
  });

  const { execute: importEventsAction, status: importStatus } = useAction(importEvents, {
    onSuccess: ({ data }) => {
      if (data) {
        alert(`Import completed! Inserted: ${data.inserted}, Skipped: ${data.skipped}`);
        if (data.errors.length > 0) {
          console.error('Import errors:', data.errors);
        }
        setParsedEvents([]);
        setUrl('');
      }
    }
  });

  const handleFetch = () => {
    if (!url) {
      alert('Please enter a URL');
      return;
    }
    fetchEvents({ url });
  };

  const handleImport = () => {
    if (parsedEvents.length === 0) {
      alert('No events to import');
      return;
    }
    importEventsAction({ events: parsedEvents });
  };

  const updateEvent = (index: number, field: keyof ParsedEvent, value: string) => {
    const updated = [...parsedEvents];
    updated[index] = { ...updated[index], [field]: value };
    setParsedEvents(updated);
  };

  const updateDateRange = (index: number, dateRange: string) => {
    try {
      const { starts_at, ends_at } = parseDateRange(dateRange, baseYear);
      const updated = [...parsedEvents];
      updated[index] = {
        ...updated[index],
        dateRange,
        starts_at,
        ends_at
      };
      setParsedEvents(updated);
    } catch (error) {
      console.error('Error parsing date range:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Import Events</h1>

      <div className="bg-card rounded-lg shadow border border-border p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
              Newsletter URL
            </label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.foundhamburg.com/p/..."
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-foreground mb-2">
              Base Year
            </label>
            <Input
              id="year"
              type="number"
              value={baseYear}
              onChange={(e) => setBaseYear(Number.parseInt(e.target.value, 10))}
            />
          </div>
          <Button type="button" onClick={handleFetch} disabled={fetchStatus === 'executing'}>
            {fetchStatus === 'executing' ? 'Fetching...' : 'Fetch Events'}
          </Button>
        </div>
      </div>

      {parsedEvents.length > 0 && (
        <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">
              Imported Events ({parsedEvents.length})
            </h2>
            <Button
              type="button"
              onClick={handleImport}
              disabled={importStatus === 'executing'}
              className="bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600"
            >
              {importStatus === 'executing' ? 'Importing...' : 'Import to Database'}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Date Range
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    URL
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {parsedEvents.map((event, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <Input
                        type="text"
                        value={event.dateRange}
                        onChange={(e) => updateDateRange(index, e.target.value)}
                        className="text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="text"
                        value={event.name}
                        onChange={(e) => updateEvent(index, 'name', e.target.value)}
                        className="text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <textarea
                        value={event.description}
                        onChange={(e) => updateEvent(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-input rounded text-sm bg-background text-foreground"
                        rows={2}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="url"
                        value={event.url || ''}
                        onChange={(e) => updateEvent(index, 'url', e.target.value)}
                        placeholder="https://..."
                        className="text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
