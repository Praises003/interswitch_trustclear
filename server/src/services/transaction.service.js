import prisma from "../lib/prisma.js";

//import interswitchApi from "../integrations/interswitch.api.js";

import { generateTransactionRef } from "../utils/generateRef.js";

export const createTransaction = async ({ amount, scenario, userId }) => {
  const transactionRef = generateTransactionRef();
  

  // ✅ Save FIRST
  await prisma.transaction.create({
    data: {
      transactionRef,
      amount,
      scenario,
      userId: userId || null,
      issuerStatus: "PENDING",
      merchantStatus: "PENDING",
    },
  });

  // ✅ Return data for FRONTEND checkout
  return {
    transactionRef,
    amount: amount * 100, // ⚠️ convert to kobo
    merchantCode: process.env.INTERSWITCH_MERCHANT_CODE,
    payItemId: process.env.INTERSWITCH_PAY_ITEM_ID,
  };
};


export const getAllTransactionsService = async () => {
  const transactions = await prisma.transaction.findMany({
    orderBy: {
      createdAt: "desc", // latest first (VERY IMPORTANT for UI)
    },
  });

  return transactions;
};


/**
 * Delete all transactions and their associated refunds
 */
export const deleteAllTransactions = async () => {
  // 1. Delete all refunds first
  const deletedRefunds = await prisma.refund.deleteMany({});
  console.log(`Deleted ${deletedRefunds.count} refunds.`);

  // 2. Delete all transactions
  const deletedTransactions = await prisma.transaction.deleteMany({});
  console.log(`Deleted ${deletedTransactions.count} transactions.`);

  return {
    refundsDeleted: deletedRefunds.count,
    transactionsDeleted: deletedTransactions.count,
  };
};