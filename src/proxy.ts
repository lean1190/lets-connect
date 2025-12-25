import type { NextRequest } from 'next/server';

import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - signin (signin page)
     * - auth callback urls
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images
     */
    '/((?!signin|auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
  missing: [
    { type: 'header', key: 'next-router-prefetch' },
    { type: 'header', key: 'purpose', value: 'prefetch' }
  ]
};
