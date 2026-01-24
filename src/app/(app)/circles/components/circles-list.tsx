'use client';

import * as TablerIcons from '@tabler/icons-react';
import { IconCircles } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';
import { FavoriteButton } from '@/app/(app)/components/favorite-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Circle } from '@/lib/circles/types';
import { AppRoute } from '@/lib/constants/navigation';

type CirclesListProps = {
  circles: Circle[];
};

function getIconComponent(iconName: string | null | undefined) {
  if (!iconName) return IconCircles;
  const IconComponent = (
    TablerIcons as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>
  )[iconName];
  return IconComponent || IconCircles;
}

function searchCircles(circles: Circle[], query: string): Circle[] {
  if (!query.trim()) {
    return circles;
  }

  const lowerQuery = query.toLowerCase().trim();

  return circles.filter((circle) => {
    // Search in name
    if (circle.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in description
    if (circle.description?.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    return false;
  });
}

export function CirclesList({ circles }: CirclesListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  // Apply search filter
  const filteredCircles = searchCircles(circles, searchQuery);

  return (
    <div className="space-y-6">
      {/* Search */}
      <Input
        type="search"
        placeholder="Search circles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />

      {/* Circles list */}
      <div className="space-y-4">
        {filteredCircles.map((circle) => (
          <Card key={circle.id} className="hover:border-white/30 transition-all relative">
            <div className="absolute top-4 right-4">
              <FavoriteButton
                id={circle.id}
                type="circle"
                initialFavorite={circle.favorite ?? false}
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4 pr-10">
                <div
                  className="w-16 h-16 bg-gray-100 dark:bg-muted rounded-lg flex items-center justify-center shrink-0 border-2"
                  style={{
                    borderColor: circle.color || undefined
                  }}
                >
                  {(() => {
                    const IconComponent = getIconComponent(circle.icon);
                    return (
                      <IconComponent
                        className="w-8 h-8 text-gray-400 dark:text-muted-foreground"
                        stroke="1.5"
                      />
                    );
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-normal text-gray-900 dark:text-foreground mb-1">
                    {circle.name}
                  </h3>
                  <p className="text-gray-600 dark:text-muted-foreground text-sm mb-4">
                    {circle.description || 'No description'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mb-6 text-center">
                <div className="flex-1 bg-gray-50 dark:bg-muted rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-muted-foreground mb-1">
                    Created on
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-foreground">
                    {formatDate(circle.createdAt)}
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-muted rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-muted-foreground mb-1">
                    Contacts
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-foreground">
                    {circle.contactCount || 0}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href={`${AppRoute.EditCircle}${circle.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Edit
                  </Button>
                </Link>
                <Link
                  href={`${AppRoute.EditCircle}${circle.id}${AppRoute.Contacts}`}
                  className="flex-1"
                >
                  <Button className="w-full">View contacts</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCircles.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-muted-foreground">
          {searchQuery ? 'No circles found matching your search.' : 'No circles found.'}
        </div>
      )}
    </div>
  );
}
