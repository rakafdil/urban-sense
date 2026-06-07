const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`
    try {
      const error = await res.json()
      message = error.message || message
    } catch {}
    throw new Error(message)
  }

  return res.json()
}