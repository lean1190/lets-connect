import { vi } from 'vitest';

export function createMockActionClient() {
  return {
    schema: vi.fn().mockReturnThis(),
    inputSchema: vi.fn().mockReturnThis(),
    outputSchema: vi.fn().mockReturnThis(),
    action: vi.fn().mockReturnThis()
  };
}

vi.mock('@/lib/server-actions/client', async () => ({
  actionClient: createMockActionClient()
}));
