/*
  Warnings:

  - You are about to drop the column `email` on the `event_user_snapshots` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "event_user_snapshots_email_key";

-- AlterTable
ALTER TABLE "event_user_snapshots" DROP COLUMN "email";
