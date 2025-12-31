import { vitest } from 'vitest';

export const getWindowMock = () => vitest.spyOn(window, 'window', 'get');
export const removeWindow = () =>
  getWindowMock().mockReturnValue(undefined as unknown as Window & typeof globalThis);
