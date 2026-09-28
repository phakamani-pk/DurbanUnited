const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

try {
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is missing.');
  const parsed = new URL(apiUrl);
  if (parsed.protocol !== 'https:' || parsed.origin !== apiUrl || parsed.username || parsed.password || parsed.hostname === 'localhost' || parsed.hostname.endsWith('.localhost')) {
    throw new Error('NEXT_PUBLIC_API_URL must be a public HTTPS origin without a path, trailing slash, query, fragment, or credentials.');
  }
  console.log(`Using API origin: ${parsed.origin}`);
} catch (error) {
  console.error(`GitHub Pages build blocked: ${error.message}`);
  process.exitCode = 1;
}
