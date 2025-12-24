'use server';

import type { NullableSession, NullableUser } from '@/lib/auth/session/types';

import { linkedInHeaders } from '../headers';
import { extractLinkedInAccessToken, extractLinkedInProfileImage } from './extract';
import type { Me } from './types';

export async function getLinkedInMe(session: NullableSession) {
  const token = extractLinkedInAccessToken(session);

  const response = await fetch('https://api.linkedin.com/v2/me', {
    method: 'GET',
    cache: 'force-cache',
    next: { revalidate: 360000 },
    headers: linkedInHeaders(token ?? ''),
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`LinkedIn API error: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as Me;
}

export async function getLinkedInBasicProfile(session: NullableSession, user: NullableUser) {
  try {
    // Cache this and revalidate after login only, it fails a lot
    const me = await getLinkedInMe(session);

    return {
      name: `${me.localizedFirstName} ${me.localizedLastName}`,
      headline: me.localizedHeadline,
      image: await extractLinkedInProfileImage(user)
    };
  } catch (error: unknown) {
    console.warn('Me call failed', (error as Error).message);

    return {
      name: 'John Doe',
      headline: 'This is an example headline',
      image: '/favicon.ico'
    };
  }
}
