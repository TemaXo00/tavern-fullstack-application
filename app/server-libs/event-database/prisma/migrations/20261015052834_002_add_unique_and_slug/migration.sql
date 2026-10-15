/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `event_user_snapshots` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `events` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "event_user_snapshots_nickname_key" ON "event_user_snapshots"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
