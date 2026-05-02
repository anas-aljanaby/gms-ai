const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
    private token: string | null = null;

    setToken(token: string | null) {
        this.token = token;
    }

    private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> ?? {}),
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const res = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers,
            credentials: 'include',
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({ error: res.statusText }));
            throw new Error(body.error || `API error ${res.status}`);
        }

        return res.json();
    }

    get<T>(path: string) {
        return this.request<T>(path);
    }

    post<T>(path: string, body: unknown) {
        return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) });
    }

    patch<T>(path: string, body: unknown) {
        return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
    }

    delete<T>(path: string) {
        return this.request<T>(path, { method: 'DELETE' });
    }
}

export const api = new ApiClient();
