-- Phase 4: roles, challenge publishing/soft delete, task validation metadata,
-- and safe conversion of challenges.difficulty from TEXT to PostgreSQL enum.

-- Create enum types defensively so this migration can tolerate partially-applied
-- local databases while still replaying cleanly from the Phase 2 schema.
DO $$
BEGIN
  CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- users.role
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'USER';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'users'
      AND column_name = 'role'
      AND udt_name <> 'Role'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM "users"
      WHERE "role" IS NOT NULL
        AND upper(trim("role"::text)) NOT IN ('USER', 'ADMIN')
    ) THEN
      RAISE EXCEPTION 'Cannot convert users.role to Role enum: unsupported values exist';
    END IF;

    ALTER TABLE "users"
      ALTER COLUMN "role" DROP DEFAULT,
      ALTER COLUMN "role" TYPE "Role"
      USING (
        CASE upper(trim("role"::text))
          WHEN 'ADMIN' THEN 'ADMIN'::"Role"
          ELSE 'USER'::"Role"
        END
      ),
      ALTER COLUMN "role" SET DEFAULT 'USER';
  END IF;
END $$;

UPDATE "users"
SET "role" = 'USER'
WHERE "role" IS NULL;

ALTER TABLE "users"
  ALTER COLUMN "role" SET DEFAULT 'USER',
  ALTER COLUMN "role" SET NOT NULL;

-- challenges publishing and soft-delete fields
ALTER TABLE "challenges"
  ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

UPDATE "challenges"
SET "isPublished" = false
WHERE "isPublished" IS NULL;

ALTER TABLE "challenges"
  ALTER COLUMN "isPublished" SET DEFAULT false,
  ALTER COLUMN "isPublished" SET NOT NULL;

-- Convert challenges.difficulty TEXT values to the Difficulty enum without
-- dropping/recreating the column. Handles Beginner/Intermediate/Advanced and
-- uppercase enum-style values. Unsupported data aborts the migration instead of
-- guessing and losing meaning.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'challenges'
      AND column_name = 'difficulty'
      AND udt_name <> 'Difficulty'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM "challenges"
      WHERE "difficulty" IS NULL
        OR upper(trim("difficulty"::text)) NOT IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')
    ) THEN
      RAISE EXCEPTION 'Cannot convert challenges.difficulty to Difficulty enum: unsupported values exist';
    END IF;

    ALTER TABLE "challenges"
      ALTER COLUMN "difficulty" TYPE "Difficulty"
      USING (
        CASE upper(trim("difficulty"::text))
          WHEN 'BEGINNER' THEN 'BEGINNER'::"Difficulty"
          WHEN 'INTERMEDIATE' THEN 'INTERMEDIATE'::"Difficulty"
          WHEN 'ADVANCED' THEN 'ADVANCED'::"Difficulty"
        END
      );
  END IF;
END $$;

ALTER TABLE "challenges"
  ALTER COLUMN "difficulty" SET NOT NULL;

-- challenge_tasks validation metadata
ALTER TABLE "challenge_tasks"
  ADD COLUMN IF NOT EXISTS "validationRule" TEXT,
  ADD COLUMN IF NOT EXISTS "expectedOutcome" TEXT;

-- New index from the current Prisma schema.
CREATE INDEX IF NOT EXISTS "challenges_isPublished_idx" ON "challenges"("isPublished");
