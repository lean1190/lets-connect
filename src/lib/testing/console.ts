import { vi } from 'vitest';

export const getConsoleErrorMock = () => vi.spyOn(console, 'error');
export const replaceConsoleError = () => getConsoleErrorMock().mockImplementation(() => {});
