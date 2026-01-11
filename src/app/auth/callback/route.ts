import { NextResponse } from 'next/server';
import { AppRoute } from '@/lib/constants/navigation';
import { createDatabaseServerClient } from '@/lib/database/client/server';
import { updateProfilePictureUrl } from '@/lib/settings/update/update';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? AppRoute.Contacts;
  if (!next.startsWith(AppRoute.Root)) {
    // if "next" is not a relative URL, use the default
    next = AppRoute.Root;
  }

  if (code) {
    const supabase = await createDatabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      updateProfilePictureUrl();

      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      }

      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
