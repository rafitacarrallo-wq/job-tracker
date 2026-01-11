-- Create Task table
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "Task" ADD CONSTRAINT "Task_applicationId_fkey"
    FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Task" ADD CONSTRAINT "Task_watchlistId_fkey"
    FOREIGN KEY ("watchlistId") REFERENCES "WatchlistCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Task" ADD CONSTRAINT "Task_contactId_fkey"
    FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Update Application table to add new columns (if they don't exist)
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "companyWebsite" TEXT;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "cvUrl" TEXT;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "cvFileName" TEXT;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "coverLetterUrl" TEXT;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "coverLetterFileName" TEXT;

-- Drop old columns if they exist (optional - uncomment if you want to clean up)
-- ALTER TABLE "Application" DROP COLUMN IF EXISTS "cvVersion";
-- ALTER TABLE "Application" DROP COLUMN IF EXISTS "coverLetter";
-- ALTER TABLE "Application" DROP COLUMN IF EXISTS "companyDomain";
