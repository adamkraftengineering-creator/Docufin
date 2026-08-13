import { DocumentService } from '../services/documentService';
import {
  AuthenticatedRequest,
  DocumentDto,
  DocumentParams,
  DocumentQuery,
  CreateDocumentRequestBody,
  UpdateStatusRequestBody,
  ControllerResult,
} from '../types';

export const getDocumentsController = async (req: AuthenticatedRequest<{}, DocumentDto[], {}, DocumentQuery>): Promise<ControllerResult<DocumentDto[]>> => {

  const tenantId = req.user!.tenantId;
  const searchQuery = req.query.q;
  
  const documents = await DocumentService.getDocuments(tenantId, searchQuery);
  return { status: 200, data: documents };
};

export const createDocumentController = async (req: AuthenticatedRequest<{}, DocumentDto, CreateDocumentRequestBody>): Promise<ControllerResult<DocumentDto>> => {

  const tenantId = req.user!.tenantId;
  const newDoc = await DocumentService.createDocument(tenantId, req.body);
  
  return { status: 201, data: newDoc };
};

export const updateStatusController = async (req: AuthenticatedRequest<DocumentParams, DocumentDto, UpdateStatusRequestBody>): Promise<ControllerResult<DocumentDto>> => {
  
  const tenantId = req.user!.tenantId;
  const documentId = req.params.id;

  const updatedDoc = await DocumentService.updateStatus(tenantId, documentId, req.body);
  return { status: 200, data: updatedDoc };
};