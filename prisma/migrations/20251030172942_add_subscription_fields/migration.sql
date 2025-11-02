/*
  Warnings:

  - A unique constraint covering the columns `[stripeSubId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeSubId" TEXT,
ADD COLUMN     "subscriptionStatus" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeSubId_key" ON "User"("stripeSubId");
