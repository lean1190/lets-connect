import type { VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  crons: [{ path: '/api/cron/import-events', schedule: '0 11 * * 1' }]
};
