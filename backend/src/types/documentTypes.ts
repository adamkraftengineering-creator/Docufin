export interface DocumentDto {
  id: string;
  tenant_id: string;
  title: string;
  status: 'draft' | 'awaiting_signature' | 'signed';
  created_at: Date;
  updated_at: Date;
}

export interface CreateDocumentRequestBody {
  title?: string;
}

export interface UpdateStatusRequestBody {
  status?: 'draft' | 'awaiting_signature' | 'signed';
}

export interface DocumentParams {
  id: string;
}

export interface DocumentQuery {
  q?: string;
}