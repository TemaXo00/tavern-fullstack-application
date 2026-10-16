/*
  Warnings:

  - Added the required column `email` to the `event_user_snapshots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_user_snapshots" ADD COLUMN     "email" TEXT NOT NULL;
