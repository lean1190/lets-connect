import { describe, expect, it } from "vitest";
import { hasId, newId, validateUuid } from "./id";

describe("hasId", () => {
  it("should return true for an object with an id string", () => {
    expect(hasId({ id: "123" })).toBe(true);
  });

  it("should return false for an object without an id", () => {
    expect(hasId({ name: "test" })).toBe(false);
  });

  it("should return false for an object with id as a number", () => {
    expect(hasId({ id: 123 })).toBe(false);
  });

  it("should return false for an object with id as null", () => {
    expect(hasId({ id: null })).toBe(false);
  });

  it("should return false for an object with id as undefined", () => {
    expect(hasId({ id: undefined })).toBe(false);
  });

  it("should return false for an object with id as an object", () => {
    expect(hasId({ id: {} })).toBe(false);
  });

  it("should return false for an object with id as an array", () => {
    expect(hasId({ id: [] })).toBe(false);
  });

  it("should return false for null", () => {
    expect(hasId(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(hasId(undefined)).toBe(false);
  });

  it("should return false for a number", () => {
    expect(hasId(123)).toBe(false);
  });

  it("should return false for a string", () => {
    expect(hasId("string")).toBe(false);
  });

  it("should return false for a boolean", () => {
    expect(hasId(true)).toBe(false);
  });

  it("should return false for an array", () => {
    expect(hasId([])).toBe(false);
  });

  it("should return false for a function", () => {
    expect(hasId(() => {})).toBe(false);
  });

  it("should return true for an object with additional properties and a valid id", () => {
    expect(hasId({ id: "abc", name: "test", age: 30 })).toBe(true);
  });
});

describe("newId", () => {
  it("should generate a valid UUID", () => {
    const id = newId();
    expect(validateUuid(id)).toBe(true);
  });

  it("should generate unique IDs on multiple calls", () => {
    const id1 = newId();
    const id2 = newId();
    expect(id1).not.toBe(id2);
  });

  it("should return a string", () => {
    expect(typeof newId()).toBe("string");
  });
});
