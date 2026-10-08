/*
  Warnings:

  - The values [FRIENDSHIP] on the enum `Actions` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `message` on the `profile_activities` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Actions_new" AS ENUM ('EVENT', 'REPORT', 'BLOCK', 'EARLY_UNBLOCK');
ALTER TABLE "reputation" ALTER COLUMN "action" TYPE "Actions_new" USING ("action"::text::"Actions_new");
ALTER TYPE "Actions" RENAME TO "Actions_old";
ALTER TYPE "Actions_new" RENAME TO "Actions";
DROP TYPE "public"."Actions_old";
COMMIT;

-- AlterTable
ALTER TABLE "profile_activities" DROP COLUMN "message";
