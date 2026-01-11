import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding new columns to Application table...');

  try {
    // Add companyWebsite column
    await prisma.$executeRaw`
      ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "companyWebsite" TEXT
    `;
    console.log('Added companyWebsite column.');

    // Add cvUrl column
    await prisma.$executeRaw`
      ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "cvUrl" TEXT
    `;
    console.log('Added cvUrl column.');

    // Add cvFileName column
    await prisma.$executeRaw`
      ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "cvFileName" TEXT
    `;
    console.log('Added cvFileName column.');

    // Add coverLetterUrl column
    await prisma.$executeRaw`
      ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "coverLetterUrl" TEXT
    `;
    console.log('Added coverLetterUrl column.');

    // Add coverLetterFileName column
    await prisma.$executeRaw`
      ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "coverLetterFileName" TEXT
    `;
    console.log('Added coverLetterFileName column.');

    console.log('All columns added successfully!');
  } catch (error) {
    console.error('Error adding columns:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
