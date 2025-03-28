// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/packages',
          '/features',
          '/support',
          '/terms-privacy',
          '/login',
          '/register',
          '/images/',
          '/public/',
        ],
        disallow: [
          '/admin/',
          '/admin-login',
          '/dashboard/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://crispiptv.com/sitemap.xml',
  }
}