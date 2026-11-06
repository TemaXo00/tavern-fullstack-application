/*
  Warnings:

  - A unique constraint covering the columns `[profile_id,social_name]` on the table `profile_socials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "profile_socials_profile_id_social_name_key" ON "profile_socials"("profile_id", "social_name");
