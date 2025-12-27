import AuthGuard from './components/auth-guard';

export default async function HoustonPage() {
  return (
    <AuthGuard>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </div>
    </AuthGuard>
  );
}
