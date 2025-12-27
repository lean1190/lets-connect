import AuthGuard from '../components/auth-guard';

export default async function StatsPage() {
  return (
    <AuthGuard>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gym Statistics</h1>
          <p className="text-gray-600">Monthly statistics with signups, and costs</p>
        </div>
      </div>
    </AuthGuard>
  );
}
