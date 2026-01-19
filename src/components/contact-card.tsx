import { format } from 'date-fns';
import Link from 'next/link';
import { FavoriteButton } from '@/components/favorite-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppRoute } from '@/lib/constants/navigation';
import type { ContactOutput } from '@/lib/contacts/types';

type ContactCardProps = {
  contact: ContactOutput;
  showCirclesCount?: boolean;
};

export function ContactCard({ contact, showCirclesCount = true }: ContactCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <Card className="hover:border-white/30 transition-all relative">
      <div className="absolute top-4 right-4">
        <FavoriteButton id={contact.id} type="contact" initialFavorite={contact.favorite} />
      </div>
      <CardContent className="p-6">
        <div className="mb-4 pr-10">
          <h3 className="text-2xl font-normal text-gray-900 dark:text-foreground mb-1">
            {contact.name}
          </h3>
          <p className="text-gray-600 dark:text-muted-foreground text-sm mb-4">{contact.reason}</p>
        </div>

        <div className="flex gap-4 mb-6 text-center">
          <div className="flex-1 bg-gray-50 dark:bg-muted rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-muted-foreground mb-1">
              Connected on
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-foreground">
              {formatDate(contact.dateAdded)}
            </div>
          </div>
          {showCirclesCount && (
            <div className="flex-1 bg-gray-50 dark:bg-muted rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-muted-foreground mb-1">Circles</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-foreground">
                In {contact.circles?.length || 0}{' '}
                {contact.circles?.length === 1 ? 'circle' : 'circles'}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link href={`${AppRoute.EditContact}${contact.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Edit
            </Button>
          </Link>
          <Link
            href={contact.profileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button className="w-full">Go to profile</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
