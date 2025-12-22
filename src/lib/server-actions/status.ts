import type { HookActionStatus } from "next-safe-action/hooks";

export function isLoading(status: HookActionStatus) {
  return status === "executing";
}

export function isError(status: HookActionStatus) {
  return status === "hasErrored";
}
