'use client';

import { useRouter } from 'next/navigation';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

type Period = 'this-month' | 'last-3-months' | 'last-6-months' | 'last-12-months';

type MonthlyDataPoint = {
  month: string;
  users: number;
  contacts: number;
  circles: number;
};

type Props = {
  data: MonthlyDataPoint[];
  period: Period;
};

const periodOptions: { value: Period; label: string }[] = [
  { value: 'this-month', label: 'This month' },
  { value: 'last-3-months', label: 'Last 3 months' },
  { value: 'last-6-months', label: 'Last 6 months' },
  { value: 'last-12-months', label: 'Last 12 months' }
];

function formatMonthLabel(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year, 10), parseInt(monthNum, 10) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function StatsCharts({ data, period }: Props) {
  const router = useRouter();

  const handlePeriodChange = (newPeriod: Period) => {
    const params = new URLSearchParams();
    params.set('period', newPeriod);
    router.push(`/houston/stats?${params.toString()}`);
  };

  const chartData = data.map((point) => ({
    month: formatMonthLabel(point.month),
    'Signed Up Users': point.users,
    'Contacts Created': point.contacts,
    'Circles Created': point.circles
  }));

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Statistics</h2>
          <div className="flex items-center gap-2">
            <select
              id="period-select"
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value as Period)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Signed Up Users" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="Contacts Created" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="Circles Created" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Signed Up Users" fill="#3b82f6" />
            <Bar dataKey="Contacts Created" fill="#10b981" />
            <Bar dataKey="Circles Created" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
