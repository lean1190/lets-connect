import { IconCircles } from '@tabler/icons-react';
import Link from 'next/link';
import { CtaButton } from '@/components/ui/cta-button';
import { AppRoute } from '@/lib/constants/navigation';
import { getGroups } from '@/lib/server-actions/groups';
import { GroupsList } from './components/groups-list';

export default async function GroupsPage() {
  const groups = await getGroups();

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

  return <GroupsList groups={groups} />;
}
