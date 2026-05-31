import express from 'express';

const router = express.Router();

import {
  getDashboardSummary,
} from '../controllers/dashboardController.js';

router.get('/dashboard-summary', getDashboardSummary);

export default router;