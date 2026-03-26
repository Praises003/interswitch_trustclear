/*
  Warnings:

  - You are about to drop the `Dispute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dispute" DROP CONSTRAINT "Dispute_transactionRef_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "fraudReasons" TEXT,
ADD COLUMN     "fraudScore" DOUBLE PRECISION,
ADD COLUMN     "potentialFraud" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "riskLevel" TEXT;

-- DropTable
DROP TABLE "Dispute";
