export type DocumentStatus = 'draft' | 'awaiting_signature' | 'signed';

export interface User {
  id: string;
  email: string;
  tenantId: string;
}

export interface Document {
  id: string;
  tenant_id: string;
  title: string;
  status: DocumentStatus;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}