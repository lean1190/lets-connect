import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Let's connect",
    short_name: 'LetsCo',
    description: 'Fill this',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    icons: [
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
