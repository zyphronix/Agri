const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '';

function getToken() {
  try {
    return localStorage.getItem('token');
  } catch (e) {
    return null;
  }
}

async function apiFetch(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  };

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    const err: any = new Error(data?.message || res.statusText || 'API Error');
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

export const api = {
  get: (path: string) => apiFetch(path, { method: 'GET' }),
  post: (path: string, body?: any) => apiFetch(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: (path: string, body?: any) => apiFetch(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  del: (path: string) => apiFetch(path, { method: 'DELETE' }),
};

export default api;
