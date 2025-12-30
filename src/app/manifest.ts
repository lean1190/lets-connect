import type { MetadataRoute } from 'next';
import { AppRoute } from '@/lib/constants/navigation';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Let's Connect",
    short_name: 'LetsConnect',
    description: 'A simple and effective way to stay in touch with your entrepreneurial circle',
    start_url: AppRoute.Contacts,
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#0e0f13',
    background_color: '#0e0f13',
    scope: '/',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}
