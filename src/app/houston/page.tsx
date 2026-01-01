import { getStats } from '@/lib/houston/stats/actions/stats';
import AuthGuard from './components/auth-guard';

export default async function HoustonPage() {
  const stats = await getStats();

  return (
    <AuthGuard>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Signed Up Users</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.usersCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Contacts Created</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.contactsCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Circles Created</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.circlesCount}</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
