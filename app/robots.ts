import type { MetadataRoute } from 'next';

const base = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/wish/demo'],
        // Real surprises are private; keep crawlers out of them and the API.
        disallow: ['/wish/', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
