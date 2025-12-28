'use client';

import { useState } from 'react';
import { ContactCard } from '@/components/contact-card';
import { Input } from '@/components/ui/input';
import {
  type DateFilter,
  filterContactsByDate,
  groupContactsByDate
} from '@/lib/contacts/date-grouping';
import type { ContactOutput } from '@/lib/contacts/types';

type ContactsListProps = {
  contacts: ContactOutput[];
};

function searchContacts(contacts: ContactOutput[], query: string): ContactOutput[] {
  if (!query.trim()) {
    return contacts;
  }

  const lowerQuery = query.toLowerCase().trim();

  return contacts.filter((contact) => {
    // Search in name
    if (contact.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in reason
    if (contact.reason.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in circle names
    if (contact.circles?.some((circle) => circle.name.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    return false;
  });
}

export function ContactsList({ contacts }: ContactsListProps) {
  const [filter, setFilter] = useState<DateFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sort contacts by date (newest first) - already sorted from server, but ensure it
  const sortedContacts = [...contacts].sort((a, b) => {
    return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
  });

  // Filter contacts based on selected date filter
  const dateFilteredContacts = filterContactsByDate(sortedContacts, filter);

  // Apply search filter to date-filtered contacts
  const filteredContacts = searchContacts(dateFilteredContacts, searchQuery);

  // Group filtered contacts by date ranges
  const groupedContacts = groupContactsByDate(filteredContacts);

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex gap-3">
        <Input
          type="search"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as DateFilter)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring dark:bg-input/30 dark:border-input"
        >
          <option value="all">All contacts</option>
          <option value="today">Today</option>
          <option value="last3days">Last 3 days</option>
          <option value="lastWeek">Last week</option>
          <option value="lastMonth">Last month</option>
        </select>
      </div>

      {/* Grouped contacts with separators */}
      <div className="space-y-6">
        {groupedContacts.map((group) => (
          <div key={group.label} className="space-y-4">
            {/* Date separator */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200 dark:bg-border" />
              <h2 className="text-sm font-medium text-gray-500 dark:text-muted-foreground">
                {group.label}
              </h2>
              <div className="h-px flex-1 bg-gray-200 dark:bg-border" />
            </div>

            {/* Contacts in this group */}
            <div className="space-y-4">
              {group.contacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-muted-foreground">
          {searchQuery
            ? 'No contacts found matching your search.'
            : 'No contacts found for the selected filter.'}
        </div>
      )}
    </div>
  );
}
