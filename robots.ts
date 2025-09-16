// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'http://localhost:9002'

  const isStaging = baseUrl.includes('staging')

  if (isStaging) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/', // block everything
        },
      ],
      sitemap: null, 
    }
  }

  // ✅ Production rules
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/admin/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
