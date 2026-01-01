import { getMonthlyStats } from '@/lib/houston/stats/actions/monthly-stats';
import AuthGuard from '../components/auth-guard';
import { StatsCharts } from './stats-charts';

type Period = 'this-month' | 'last-3-months' | 'last-6-months' | 'last-12-months';

function getValidPeriod(period: string | undefined): Period {
  const validPeriods: Period[] = ['this-month', 'last-3-months', 'last-6-months', 'last-12-months'];
  return validPeriods.includes(period as Period) ? (period as Period) : 'last-12-months';
}

export default async function StatsPage({
  searchParams
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodParam } = await searchParams;
  const period = getValidPeriod(periodParam);
  const data = await getMonthlyStats(period);

  return (
    <AuthGuard>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Statistics</h1>
          <p className="text-gray-600">Monthly overview of users, contacts, and circles</p>
        </div>
        <StatsCharts data={data} period={period} />
      </div>
    </AuthGuard>
  );
}
