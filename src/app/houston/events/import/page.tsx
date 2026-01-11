'use client';

import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { fetchEventsFromUrl } from '@/lib/houston/events/actions/fetch';
import { importEvents } from '@/lib/houston/events/actions/import';

const monthMap: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11
};

function parseDateRange(
  dateRange: string,
  baseYear: number = new Date().getFullYear()
): { starts_at: string; ends_at: string } {
  const trimmed = dateRange.trim();
  const parts = trimmed.split(/[–-]/).map((p) => p.trim());
  const startPart = parts[0];
  const endPart = parts[1];

  const startMatch = startPart.match(/^([a-z]+)\s+(\d+)$/i);
  if (!startMatch) {
    throw new Error(`Unable to parse start date: ${dateRange}`);
  }

  const startMonthName = startMatch[1]?.toLowerCase() ?? '';
  const startDay = Number.parseInt(startMatch[2] ?? '0', 10);
  const startMonth = monthMap[startMonthName];

  if (startMonth === undefined) {
    throw new Error(`Unknown month: ${startMonthName}`);
  }

  if (Number.isNaN(startDay) || startDay < 1 || startDay > 31) {
    throw new Error(`Invalid day: ${startDay}`);
  }

  const startDate = new Date(baseYear, startMonth, startDay);
  startDate.setHours(0, 0, 0, 0);

  let endDate: Date;
  if (endPart) {
    const endMatch = endPart.match(/^([a-z]+)\s+(\d+)$/i);
    if (endMatch) {
      const endMonthName = endMatch[1]?.toLowerCase() ?? '';
      const endDay = Number.parseInt(endMatch[2] ?? '0', 10);
      const endMonth = monthMap[endMonthName];

      if (endMonth === undefined) {
        throw new Error(`Unknown month: ${endMonthName}`);
      }

      if (Number.isNaN(endDay) || endDay < 1 || endDay > 31) {
        throw new Error(`Invalid day: ${endDay}`);
      }

      endDate = new Date(baseYear, endMonth, endDay);
    } else {
      const endDay = Number.parseInt(endPart, 10);
      if (Number.isNaN(endDay) || endDay < 1 || endDay > 31) {
        throw new Error(`Invalid end day: ${endPart}`);
      }
      endDate = new Date(baseYear, startMonth, endDay);
    }
    endDate.setHours(23, 59, 59, 999);
  } else {
    endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);
  }

  return {
    starts_at: startDate.toISOString(),
    ends_at: endDate.toISOString()
  };
}

type ParsedEvent = {
  dateRange: string;
  name: string;
  description: string;
  url?: string;
  starts_at: string;
  ends_at: string;
};

export default function ImportEventsPage() {
  const [url, setUrl] = useState('');
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Import Events</h1>
        <a
          href="/houston/events"
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to Events
        </a>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
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
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Base Year
            </label>
            <Input
              id="year"
              type="number"
              value={baseYear}
              onChange={(e) => setBaseYear(Number.parseInt(e.target.value, 10))}
            />
          </div>
          <button
            type="button"
            onClick={handleFetch}
            disabled={fetchStatus === 'executing'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {fetchStatus === 'executing' ? 'Fetching...' : 'Fetch Events'}
          </button>
        </div>
      </div>

      {parsedEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Imported Events ({parsedEvents.length})
            </h2>
            <button
              type="button"
              onClick={handleImport}
              disabled={importStatus === 'executing'}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {importStatus === 'executing' ? 'Importing...' : 'Import to Database'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date Range
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    URL
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
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
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
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
