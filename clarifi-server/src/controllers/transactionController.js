import prisma from '../lib/prisma.js';


// =======================================
// GET ALL INCOME TRANSACTIONS
// =======================================
export const getIncomeTransactions = async (req, res) => {
  try {

    const transactions =
      await prisma.transaction.findMany({
        where: {
          type: 'INCOME',
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
    } = req.body;

    // ==========================
    // VALIDATION
    // ==========================
    if (!amount || !category) {
      return res.status(400).json({
        message: 'Amount dan category wajib diisi',
      });
    }

    // ==========================
    // AMBIL USER PERTAMA
    // ==========================
    const user = await prisma.user.findFirst();

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

          userId: user.id,
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