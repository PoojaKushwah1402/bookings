const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const request = async <T>(
  path: string,
  method: Method,
  body?: unknown,
  token?: string,
): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
};

export const httpClient = {
  get: <T>(path: string, token?: string) => request<T>(path, 'GET', undefined, token),
  post: <T>(path: string, payload: unknown, token?: string) => request<T>(path, 'POST', payload, token),
  patch: <T>(path: string, payload: unknown, token?: string) => request<T>(path, 'PATCH', payload, token),
  delete: <T>(path: string, token?: string) => request<T>(path, 'DELETE', undefined, token),
};

export type HttpClient = typeof httpClient;


