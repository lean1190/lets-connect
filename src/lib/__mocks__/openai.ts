import { vi } from 'vitest';

vi.mock('@/lib/ai/client', () => ({
  openai: {
    chat: {
      completions: {
        create: vi.fn()
      }
    }
  }
}));
