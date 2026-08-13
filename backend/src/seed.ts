import bcrypt from 'bcryptjs';
import { sequelize } from './config/database';
import { Tenant, User, Document } from './models';

async function seed() {
  try {
    console.log('Connecting and syncing database...');
    

    await sequelize.authenticate();

    await sequelize.sync({ force: true });

    console.log('Creating Tenants...');
    const offerzen = await Tenant.create({ name: 'Offerzen Accounting' });
    const adamFinance = await Tenant.create({ name: 'Adam Finance' });

    console.log('Creating Users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    await User.create({
      tenantId: offerzen.id,
      email: 'test1@offerzen.com',
      passwordHash: hashedPassword,
    });

    await User.create({
      tenantId: adamFinance.id,
      email: 'test2@offerzen.com',
      passwordHash: hashedPassword,
    });

    console.log('Creating Documents...');
    await Document.bulkCreate([
      { tenantId: offerzen.id, title: '2026 Q1 Tax Return', status: 'signed' },
      { tenantId: offerzen.id, title: 'Audit Report 2025', status: 'awaiting_signature' },
      { tenantId: offerzen.id, title: 'Payroll Summary', status: 'draft' },
      { tenantId: adamFinance.id, title: 'Beta Financial Plan', status: 'draft' },
    ]);

    console.log('Database successfully seeded!');
    process.exit(0);

  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();