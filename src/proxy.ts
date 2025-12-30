import type { NextRequest } from 'next/server';

import { updateSession } from '@/lib/database/proxy';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - signin (signin page)
     * - houston (admin panel page)
     * - auth callback urls (oauth process)
     * - terms (terms & conditions page)
     * - privacy (privacy policy page)
     * - manifest (PWA manifest)
     * - sw.js (PWA Service Worker)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (any image)
     */
    '/((?!signin|houston|auth|terms|privacy|manifest|sw.js|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
  missing: [
    { type: 'header', key: 'next-router-prefetch' },
    { type: 'header', key: 'purpose', value: 'prefetch' }
  ]
};
