
import * as transactionService from "../services/transaction.service.js";


import prisma from "../lib/prisma.js";

// ✅ Create Transaction
export const createTransaction = async (req, res) => {
  try {
    const { amount, scenario, userId } = req.body;

    const result = await transactionService.createTransaction({
      amount,
      scenario,
      userId
    });

    res.status(201).json({
      message: "Transaction initialized",
      data: result,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error creating transaction",
      error: error.message,
    });
  }
};

// ✅ Get Transaction (NEW)
export const getTransaction = async (req, res) => {
  try {
    const { ref } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { transactionRef: ref },
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transaction",
      error: error.message,
    });
  }
};



export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactionsService();

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};



/**
 * Reset all transactions
 */
export const resetTransactions = async (req, res) => {
  try {
    const result = await transactionService.deleteAllTransactions();
    res.status(200).json({
      message: `Database cleared successfully!`,
      details: result,
    });
  } catch (error) {
    console.error("Error resetting transactions:", error);
    res.status(500).json({
      message: "Failed to reset database",
      error: error.message,
    });
  }
};