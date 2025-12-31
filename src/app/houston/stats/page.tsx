import { getStats } from '@/lib/houston/stats/actions/stats';
import AuthGuard from '../components/auth-guard';
import { StatsCharts } from './stats-charts';

export default async function StatsPage() {
  const stats = await getStats();

  return (
    <AuthGuard>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Statistics</h1>
          <p className="text-gray-600">Overview of users, contacts, and circles</p>
        </div>
        <StatsCharts stats={stats} />
      </div>
    </AuthGuard>
  );
}
