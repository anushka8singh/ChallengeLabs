/*
  Warnings:

  - You are about to drop the column `validationConfig` on the `challenge_tasks` table. All the data in the column will be lost.
  - You are about to drop the column `validationType` on the `challenge_tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "challenge_tasks" DROP COLUMN "validationConfig",
DROP COLUMN "validationType";

-- AlterTable
ALTER TABLE "task_validations" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isRequired" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1;
