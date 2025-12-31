'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type StatsChartsProps = {
  stats: {
    usersCount: number;
    contactsCount: number;
    circlesCount: number;
  };
};

export function StatsCharts({ stats }: StatsChartsProps) {
  const chartData = [
    {
      name: 'Signed Up Users',
      value: stats.usersCount
    },
    {
      name: 'Contacts Created',
      value: stats.contactsCount
    },
    {
      name: 'Circles Created',
      value: stats.circlesCount
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Count Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
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
  );
}
