// src/api/client.js
export async function api(path, options = {}) {
  const res = await fetch(`/api/v1${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // セッションCookieを送る
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.status === 204 ? null : res.json();
}