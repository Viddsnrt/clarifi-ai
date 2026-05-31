import express from 'express';

const router = express.Router();

import {
  getIncomeTransactions,
  createIncomeTransaction,
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

export default router;