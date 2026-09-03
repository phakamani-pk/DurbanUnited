import { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { return ['', '/club', '/squad', '/fixtures', '/news', '/shop'].map(path => ({ url: `https://durbanunited.example.com${path}`, lastModified: new Date() })); }
