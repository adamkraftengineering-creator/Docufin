import { Tenant } from './tenantModel';
import { User } from './userModel';
import { Document } from './documentModel';

// Associations
Tenant.hasMany(User, { foreignKey: 'tenant_id' });
User.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(Document, { foreignKey: 'tenant_id' });
Document.belongsTo(Tenant, { foreignKey: 'tenant_id' });

export { Tenant, User, Document };