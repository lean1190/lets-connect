import { IconCircles } from '@tabler/icons-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CtaButton } from '@/components/ui/cta-button';
import { AppRoute } from '@/lib/constants/navigation';
import { getGroups } from '@/lib/server-actions/groups';

export default async function GroupsPage() {
  const groups = await getGroups();

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <IconCircles className="w-16 h-16 text-gray-400 mb-4" stroke={1.5} />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No groups yet</h2>
        <p className="text-gray-600 mb-8">Create groups to organize your contacts</p>
        <Link href={AppRoute.NewGroup}>
          <CtaButton size="sm">New Group</CtaButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {groups.map((group) => (
        <Card key={group.id} className="hover:border-white/30 transition-all">
          <Link href={`${AppRoute.ViewGroup}${group.id}`}>
            <CardContent className="p-6 text-center">
              <IconCircles className="w-12 h-12 text-gray-400 mx-auto mb-3" stroke={1.5} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
              <p className="text-sm text-gray-600">
                {group.contactCount || 0} {group.contactCount === 1 ? 'contact' : 'contacts'}
              </p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
