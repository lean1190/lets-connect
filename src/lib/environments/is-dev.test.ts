import { describe, expect, it } from "vitest";
import { getVercelUrl, isDevEnvironment } from "./is-dev";

describe("getVercelUrl", () => {
  it("should return the Vercel URL when VERCEL_URL is defined", () => {
    process.env.VERCEL_URL = "my-app.vercel.app";
    const url = getVercelUrl();
    expect(url).toBe("https://my-app.vercel.app");
  });

  it("should return localhost with the specified PORT when VERCEL_URL is not defined", () => {
    delete process.env.VERCEL_URL;
    process.env.PORT = "4000";
    const url = getVercelUrl();
    expect(url).toBe("http://localhost:4000");
  });

  it("should return localhost with default port 3000 when VERCEL_URL and PORT are not defined", () => {
    delete process.env.VERCEL_URL;
    delete process.env.PORT;
    const url = getVercelUrl();
    expect(url).toBe("http://localhost:3000");
  });
});

describe("isDevEnvironment", () => {
  it('should return false when NEXT_PUBLIC_VERCEL_ENV is "production"', () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
    expect(isDevEnvironment()).toBe(false);
  });

  it('should return true when NEXT_PUBLIC_VERCEL_ENV is "preview"', () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "preview";
    expect(isDevEnvironment()).toBe(true);
  });

  it('should return true when NEXT_PUBLIC_VERCEL_ENV is "development"', () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "development";
    expect(isDevEnvironment()).toBe(true);
  });

  it("should return true when NEXT_PUBLIC_VERCEL_ENV is undefined", () => {
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    expect(isDevEnvironment()).toBe(true);
  });

  it("should return true when NEXT_PUBLIC_VERCEL_ENV is an unexpected value", () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "staging";
    expect(isDevEnvironment()).toBe(true);
  });
});
