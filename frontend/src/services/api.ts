import { AuthResponse, Document, DocumentStatus } from '../types';

const API_BASE = 'http://localhost:4000/api';

class ApiError extends Error {

  constructor(public status: number, message: string) {
    super(message);
  }

}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {

  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw new ApiError(401, 'Unauthorized session');

  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'An unexpected error occurred');
  }

  return data as T;
}

export const api = {
  
  login: (credentials: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getDocuments: (searchQuery?: string) => {
    const query = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
    return request<Document[]>(`/documents${query}`);
  },

  updateDocumentStatus: (id: string, status: DocumentStatus) =>
    request<Document>(`/documents/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  createDocument: (title: string) =>
    request<Document>('/documents', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),
};