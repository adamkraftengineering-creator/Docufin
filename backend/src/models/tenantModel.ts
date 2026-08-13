import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Tenant extends Model {
  public id!: string;
  public name!: string;
}

Tenant.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: 'Tenant', tableName: 'tenants' }
);