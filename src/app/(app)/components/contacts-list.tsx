'use client';

import { IconEdit, IconExternalLink, IconFilter, IconList } from '@tabler/icons-react';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContactCard } from '@/components/contact-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AppRoute } from '@/lib/constants/navigation';
import {
  type DateFilter,
  filterContactsByDate,
  groupContactsByDate
} from '@/lib/contacts/date-grouping';
import type { ContactOutput } from '@/lib/contacts/types';
import { updateSettingsAction } from '@/lib/settings/update/actions/update';
import { ContactsListMode } from '../../../lib/settings/types';

type ContactsListProps = {
  contacts: ContactOutput[];
  showCirclesCount?: boolean;
  initialListMode?: ContactsListMode;
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

export function ContactsList({
  contacts,
  showCirclesCount = true,
  initialListMode = ContactsListMode.Card
}: ContactsListProps) {
  const [filter, setFilter] = useState<DateFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCompactView, setIsCompactView] = useState(initialListMode === ContactsListMode.Compact);
  const { execute: executeUpdateSettings } = useAction(updateSettingsAction);

  useEffect(() => {
    setIsCompactView(initialListMode === ContactsListMode.Compact);
  }, [initialListMode]);

  const handleToggleView = useCallback(() => {
    const newMode = isCompactView ? ContactsListMode.Card : ContactsListMode.Compact;
    setIsCompactView(!isCompactView);
    executeUpdateSettings({ contactsListMode: newMode });
  }, [isCompactView, executeUpdateSettings]);

  const sortedContacts = useMemo(
    () =>
      [...contacts].sort((a, b) => {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }),
    [contacts]
  );

  const dateFilteredContacts = useMemo(
    () => filterContactsByDate(sortedContacts, filter),
    [filter, sortedContacts]
  );
  const filteredContacts = searchContacts(dateFilteredContacts, searchQuery);
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
        <Button
          variant={isCompactView ? 'default' : 'outline'}
          size="icon"
          onClick={handleToggleView}
          aria-label="Toggle compact view"
        >
          <IconList size={20} />
        </Button>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <IconFilter size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => {
                  setFilter('all');
                  setIsPopoverOpen(false);
                }}
                className={`px-4 py-2 text-left text-sm hover:bg-accent ${
                  filter === 'all' ? 'bg-accent font-medium' : ''
                }`}
              >
                All contacts
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilter('today');
                  setIsPopoverOpen(false);
                }}
                className={`px-4 py-2 text-left text-sm hover:bg-accent ${
                  filter === 'today' ? 'bg-accent font-medium' : ''
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilter('last3days');
                  setIsPopoverOpen(false);
                }}
                className={`px-4 py-2 text-left text-sm hover:bg-accent ${
                  filter === 'last3days' ? 'bg-accent font-medium' : ''
                }`}
              >
                Last 3 days
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilter('lastWeek');
                  setIsPopoverOpen(false);
                }}
                className={`px-4 py-2 text-left text-sm hover:bg-accent ${
                  filter === 'lastWeek' ? 'bg-accent font-medium' : ''
                }`}
              >
                Last week
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilter('lastMonth');
                  setIsPopoverOpen(false);
                }}
                className={`px-4 py-2 text-left text-sm hover:bg-accent rounded-b-md ${
                  filter === 'lastMonth' ? 'bg-accent font-medium' : ''
                }`}
              >
                Last month
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {isCompactView ? (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b last:border-b-0 bg-white dark:bg-gray-900/50 hover:bg-accent/50 transition-colors"
                >
                  <td className="px-4 py-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                      {contact.name}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-end">
                      <Link href={`${AppRoute.EditContact}${contact.id}`}>
                        <Button variant="outline" size="icon" aria-label="Edit contact">
                          <IconEdit size={18} />
                        </Button>
                      </Link>
                      <Link href={contact.profileLink} target="_blank" rel="noopener noreferrer">
                        <Button size="icon" aria-label="Go to profile">
                          <IconExternalLink size={18} />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
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
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    showCirclesCount={showCirclesCount}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

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
