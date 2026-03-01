-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('Monthly', 'Annual', 'Day_Pass');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "expiryDate" TEXT,
ADD COLUMN     "gymVisits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "membershipType" "MembershipType",
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "startDate" TEXT;

-- CreateTable
CREATE TABLE "visits" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gym_classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "spots" INTEGER NOT NULL,
    "maxSpots" INTEGER NOT NULL,

    CONSTRAINT "gym_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_bookings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "gym_class_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "class_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peak_hour_snapshots" (
    "id" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "check_ins" INTEGER NOT NULL,

    CONSTRAINT "peak_hour_snapshots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_bookings" ADD CONSTRAINT "class_bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_bookings" ADD CONSTRAINT "class_bookings_gym_class_id_fkey" FOREIGN KEY ("gym_class_id") REFERENCES "gym_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
