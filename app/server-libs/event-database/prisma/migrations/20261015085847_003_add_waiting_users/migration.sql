/*
  Warnings:

  - Added the required column `waiting_users` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "waiting_users" INTEGER NOT NULL;
