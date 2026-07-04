-- CreateEnum
CREATE TYPE "ValidationType" AS ENUM ('COMMAND', 'DIRECTORY_EXISTS', 'FILE_EXISTS', 'FILE_CONTAINS', 'COMMAND_OUTPUT', 'REGEX', 'PERMISSION', 'USER_EXISTS', 'PROCESS_RUNNING', 'CUSTOM_SCRIPT');

-- CreateTable
CREATE TABLE "task_validations" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "type" "ValidationType" NOT NULL,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_validations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "task_validations_taskId_idx" ON "task_validations"("taskId");

-- CreateIndex
CREATE INDEX "task_validations_type_idx" ON "task_validations"("type");

-- AddForeignKey
ALTER TABLE "task_validations" ADD CONSTRAINT "task_validations_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "challenge_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
