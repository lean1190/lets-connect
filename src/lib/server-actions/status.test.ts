import type { HookActionStatus } from "next-safe-action/hooks";
import { describe, expect, test } from "vitest";
import { isError, isLoading } from "./status";

describe("server action status utilities", () => {
  describe("isLoading", () => {
    test("should return true for executing status", () => {
      expect(isLoading("executing" as HookActionStatus)).toBe(true);
    });

    test("should return false for idle status", () => {
      expect(isLoading("idle" as HookActionStatus)).toBe(false);
    });

    test("should return false for hasSucceeded status", () => {
      expect(isLoading("hasSucceeded" as HookActionStatus)).toBe(false);
    });

    test("should return false for hasErrored status", () => {
      expect(isLoading("hasErrored" as HookActionStatus)).toBe(false);
    });
  });

  describe("isError", () => {
    test("should return true for hasErrored status", () => {
      expect(isError("hasErrored" as HookActionStatus)).toBe(true);
    });

    test("should return false for idle status", () => {
      expect(isError("idle" as HookActionStatus)).toBe(false);
    });

    test("should return false for executing status", () => {
      expect(isError("executing" as HookActionStatus)).toBe(false);
    });

    test("should return false for hasSucceeded status", () => {
      expect(isError("hasSucceeded" as HookActionStatus)).toBe(false);
    });
  });
});
