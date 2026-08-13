import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Document extends Model {
  public id!: string;
  public tenantId!: string;
  public title!: string;
  public status!: 'draft' | 'awaiting_signature' | 'signed';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Document.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: false, field: 'tenant_id' },
    title: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM('draft', 'awaiting_signature', 'signed'),
      defaultValue: 'draft',
      allowNull: false,
    },
  },
  { sequelize, modelName: 'Document', tableName: 'documents' }
);