/*
  Warnings:

  - The `source` column on the `Lead` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('Website', 'LinkedIn', 'Referral', 'ColdEmail', 'Event', 'Other');

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "source",
ADD COLUMN     "source" "LeadSource" NOT NULL DEFAULT 'Other';
