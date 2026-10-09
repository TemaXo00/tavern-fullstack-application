/*
  Warnings:

  - You are about to drop the column `currentActivity` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "currentActivity",
ADD COLUMN     "current_activity" "ActivityType" NOT NULL DEFAULT 'ACTIVE';
