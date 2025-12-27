import { spamEmailDomains } from '../constants/spam-domains';

/**
 * Validates that an email domain is not in the spam domains list
 * @param email - The email address to validate
 * @returns true if the email domain is valid (not spam), false otherwise
 */
export function isValidEmailDomain(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;

  // Check if local part is empty or domain is empty
  if (!localPart || !domain || localPart.length === 0 || domain.length === 0) {
    return false;
  }

  return !spamEmailDomains.includes(domain.toLowerCase() as (typeof spamEmailDomains)[number]);
}
