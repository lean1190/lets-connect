import { describe, expect, test } from "vitest";
import { isValidEmailDomain } from "./email";

describe("isValidEmailDomain", () => {
  const validEmailCases = [
    {
      email: "user@microsoft.com",
      expected: true,
      description: "microsoft.com domain",
    },
    {
      email: "test@apple.com",
      expected: true,
      description: "apple.com domain",
    },
    {
      email: "person@amazon.com",
      expected: true,
      description: "amazon.com domain",
    },
    {
      email: "valid@netflix.com",
      expected: true,
      description: "netflix.com domain",
    },
    {
      email: "real@spotify.com",
      expected: true,
      description: "spotify.com domain",
    },
  ];

  const spamEmailCases = [
    {
      email: "user@10minutemail.com",
      expected: false,
      description: "10minutemail.com spam domain",
    },
    {
      email: "test@tempmail.org",
      expected: false,
      description: "tempmail.org spam domain",
    },
    {
      email: "spam@guerrillamail.com",
      expected: false,
      description: "guerrillamail.com spam domain",
    },
    {
      email: "fake@mailinator.com",
      expected: false,
      description: "mailinator.com spam domain",
    },
    {
      email: "temp@yopmail.com",
      expected: false,
      description: "yopmail.com spam domain",
    },
  ];

  const caseInsensitiveCases = [
    {
      email: "user@TEMPMAIL.ORG",
      expected: false,
      description: "uppercase spam domain",
    },
    {
      email: "test@GuerrillaMail.COM",
      expected: false,
      description: "mixed case spam domain",
    },
    {
      email: "valid@MICROSOFT.COM",
      expected: true,
      description: "uppercase valid domain",
    },
    {
      email: "real@Apple.COM",
      expected: true,
      description: "mixed case valid domain",
    },
  ];

  const invalidFormatCases = [
    { email: "", expected: false, description: "empty string" },
    {
      email: "invalid-email",
      expected: false,
      description: "email without @ symbol",
    },
    {
      email: "@domain.com",
      expected: false,
      description: "email with empty local part",
    },
    { email: "user@", expected: false, description: "email with empty domain" },
    {
      email: "user@@domain.com",
      expected: false,
      description: "email with multiple @ symbols",
    },
    {
      email: "user@domain@com",
      expected: false,
      description: "email with @ in domain",
    },
  ];

  const edgeCases = [
    {
      email: null as unknown as string,
      expected: false,
      description: "null input",
    },
    {
      email: undefined as unknown as string,
      expected: false,
      description: "undefined input",
    },
    {
      email: "user@domain.com",
      expected: true,
      description: "valid domain format",
    },
  ];

  test.each(validEmailCases)(
    "should return $expected for $description",
    ({ email, expected }) => {
      const result = isValidEmailDomain(email);
      expect(result).toBe(expected);
    },
  );

  test.each(spamEmailCases)(
    "should return $expected for $description",
    ({ email, expected }) => {
      const result = isValidEmailDomain(email);
      expect(result).toBe(expected);
    },
  );

  test.each(caseInsensitiveCases)(
    "should return $expected for $description",
    ({ email, expected }) => {
      const result = isValidEmailDomain(email);
      expect(result).toBe(expected);
    },
  );

  test.each(invalidFormatCases)(
    "should return $expected for $description",
    ({ email, expected }) => {
      const result = isValidEmailDomain(email);
      expect(result).toBe(expected);
    },
  );

  test.each(edgeCases)(
    "should return $expected for $description",
    ({ email, expected }) => {
      const result = isValidEmailDomain(email);
      expect(result).toBe(expected);
    },
  );
});
