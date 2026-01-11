import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating Task table...');

  try {
    // Create the Task table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Task" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "dueDate" TIMESTAMP(3),
        "completed" BOOLEAN NOT NULL DEFAULT false,
        "link" TEXT,
        "applicationId" TEXT,
        "watchlistId" TEXT,
        "contactId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
      )
    `;
    console.log('Task table created.');

    // Add foreign key constraints
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Task" ADD CONSTRAINT "Task_applicationId_fkey"
        FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `;
      console.log('Added applicationId foreign key.');
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        console.log('applicationId foreign key already exists.');
      } else {
        throw e;
      }
    }

    try {
      await prisma.$executeRaw`
        ALTER TABLE "Task" ADD CONSTRAINT "Task_watchlistId_fkey"
        FOREIGN KEY ("watchlistId") REFERENCES "WatchlistCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `;
      console.log('Added watchlistId foreign key.');
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        console.log('watchlistId foreign key already exists.');
      } else {
        throw e;
      }
    }

    try {
      await prisma.$executeRaw`
        ALTER TABLE "Task" ADD CONSTRAINT "Task_contactId_fkey"
        FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `;
      console.log('Added contactId foreign key.');
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        console.log('contactId foreign key already exists.');
      } else {
        throw e;
      }
    }

    console.log('Task table setup complete!');
  } catch (error) {
    console.error('Error creating Task table:', error);
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
