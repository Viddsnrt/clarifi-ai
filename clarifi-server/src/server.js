import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

const app = express();

app.use(cors());

app.use(express.json());


// ==========================
// ROUTES
// ==========================
app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api',
  dashboardRoutes
);

app.use(
  '/api/transactions',
  transactionRoutes
);


// ==========================
// SERVER
// ==========================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server berjalan di port ${PORT}`
  );
});