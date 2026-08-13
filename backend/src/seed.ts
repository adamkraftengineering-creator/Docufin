import bcrypt from 'bcryptjs';
import { sequelize } from './config/database';
import { Tenant, User, Document } from './models';

// This is just a document that I am using to create test data. 

async function seed() {
  try {

    console.log('Connecting and syncing database...');
    await sequelize.sync({ force: true });

    console.log('Creating Tenants...');
    const acme = await Tenant.create({ name: 'Acme Accounting' });
    const beta = await Tenant.create({ name: 'Beta Finance' });

    console.log('Creating Users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    await User.create({
      tenantId: acme.id,
      email: 'test1@offerzen.com',
      passwordHash: hashedPassword,
    });

    await User.create({
      tenantId: beta.id,
      email: 'test2@offerzen.com',
      passwordHash: hashedPassword,
    });

    console.log('Creating Documents...');
    await Document.bulkCreate([
      { tenantId: acme.id, title: '2026 Q1 Tax Return', status: 'signed' },
      { tenantId: acme.id, title: 'Audit Report 2025', status: 'awaiting_signature' },
      { tenantId: acme.id, title: 'Payroll Summary', status: 'draft' },
      { tenantId: beta.id, title: 'Beta Financial Plan', status: 'draft' },
    ]);

    console.log('Database successfully seeded!');
    process.exit(0);

  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();