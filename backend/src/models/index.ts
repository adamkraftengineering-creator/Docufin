import { Tenant } from './tenantModel';
import { User } from './userModel';
import { Document } from './documentModel';

// Associations — use the JavaScript attribute name 'tenantId'
Tenant.hasMany(User, { foreignKey: 'tenantId', onDelete: 'CASCADE' });
User.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Document, { foreignKey: 'tenantId', onDelete: 'CASCADE' });
Document.belongsTo(Tenant, { foreignKey: 'tenantId' });

export { Tenant, User, Document };