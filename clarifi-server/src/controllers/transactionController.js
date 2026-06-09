import prisma from '../lib/prisma.js';


// =======================================
// GET ALL INCOME TRANSACTIONS
// =======================================
export const getIncomeTransactions = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: 'userId diperlukan',
      });
    }

    const transactions =
      await prisma.transaction.findMany({
        where: {
          type: 'INCOME',
          userId,
        },

        orderBy: {
          date: 'desc',
        },
      });

    res.status(200).json(transactions);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Gagal mengambil data pemasukan',
    });

  }
};


// =======================================
// CREATE INCOME TRANSACTION
// =======================================
export const createIncomeTransaction = async (req, res) => {
  try {

    const {
      amount,
      category,
      note,
      userId,
    } = req.body;

    // ==========================
    // VALIDATION
    // ==========================
    if (!amount || !category || !userId) {
      return res.status(400).json({
        message: 'Amount, category, dan userId wajib diisi',
      });
    }

    // ==========================
    // CEK USER EXIST
    // ==========================
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        message: 'User tidak ditemukan',
      });
    }

    // ==========================
    // CREATE TRANSACTION
    // ==========================
    const transaction =
      await prisma.transaction.create({
        data: {
          amount: Number(amount),

          category,

          note,

          type: 'INCOME',

          classification: 'PRIMARY',

          userId,
        },
      });

    res.status(201).json({
      message: 'Pemasukan berhasil ditambahkan',
      data: transaction,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Terjadi kesalahan server',
    });

  }
};

// =======================================
// GET ALL EXPENSE TRANSACTIONS
// =======================================
export const getExpenseTransactions = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: 'userId diperlukan',
      });
    }

    const transactions =
      await prisma.transaction.findMany({
        where: {
          type: 'EXPENSE',
          userId,
        },

        orderBy: {
          date: 'desc',
        },
      });

    res.status(200).json(transactions);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Gagal mengambil data pengeluaran',
    });

  }
};

// =======================================
// CREATE EXPENSE TRANSACTION
// =======================================
export const createExpenseTransaction = async (req, res) => {
  try {

    const {
      amount,
      category,
      classification,
      note,
      userId,
    } = req.body;

    // ==========================
    // VALIDATION
    // ==========================
    if (!amount || !category || !userId) {
      return res.status(400).json({
        message: 'Amount, category, dan userId wajib diisi',
      });
    }

    // ==========================
    // CEK USER EXIST
    // ==========================
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        message: 'User tidak ditemukan',
      });
    }

    // ==========================
    // MAP CLASSIFICATION
    // ==========================
    const classificationMap = {
      'Primer': 'PRIMARY',
      'Sekunder': 'SECONDARY',
      'Tersier': 'TERTIARY',
      'PRIMARY': 'PRIMARY',
      'SECONDARY': 'SECONDARY',
      'TERTIARY': 'TERTIARY',
    };

    const mappedClassification = classificationMap[classification] || 'PRIMARY';

    // ==========================
    // CREATE TRANSACTION
    // ==========================
    const transaction =
      await prisma.transaction.create({
        data: {
          amount: Number(amount),

          category,

          note,

          type: 'EXPENSE',

          classification: mappedClassification,

          userId,
        },
      });

    res.status(201).json({
      message: 'Pengeluaran berhasil dicatat',
      data: transaction,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Terjadi kesalahan server',
    });

  }
};