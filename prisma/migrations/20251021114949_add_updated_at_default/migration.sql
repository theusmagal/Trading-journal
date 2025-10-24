/*
  Warnings:

  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
*/

-- AlterTable
ALTER TABLE "User"
  ADD COLUMN "name" TEXT,
  ADD COLUMN "plan" TEXT,
  ADD COLUMN "stripeCustomerId" TEXT,
  ADD COLUMN "timezone" TEXT DEFAULT 'UTC',
  -- FIX: give updatedAt a default so existing rows get a value
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ApiKey" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "label" TEXT,
  "keyLast4" TEXT NOT NULL,
  "encApiKey" TEXT NOT NULL,
  "encSecret" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApiKey_userId_provider_idx" ON "ApiKey"("userId", "provider");

-- CreateIndex
CREATE INDEX "ApiKey_userId_provider_status_idx" ON "ApiKey"("userId", "provider", "status");

-- CreateIndex
CREATE INDEX "BrokerAccount_userId_idx" ON "BrokerAccount"("userId");

-- CreateIndex
CREATE INDEX "BrokerAccount_userId_broker_idx" ON "BrokerAccount"("userId", "broker");

-- CreateIndex
CREATE INDEX "Execution_brokerAccountId_symbol_execTime_idx"
  ON "Execution"("brokerAccountId", "symbol", "execTime");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_stripeCustomerId_idx" ON "Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key"
  ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "ApiKey"
  ADD CONSTRAINT "ApiKey_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
