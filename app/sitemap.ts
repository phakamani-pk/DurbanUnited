import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://phakamani-pk.github.io/DurbanUnited';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/news', '/match-centre', '/squad', '/gallery', '/club-history', '/shop', '/contact', '/login']
    .map(path => ({ url: `${siteUrl}${path}`, lastModified: new Date('2026-09-23') }));
}
