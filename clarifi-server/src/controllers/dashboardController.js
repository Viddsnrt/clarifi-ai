import prisma from '../lib/prisma.js';

export const getDashboardSummary = async (req, res) => {
  try {

    // USER DUMMY
    const userId = "USER_ID_KAMU";

    // =========================
    // TRANSACTION
    // =========================

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // =========================
    // SAVING GOALS
    // =========================

    const savingGoals = await prisma.savingsGoal.findMany({
      where: {
        userId,
      },
    });

    // =========================
    // AI INSIGHT
    // =========================

    const insights = await prisma.aiInsight.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    // =========================
    // HITUNG DATA
    // =========================

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((trx) => {
      if (trx.type === 'INCOME') {
        totalIncome += trx.amount;
      }

      if (trx.type === 'EXPENSE') {
        totalExpense += trx.amount;
      }
    });

    const totalBalance = totalIncome - totalExpense;

    // =========================
    // CHART DATA
    // =========================

    const chartData = transactions.map((trx) => ({
      name: new Date(trx.date).toLocaleDateString('id-ID', {
        weekday: 'short',
      }),

      income:
        trx.type === 'INCOME'
          ? trx.amount
          : 0,

      expense:
        trx.type === 'EXPENSE'
          ? trx.amount
          : 0,

      saving: 50000,
    }));

    // =========================
    // EXPENSE CATEGORY
    // =========================

    const primary = transactions.filter(
      (t) => t.classification === 'PRIMARY'
    ).length;

    const secondary = transactions.filter(
      (t) => t.classification === 'SECONDARY'
    ).length;

    const tertiary = transactions.filter(
      (t) => t.classification === 'TERTIARY'
    ).length;

    const expenseCategories = [
      {
        name: 'Primer',
        value: primary,
      },
      {
        name: 'Sekunder',
        value: secondary,
      },
      {
        name: 'Tersier',
        value: tertiary,
      },
    ];

    // =========================
    // SAVING GOALS FORMAT
    // =========================

    const formattedGoals = savingGoals.map((goal) => ({
      id: goal.id,
      title: goal.goalName,
      current: goal.currentAmount,
      target: goal.targetAmount,
      dailyTarget: 25000,
      estimate: '3 Bulan Lagi',
    }));

    // =========================
    // RESPONSE
    // =========================

    res.json({
      totalBalance,
      activeMoney: totalBalance * 0.4,
      savingBalance: totalBalance * 0.6,

      monthlyIncome: totalIncome,
      monthlyExpense: totalExpense,

      financialHealthScore: 82,
      safeSpending: 75000,

      chartData,

      expenseCategories,

      savingGoals: formattedGoals,

      insights: insights.map((i) => i.message),

      anomalies: [
        'Pengeluaran makanan meningkat minggu ini',
        'Subscription tidak digunakan',
      ],

      notifications: [
        'Jangan lupa menabung hari ini',
        'Target tabungan meningkat',
      ],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server Error',
    });
  }
};