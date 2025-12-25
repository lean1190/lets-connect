'use server';

import type { OAuthResponse } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { getAppBaseUrl } from '../environments/url';
import { getSupabaseClient } from '../supabase/isomorphic';

export async function signInWithLinkedIn() {
  const url = getAppBaseUrl();
  const authCallbackUrl = `${url}/auth/callback`;
  const oAuthResponse = await (await getSupabaseClient()).auth.signInWithOAuth({
    provider: 'linkedin_oidc',
    options: {
      scopes: 'openid profile email',
      redirectTo: authCallbackUrl
    }
  });

  redirectToLinkedInSigninPage(oAuthResponse);
}

function redirectToLinkedInSigninPage({ data }: OAuthResponse) {
  if (data.url) {
    redirect(data.url);
  }
}
