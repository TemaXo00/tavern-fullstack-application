/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `event_user_snapshots` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "event_user_snapshots_email_key" ON "event_user_snapshots"("email");
