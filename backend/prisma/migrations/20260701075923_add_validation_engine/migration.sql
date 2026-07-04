-- AlterTable
ALTER TABLE "challenge_tasks" ADD COLUMN     "validationConfig" JSONB,
ADD COLUMN     "validationType" TEXT DEFAULT 'COMMAND';
