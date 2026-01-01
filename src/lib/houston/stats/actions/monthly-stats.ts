'use server';

import { getAllUsers } from '@/lib/auth/get/users';
import { createPrivilegedClient } from '@/lib/database/client/server';

type Period = 'this-month' | 'last-3-months' | 'last-6-months' | 'last-12-months';

type MonthlyDataPoint = {
  month: string; // Format: "YYYY-MM"
  users: number;
  contacts: number;
  circles: number;
};

function getStartDate(period: Period): Date {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month

  switch (period) {
    case 'this-month':
      return start;
    case 'last-3-months':
      start.setMonth(start.getMonth() - 2); // 3 months including current
      return start;
    case 'last-6-months':
      start.setMonth(start.getMonth() - 5); // 6 months including current
      return start;
    case 'last-12-months':
      start.setMonth(start.getMonth() - 11); // 12 months including current
      return start;
  }
}

function generateMonthKeys(startDate: Date, endDate: Date): string[] {
  const months: string[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    months.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
    current.setMonth(current.getMonth() + 1);
  }

  return months;
}

export async function getMonthlyStats(
  period: Period = 'last-12-months'
): Promise<MonthlyDataPoint[]> {
  const supabase = await createPrivilegedClient();
  const startDate = getStartDate(period);
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // End of current month
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthKeys = generateMonthKeys(startDate, currentMonthStart);

  // Initialize all months with zero counts
  const monthlyData: Map<string, MonthlyDataPoint> = new Map();
  monthKeys.forEach((month) => {
    monthlyData.set(month, {
      month,
      users: 0,
      contacts: 0,
      circles: 0
    });
  });

  // Get users
  const users = await getAllUsers();
  users.forEach((user) => {
    const createdAt = (user as { created_at?: string }).created_at;
    if (createdAt) {
      const userDate = new Date(createdAt);
      if (userDate >= startDate && userDate <= endDate) {
        const monthKey = `${userDate.getFullYear()}-${String(userDate.getMonth() + 1).padStart(2, '0')}`;
        const data = monthlyData.get(monthKey);
        if (data) {
          data.users += 1;
        }
      }
    }
  });

  // Get contacts
  const { data: contacts } = await supabase
    .from('contacts')
    .select('created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  contacts?.forEach((contact) => {
    const contactDate = new Date(contact.created_at);
    const monthKey = `${contactDate.getFullYear()}-${String(contactDate.getMonth() + 1).padStart(2, '0')}`;
    const data = monthlyData.get(monthKey);
    if (data) {
      data.contacts += 1;
    }
  });

  // Get circles
  const { data: circles } = await supabase
    .from('circles')
    .select('created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  circles?.forEach((circle) => {
    const circleDate = new Date(circle.created_at);
    const monthKey = `${circleDate.getFullYear()}-${String(circleDate.getMonth() + 1).padStart(2, '0')}`;
    const data = monthlyData.get(monthKey);
    if (data) {
      data.circles += 1;
    }
  });

  return Array.from(monthlyData.values());
}
