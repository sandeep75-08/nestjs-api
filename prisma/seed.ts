import 'dotenv/config';
import { hash } from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const MODULES = ['Users', 'FAQs', 'Modules', 'Roles'];

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  if (!process.env.DATABASE_URL || !process.env.SUPER_ADMIN_PASSWORD)
    throw new Error('Valid environment variables not found');

  // 1. Create or get modules
  const moduleList: number[] = [];

  for (const module of MODULES) {
    const data: { id: number } = await prisma.module.upsert({
      where: { name: module },
      update: {},
      create: {
        name: module,
      },
    });

    moduleList.push(data.id);
  }

  // 2. Create or get Super Admin role
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      roleModules:
        moduleList.length > 0
          ? {
              create: moduleList.map((moduleId) => ({
                moduleId,
              })),
            }
          : undefined,
    },
    include: {
      roleModules: { include: { module: true } },
    },
  });

  const hashedPassword = await hash(process.env.SUPER_ADMIN_PASSWORD);

  // 3. Create Super Admin user
  await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      fullName: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      roleId: superAdminRole.id,
    },
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
