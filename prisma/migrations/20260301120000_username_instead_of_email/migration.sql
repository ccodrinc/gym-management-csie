-- Add username column as nullable first
ALTER TABLE "users" ADD COLUMN "username" TEXT;

-- Migrate existing rows: admin@reps.gym -> admin, others use prefix of email
UPDATE "users" SET "username" = 'admin' WHERE "email" = 'admin@reps.gym';
UPDATE "users" SET "username" = LOWER(REGEXP_REPLACE(SPLIT_PART("email", '@', 1), '[^a-z0-9_-]', '', 'g'))
WHERE "username" IS NULL AND "email" IS NOT NULL;
UPDATE "users" SET "username" = 'user_' || "id" WHERE "username" IS NULL OR "username" = '';

-- Make username required and unique
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- Drop email columns
ALTER TABLE "users" DROP COLUMN "email";
ALTER TABLE "users" DROP COLUMN "email_verified";
