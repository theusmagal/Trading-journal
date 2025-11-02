/*
  Warnings:

  - The `status` column on the `ApiKey` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `winRate` on the `DailyMetric` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(6,4)`.
  - You are about to alter the column `profitFactor` on the `DailyMetric` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `netPnl` on the `DailyMetric` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - You are about to alter the column `qty` on the `Execution` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,6)`.
  - You are about to alter the column `price` on the `Execution` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,6)`.
  - You are about to alter the column `fee` on the `Execution` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,6)`.
  - You are about to alter the column `qty` on the `Trade` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,6)`.
  - You are about to alter the column `avgEntry` on the `Trade` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,6)`.
  - You are about to alter the column `avgExit` on the `Trade` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,6)`.
  - You are about to alter the column `grossPnl` on the `Trade` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - You are about to alter the column `netPnl` on the `Trade` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - You are about to alter the column `fees` on the `Trade` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - The `plan` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `BrokerAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DailyMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Execution` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `side` on the `Execution` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `side` on the `Trade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `timezone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('PRO_MONTHLY', 'PRO_ANNUAL');

-- CreateEnum
CREATE TYPE "Side" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "ApiKeyStatus" AS ENUM ('active', 'revoked');

-- DropForeignKey
ALTER TABLE "public"."BrokerAccount" DROP CONSTRAINT "BrokerAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DailyMetric" DROP CONSTRAINT "DailyMetric_brokerAccountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Execution" DROP CONSTRAINT "Execution_brokerAccountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Trade" DROP CONSTRAINT "Trade_brokerAccountId_fkey";

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "status",
ADD COLUMN     "status" "ApiKeyStatus" NOT NULL DEFAULT 'active',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "BrokerAccount" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DailyMetric" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "winRate" SET DATA TYPE DECIMAL(6,4),
ALTER COLUMN "profitFactor" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "netPnl" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "Execution" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "side",
ADD COLUMN     "side" "Side" NOT NULL,
ALTER COLUMN "qty" SET DATA TYPE DECIMAL(18,6),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(18,6),
ALTER COLUMN "fee" SET DATA TYPE DECIMAL(18,6),
ALTER COLUMN "tradeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "trialEnd" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "side",
ADD COLUMN     "side" "Side" NOT NULL,
ALTER COLUMN "qty" SET DATA TYPE DECIMAL(18,6),
ALTER COLUMN "avgEntry" SET DATA TYPE DECIMAL(18,6),
ALTER COLUMN "avgExit" SET DATA TYPE DECIMAL(18,6),
ALTER COLUMN "grossPnl" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "netPnl" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "fees" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "trialEndsAt" TIMESTAMP(3),
DROP COLUMN "plan",
ADD COLUMN     "plan" "Plan",
ALTER COLUMN "timezone" SET NOT NULL;

-- CreateIndex
CREATE INDEX "ApiKey_userId_provider_status_idx" ON "ApiKey"("userId", "provider", "status");

-- CreateIndex
CREATE INDEX "DailyMetric_brokerAccountId_date_idx" ON "DailyMetric"("brokerAccountId", "date");

-- CreateIndex
CREATE INDEX "Trade_symbol_idx" ON "Trade"("symbol");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrokerAccount" ADD CONSTRAINT "BrokerAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_brokerAccountId_fkey" FOREIGN KEY ("brokerAccountId") REFERENCES "BrokerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_brokerAccountId_fkey" FOREIGN KEY ("brokerAccountId") REFERENCES "BrokerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyMetric" ADD CONSTRAINT "DailyMetric_brokerAccountId_fkey" FOREIGN KEY ("brokerAccountId") REFERENCES "BrokerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
