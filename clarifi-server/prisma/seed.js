const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Sedang mengisi data dummy...');

  // 1. Buat User Utama
  const user = await prisma.user.upsert({
    where: { email: 'user@clarifi.com' },
    update: {},
    create: {
      name: 'Mahasiswa ClariFi',
      email: 'user@clarifi.com',
      password: 'password123', // Nanti harus di-hash kalau buat beneran
    },
  });

  // 2. Buat Data Transaksi Seminggu Terakhir
  const transactions = [
    { amount: 5000000, type: 'INCOME', category: 'Gaji/Freelance', classification: 'PRIMARY', note: 'Gaji Bulan Ini' },
    { amount: 25000, type: 'EXPENSE', category: 'Makan', classification: 'PRIMARY', note: 'Sarapan Bubur' },
    { amount: 150000, type: 'EXPENSE', category: 'Hiburan', classification: 'TERTIARY', note: 'Nonton Bioskop' },
    { amount: 50000, type: 'EXPENSE', category: 'Transport', classification: 'PRIMARY', note: 'Bensin Motor' },
    { amount: 300000, type: 'EXPENSE', category: 'Jajan', classification: 'SECONDARY', note: 'Kopi & Snack' },
    { amount: 1200000, type: 'EXPENSE', category: 'Belanja', classification: 'SECONDARY', note: 'Beli Sepatu Baru' },
  ];

  for (const t of transactions) {
    await prisma.transaction.create({
      data: { ...t, userId: user.id },
    });
  }

  // 3. Buat Target Tabungan
  await prisma.savingsGoal.create({
    data: {
      goalName: 'Beli Laptop Gaming',
      targetAmount: 12000000,
      currentAmount: 2500000,
      deadline: new Date('2026-12-31'),
      userId: user.id,
    },
  });

  console.log('Berhasil mengisi database dengan data dummy! ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });