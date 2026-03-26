import prisma from "../lib/prisma.js";

/**
 * Create a refund for a transaction
 */
export const createRefund = async (transaction) => {
  console.log(`💸 Initiating refund for ${transaction.transactionRef}`);

  // 🚨 1. Prevent duplicate refunds
  const existingRefund = await prisma.refund.findFirst({
    where: { transactionRef: transaction.transactionRef },
  });

  if (existingRefund) {
    console.log("⚠️ Refund already exists, skipping...");
    return existingRefund;
  }

  try {
    // 🟡 2. Create refund (PENDING)
    const refund = await prisma.refund.create({
      data: {
        transactionRef: transaction.transactionRef,
        amount: transaction.amount,
        status: "PENDING",
      },
    });

    // 🔄 3. Simulate processing delay (like real payment gateway)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 🟢 4. Mark refund as completed
    const completedRefund = await prisma.refund.update({
      where: { id: refund.id },
      data: { status: "COMPLETED" },
    });

    // 🧾 5. Update transaction
    await prisma.transaction.update({
      where: { transactionRef: transaction.transactionRef },
      data: {
        resolutionStatus: "REFUNDED",
      },
    });

    console.log(`
💰 REFUND SUCCESSFUL
Transaction: ${transaction.transactionRef}
Amount: ${transaction.amount}
Status: COMPLETED
`);

    return completedRefund;

  } catch (error) {
    console.error(`❌ Refund failed for ${transaction.transactionRef}:`, error.message);

    // 🔴 Optional: mark refund failed
    await prisma.refund.create({
      data: {
        transactionRef: transaction.transactionRef,
        amount: transaction.amount,
        status: "FAILED",
      },
    });

    throw error;
  }
};