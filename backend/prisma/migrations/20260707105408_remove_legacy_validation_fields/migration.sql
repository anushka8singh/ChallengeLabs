/*
  Warnings:

  - You are about to drop the column `expectedOutcome` on the `challenge_tasks` table. All the data in the column will be lost.
  - You are about to drop the column `validationRule` on the `challenge_tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "challenge_tasks" DROP COLUMN "expectedOutcome",
DROP COLUMN "validationRule";
