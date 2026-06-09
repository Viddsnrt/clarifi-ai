import express from 'express';

const router = express.Router();

import {
  getIncomeTransactions,
  createIncomeTransaction,
  getExpenseTransactions,
  createExpenseTransaction,
} from '../controllers/transactionController.js';


// =======================================
// GET INCOME TRANSACTIONS
// =======================================
router.get(
  '/income',
  getIncomeTransactions
);


// =======================================
// CREATE INCOME TRANSACTION
// =======================================
router.post(
  '/income',
  createIncomeTransaction
);


// =======================================
// GET EXPENSE TRANSACTIONS
// =======================================
router.get(
  '/expense',
  getExpenseTransactions
);


// =======================================
// CREATE EXPENSE TRANSACTION
// =======================================
router.post(
  '/expense',
  createExpenseTransaction
);

export default router;