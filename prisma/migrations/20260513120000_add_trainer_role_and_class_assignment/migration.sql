-- Add trainer role to the existing RBAC enum.
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'TRAINER';

-- Associate group classes with an optional trainer account.
ALTER TABLE "gym_classes"
ADD COLUMN "trainer_id" TEXT;

CREATE INDEX "gym_classes_trainer_id_idx"
ON "gym_classes"("trainer_id");

ALTER TABLE "gym_classes"
ADD CONSTRAINT "gym_classes_trainer_id_fkey"
FOREIGN KEY ("trainer_id") REFERENCES "users"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
