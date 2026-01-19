'use client';

import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchEventsFromUrl } from '@/lib/houston/events/found/actions/fetch';
import {
  dryRunImportEvents,
  type EventDryRunResult,
  type ImportStatus,
  importEvents
} from '@/lib/houston/events/found/actions/import';
import { parseEventDate } from './parse';

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

const statusConfig: Record<ImportStatus, { label: string; className: string }> = {
  import: {
    label: 'Import',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  },
  skip: {
    label: 'Skip',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  },
  invalid: {
    label: 'Invalid',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
};

export function ImportEventsPageClient({ initialUrl }: Props) {
  const [url, setUrl] = useState(initialUrl || '');
  const [parsedEvents, setParsedEvents] = useState<ParsedEvent[]>([]);
  const [baseYear, setBaseYear] = useState(new Date().getFullYear());
  const [dryRunResults, setDryRunResults] = useState<Map<number, EventDryRunResult>>(new Map());

  const { execute: executeDryRun, status: dryRunStatus } = useAction(dryRunImportEvents, {
    onSuccess: ({ data }) => {
      if (data?.results) {
        const resultsMap = new Map(data.results.map((r) => [r.index, r]));
        setDryRunResults(resultsMap);
      }
    }
  });

  const { execute: fetchEvents, status: fetchStatus } = useAction(fetchEventsFromUrl, {
    onSuccess: ({ data }) => {
      if (data?.events) {
        const parsed = data.events.map((event) => {
          try {
            const { starts_at, ends_at } = parseEventDate(event.dateRange, baseYear);
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
        setDryRunResults(new Map());
      }
    }
  });

  const handleDryRun = () => {
    executeDryRun({ events: parsedEvents });
  };

  const { execute: importEventsAction, status: importStatus } = useAction(importEvents, {
    onSuccess: ({ data }) => {
      if (data) {
        alert(`Import completed! Inserted: ${data.inserted}, Skipped: ${data.skipped}`);
        if (data.skippedEvents.length > 0) {
          data.skippedEvents.forEach((skipped) => {
            console.warn(`Skipped: "${skipped.name}" - ${skipped.reason}`);
          });
        }
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
    setParsedEvents((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateDateRange = (index: number, dateRange: string) => {
    try {
      const { starts_at, ends_at } = parseEventDate(dateRange, baseYear);
      setParsedEvents((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          dateRange,
          starts_at,
          ends_at
        };
        return updated;
      });
    } catch (error) {
      console.error('Error parsing date range:', error);
    }
  };

  const importableCount = Array.from(dryRunResults.values()).filter(
    (r) => r.status === 'import'
  ).length;

  const hasDryRunResults = dryRunResults.size > 0;
  const canImport = hasDryRunResults && importableCount > 0;

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
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-foreground">
                Events ({parsedEvents.length})
              </h2>
              {dryRunStatus === 'executing' && (
                <span className="text-sm text-muted-foreground">Checking...</span>
              )}
              {dryRunResults.size > 0 && (
                <span className="text-sm text-muted-foreground">
                  {importableCount} will be imported
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleDryRun}
                disabled={dryRunStatus === 'executing'}
              >
                {dryRunStatus === 'executing' ? 'Checking...' : 'Check Import'}
              </Button>
              <Button
                type="button"
                onClick={handleImport}
                disabled={importStatus === 'executing' || !canImport}
                className="bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600"
              >
                {importStatus === 'executing'
                  ? 'Importing...'
                  : `Import${hasDryRunResults ? ` ${importableCount}` : ''} Events`}
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
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
                {parsedEvents.map((event, index) => {
                  const result = dryRunResults.get(index);
                  const config = result ? statusConfig[result.status] : null;

                  return (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        {config ? (
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium w-fit ${config.className}`}
                            >
                              {config.label}
                            </span>
                            {result?.reason && (
                              <span className="text-xs text-muted-foreground">{result.reason}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {dryRunStatus === 'executing' ? 'Checking...' : 'Pending check'}
                          </span>
                        )}
                      </td>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
