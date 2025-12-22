import type { PostgrestError } from "@supabase/supabase-js";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { handleDatabaseResponse, hasFirstElement } from "./response-handler";

describe("Supabase response handler utilities", () => {
  let mockConsoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("handleDatabaseResponse", () => {
    test("should return data when no error", () => {
      const testData = { id: 1, name: "Test" };
      const result = handleDatabaseResponse({
        data: testData,
        error: null,
      });

      expect(result).toEqual(testData);
      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    test("should throw error and log when error exists", () => {
      const testError: PostgrestError = {
        message: "Database error",
        details: "Some details",
        hint: "Some hint",
        code: "23505",
        name: "",
      };

      expect(() => {
        handleDatabaseResponse({
          data: null,
          error: testError,
        });
      }).toThrow("Database error");

      expect(mockConsoleError).toHaveBeenCalledWith(
        "---> ERROR:Database",
        testError,
      );
    });

    test("should handle different data types", () => {
      const arrayData = [1, 2, 3];
      const result1 = handleDatabaseResponse({
        data: arrayData,
        error: null,
      });
      expect(result1).toEqual(arrayData);

      const stringData = "test string";
      const result2 = handleDatabaseResponse({
        data: stringData,
        error: null,
      });
      expect(result2).toBe(stringData);

      const numberData = 42;
      const result3 = handleDatabaseResponse({
        data: numberData,
        error: null,
      });
      expect(result3).toBe(numberData);
    });
  });

  describe("hasFirstElement", () => {
    test("should return true for non-empty array", () => {
      expect(hasFirstElement([1, 2, 3])).toBe(true);
      expect(hasFirstElement(["a"])).toBe(true);
      expect(hasFirstElement([{ id: 1 }])).toBe(true);
    });

    test("should return false for empty array", () => {
      expect(hasFirstElement([])).toBe(false);
    });

    test("should return false for null", () => {
      expect(hasFirstElement(null)).toBe(false);
    });

    test("should return false for undefined", () => {
      expect(hasFirstElement(undefined)).toBe(false);
    });

    test("should return false for non-array values", () => {
      expect(hasFirstElement("string")).toBe(false);
      expect(hasFirstElement(42)).toBe(false);
      expect(hasFirstElement({})).toBe(false);
      expect(hasFirstElement(true)).toBe(false);
    });

    test("should return false for array with null/undefined first element", () => {
      expect(hasFirstElement([null])).toBe(false);
      expect(hasFirstElement([undefined])).toBe(false);
      expect(hasFirstElement([null, "second"])).toBe(false);
    });

    test("should return true for array with falsy but valid first element", () => {
      expect(hasFirstElement([0])).toBe(true);
      expect(hasFirstElement([""])).toBe(true);
      expect(hasFirstElement([false])).toBe(true);
    });
  });
});
