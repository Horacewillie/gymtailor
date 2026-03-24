// src/api/Api.ts

export default class Api {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8080') {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed: ${response.status}`);
    }
    return response.json();
  }

  async postFormData<T>(endpoint: string, data: FormData, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: {
        ...(options.headers || {}),
      },
      body: data,
    });
    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed: ${response.status}`);
    }
    return response.json();
  }

  async delete<T = void>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
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
}
