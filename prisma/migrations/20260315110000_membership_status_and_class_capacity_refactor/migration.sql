-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('DEACTIVATED', 'ACTIVE', 'EXPIRED');

-- AlterTable
ALTER TABLE "users"
ADD COLUMN "membershipStatus" "MembershipStatus" NOT NULL DEFAULT 'DEACTIVATED';

UPDATE "users"
SET "membershipStatus" = CASE
    WHEN "expiryDate" IS NULL OR "membershipType" IS NULL THEN 'DEACTIVATED'::"MembershipStatus"
    WHEN "expiryDate" >= to_char(CURRENT_DATE, 'YYYY-MM-DD') THEN 'ACTIVE'::"MembershipStatus"
    ELSE 'EXPIRED'::"MembershipStatus"
END;

-- AlterTable
ALTER TABLE "gym_classes" DROP COLUMN "spots";

-- CreateIndex
CREATE UNIQUE INDEX "class_bookings_user_id_gym_class_id_date_key"
ON "class_bookings"("user_id", "gym_class_id", "date");

-- CreateIndex
CREATE INDEX "class_bookings_gym_class_id_date_idx"
ON "class_bookings"("gym_class_id", "date");

-- CreateIndex
CREATE INDEX "class_bookings_user_id_date_idx"
ON "class_bookings"("user_id", "date");
