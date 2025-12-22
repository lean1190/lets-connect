import { describe, expect, test } from "vitest";
import { isServer } from "./server";

describe("isServer", () => {
  test("should return false when window is defined", () => {
    // In vitest/jsdom environment, window is defined
    expect(isServer()).toBe(false);
  });

  test("should return true when window is undefined", () => {
    // Mock window as undefined
    const originalWindow = global.window;
    // @ts-expect-error - temporarily delete window
    delete global.window;

    expect(isServer()).toBe(true);

    // Restore window
    global.window = originalWindow;
  });
});
