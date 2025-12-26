import type { HookActionStatus } from 'next-safe-action/hooks';

export function isExecuting(status: HookActionStatus) {
  return status === 'executing';
}

export function isError(status: HookActionStatus) {
  return status === 'hasErrored';
}
