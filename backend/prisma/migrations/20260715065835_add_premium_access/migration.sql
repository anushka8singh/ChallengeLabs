-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hasPremiumAccess" BOOLEAN NOT NULL DEFAULT false;
