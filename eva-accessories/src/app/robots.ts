import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/account/',
                    '/checkout/',
                    '/order/',
                    '/auth/',
                ],
            },
        ],
        sitemap: `${siteConfig.url}/sitemap.xml`,
    };
}
