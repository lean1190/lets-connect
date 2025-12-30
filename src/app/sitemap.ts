import type { MetadataRoute } from 'next';
import { productionUrl } from '@/lib/constants/links';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: productionUrl,
      changeFrequency: 'monthly'
    },
    {
      url: `${productionUrl}/signin`,
      changeFrequency: 'monthly'
    }
  ];
}
