import { IconUsers } from '@tabler/icons-react';
import Link from 'next/link';
import { CtaButton } from '@/components/ui/cta-button';
import { AppRoute } from '@/lib/constants/navigation';
import { getGroups } from '@/lib/server-actions/groups';
import { DeleteGroupButton } from './delete-group-button';

export default async function GroupsPage() {
  const groups = await getGroups();

  if (groups.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <IconUsers className="w-16 h-16 text-gray-400 mb-4" stroke={1.5} />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No groups yet</h2>
          <p className="text-gray-600 mb-8">Create groups to organize your contacts</p>
          <Link href={AppRoute.NewGroup}>
            <CtaButton size="sm">New Group</CtaButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="relative">
            <Link href={`/groups/${group.id}`}>
              <div className="relative bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl shadow-black/20 overflow-hidden hover:border-white/30 transition-all cursor-pointer">
                {/* Liquid glass shine effect */}
                <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent"></div>

                <div className="relative z-10 p-6 text-center">
                  <IconUsers className="w-12 h-12 text-gray-400 mx-auto mb-3" stroke={1.5} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-sm text-gray-600">
                    {group.contactCount || 0} {group.contactCount === 1 ? 'contact' : 'contacts'}
                  </p>
                </div>
              </div>
            </Link>
            <DeleteGroupButton groupId={group.id} groupName={group.name} />
          </div>
        ))}
      </div>
    </div>
  );
}
