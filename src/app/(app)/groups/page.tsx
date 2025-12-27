import * as TablerIcons from '@tabler/icons-react';
import { IconCircles } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CtaButton } from '@/components/ui/cta-button';
import { AppRoute } from '@/lib/constants/navigation';
import { getGroups } from '@/lib/server-actions/groups';

function getIconComponent(iconName: string | null | undefined) {
  if (!iconName) return IconCircles;
  const IconComponent = (
    TablerIcons as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>
  )[iconName];
  return IconComponent || IconCircles;
}

export default async function GroupsPage() {
  const groups = await getGroups();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <IconCircles
          className="w-16 h-16 text-gray-400 dark:text-muted-foreground mb-4"
          stroke={1.5}
        />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-2">
          No groups yet
        </h2>
        <p className="text-gray-600 dark:text-muted-foreground mb-8">
          Create groups to organize your contacts
        </p>
        <Link href={AppRoute.NewGroup}>
          <CtaButton size="sm">New Group</CtaButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Card key={group.id} className="hover:border-white/30 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-16 h-16 bg-gray-100 dark:bg-muted rounded-lg flex items-center justify-center shrink-0 border-2"
                style={{
                  borderColor: group.color || undefined
                }}
              >
                {(() => {
                  const IconComponent = getIconComponent(group.icon);
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
                  {group.name}
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground text-sm mb-4">
                  {group.description || 'No description'}
                </p>
              </div>
            </div>

            <div className="flex gap-4 mb-6 text-center">
              <div className="flex-1 bg-gray-50 dark:bg-muted rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-muted-foreground mb-1">
                  Created on
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-foreground">
                  {formatDate(group.createdAt)}
                </div>
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-muted rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-muted-foreground mb-1">
                  Contacts
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-foreground">
                  {group.contactCount || 0}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href={`${AppRoute.ViewGroup}${group.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Edit
                </Button>
              </Link>
              <Link
                href={`${AppRoute.ViewGroup}${group.id}${AppRoute.Contacts}`}
                className="flex-1"
              >
                <Button className="w-full">View contacts</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
