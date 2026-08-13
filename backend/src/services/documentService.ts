import { Op } from 'sequelize';
import { Document } from '../models';
import {
  DocumentDto,
  CreateDocumentRequestBody,
  UpdateStatusRequestBody,
} from '../types';

export class DocumentService {

  private static formatDto(doc: Document): DocumentDto {

    return {
      id: doc.id,
      tenant_id: doc.tenantId,
      title: doc.title,
      status: doc.status,
      created_at: doc.createdAt,
      updated_at: doc.updatedAt,
    };
  }

  static async getDocuments(tenantId: string, searchQuery?: string): Promise<DocumentDto[]> {

    const whereCondition: any = { tenantId };

    if (searchQuery && searchQuery.trim().length > 0) {
      whereCondition.title = { [Op.iLike]: `%${searchQuery.trim()}%` };
    }

    const docs = await Document.findAll({
      where: whereCondition,
      order: [['updatedAt', 'DESC']],
    });

    return docs.map(this.formatDto);
  }

  static async createDocument(tenantId: string, body: CreateDocumentRequestBody): Promise<DocumentDto> {

    if (!body.title || !body.title.trim()) {
      throw new Error('Document title is required');
    }

    const doc = await Document.create({
      tenantId,
      title: body.title.trim(),
      status: 'draft',
    });

    return this.formatDto(doc);
  }

  static async updateStatus(

    tenantId: string,
    documentId: string,
    body: UpdateStatusRequestBody

  ): Promise<DocumentDto> {

    const validStatuses = ['draft', 'awaiting_signature', 'signed'];
    
    if (!body.status || !validStatuses.includes(body.status)) {
      throw new Error('Invalid or missing document status');
    }

    const doc = await Document.findOne({
      where: { id: documentId, tenantId },
    });

    if (!doc) {
      throw new Error('Document not found or unauthorized');
    }

    doc.status = body.status;
    await doc.save();

    return this.formatDto(doc);
  }
}