export type ApiResult<T> = { data: T };
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) }
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error?.message ?? 'The club service is temporarily unavailable.');
  return payload;
}
