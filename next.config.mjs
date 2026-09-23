/** @type {import('next').NextConfig} */
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true' && process.env.VERCEL !== '1';
const nextConfig = {
  output: isGitHubPages ? 'export' : undefined,
  trailingSlash: true,
  basePath: isGitHubPages && repository ? `/${repository}` : '',
  assetPrefix: isGitHubPages && repository ? `/${repository}/` : undefined,
  images: { unoptimized: true, remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }] }
};
export default nextConfig;
