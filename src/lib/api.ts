export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function requestRaw<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    ...options,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body?.error ?? message;
    } catch {
      // response had no JSON body
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  return requestRaw<T>(path, { headers: { 'Content-Type': 'application/json' }, ...options });
}

export const api = {
  get: <T>(path: string): Promise<T> => request<T>(path),
  post: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string): Promise<T> => request<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, file: File): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);
    return requestRaw<T>(path, { method: 'POST', body: formData });
  },
};
