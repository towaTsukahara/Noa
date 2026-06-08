// src/api/client.js
export async function api(path, options = {}) {
  const res = await fetch(`/api/v1${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API Error Response:", text);
    throw new Error(`API error: ${res.status}`);
  }

  return res.status === 204 ? null : res.json();
}