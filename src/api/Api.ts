// src/api/Api.ts

export const API_BASE_URL = "http://localhost:8080";

// Api class for making HTTP requests to the backend
export default class Api {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private readCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie
      .split('; ')
      .find((entry) => entry.startsWith(`${name}=`));
    if (!match) return null;
    return match.slice(name.length + 1);
  }

  private getXsrfHeader(): Record<string, string> {
    const rawToken = this.readCookie('XSRF-TOKEN');
    if (!rawToken) return {};
    return {
      'X-XSRF-TOKEN': decodeURIComponent(rawToken),
    };
  }

  // GET request to get CSRF cookie
  async csrfCookie(endpoint: string = '/sanctum/csrf-cookie'): Promise<void> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed: ${response.status}`);
    }
  }

  // GET request
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(options.headers || {}),
      },
    });
    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed: ${response.status}`);
    }
    return response.json();
  }

  // POST request with JSON data
  async post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        ...this.getXsrfHeader(),
        ...(options.headers || {}),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed: ${response.status}`);
    }
    return response.json();
  }

  // POST request with FormData
  async postFormData<T>(endpoint: string, data: FormData, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...this.getXsrfHeader(),
        ...(options.headers || {}),
      },
      body: data,
    });
    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed: ${response.status}`);
    }
    return response.json();
  }

  // DELETE request
  async delete<T = void>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        ...this.getXsrfHeader(),
        ...(options.headers || {}),
      },
    });
    if (!response.ok) {
      throw new Error(`DELETE ${endpoint} failed: ${response.status}`);
    }
    if (response.status === 204) {
      return undefined as T;
    }
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  // PATCH request with JSON data
  async patch<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: 'PATCH',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        ...this.getXsrfHeader(),
        ...(options.headers || {}),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`PATCH ${endpoint} failed: ${response.status}`);
    }
    return response.json();
  }
}

export const apiClient = new Api();
