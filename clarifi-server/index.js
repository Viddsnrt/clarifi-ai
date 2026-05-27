const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// Inisialisasi Gemini (Pastikan API KEY ada di .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

// 1. Route Dasar (Cek Server)
app.get('/', (req, res) => {
  res.send('ClariFi API with Prisma is Running!');
});

// 2. Endpoint Dashboard (Data untuk Ringkasan & Grafik)
app.get('/api/dashboard-summary', async (req, res) => {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id }
    });

    const income = transactions.filter(t => t.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
    const savings = await prisma.savingsGoal.findFirst({ where: { userId: user.id } });

    res.json({
      userId: user.id,
      activeBalance: income - expense,
      totalSavings: savings ? savings.currentAmount : 0,
      monthlyExpense: expense,
      chartData: [
        { name: 'Sen', income: 0, expense: 25000 },
        { name: 'Sel', income: income, expense: 150000 },
        { name: 'Rab', income: 0, expense: 50000 },
        { name: 'Kam', income: 0, expense: 300000 },
        { name: 'Jum', income: 0, expense: 1200000 },
      ]
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Endpoint Riwayat Transaksi
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { amount, type, category, userId, note, classification } = req.body;
  try {
    const newTransaction = await prisma.transaction.create({
      data: { 
        amount: parseInt(amount), 
        type, 
        category, 
        userId,
        note,
        classification 
      }
    });
    res.json(newTransaction);
  } catch (error) {
    console.error("Gagal simpan transaksi:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Endpoint Savings Goals (Budgeting)
app.get('/api/goals', async (req, res) => {
  try {
    const goals = await prisma.savingsGoal.findMany({
      orderBy: { deadline: 'asc' }
    });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/goals', async (req, res) => {
  const { goalName, targetAmount, deadline, userId } = req.body;
  try {
    const newGoal = await prisma.savingsGoal.create({
      data: {
        goalName,
        targetAmount: parseInt(targetAmount),
        deadline: new Date(deadline),
        userId,
        currentAmount: 0 
      }
    });
    res.json(newGoal);
  } catch (error) {
    console.error("Gagal simpan target:", error);
    res.status(500).json({ error: error.message });
  }
});

// 5. ENDPOINT AI ADVISOR (Gemini Pro)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Menghubungi AI untuk pertanyaan:", message);

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY tidak ditemukan di file .env");
    }

    const user = await prisma.user.findFirst();
    const transactions = await prisma.transaction.findMany({
      where: { userId: user?.id },
      take: 10,
      orderBy: { date: 'desc' }
    });
    const savings = await prisma.savingsGoal.findFirst({ where: { userId: user?.id } });

    const financialContext = transactions.map(t => 
      `- ${t.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}: Rp${t.amount.toLocaleString('id-ID')} (${t.category})`
    ).join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Kamu adalah ClariFi AI, asisten keuangan pribadi mahasiswa Indonesia. 
      Tugasmu adalah memberikan saran keuangan berdasarkan data transaksi user.
      
      Data transaksi terakhir user:
      ${financialContext}
      
      Target Tabungan: ${savings ? savings.goalName : 'Belum ada'}
      
      Pertanyaan User: "${message}"
      
      Aturan Jawaban:
      - Gunakan bahasa gaul anak muda Indonesia yang santai tapi sopan.
      - Berikan jawaban yang SINGKAT (maksimal 3-4 kalimat).
      - Berikan saran yang spesifik berdasarkan angka transaksi di atas.
      - Jika user boros, tegur dengan cara yang lucu tapi edukatif.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("AI Berhasil Memberikan Jawaban");
    res.json({ reply: text });

  } catch (error) {
    console.error("--- ERROR GEMINI API ---");
    console.error("Pesan Error:", error.message);
    res.status(500).json({ error: "Gagal memproses AI", details: error.message });
  }
});

// Endpoint untuk menambah progress tabungan
app.patch('/api/goals/:id/add', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body; // Jumlah uang yang mau ditabung
  try {
    const updatedGoal = await prisma.savingsGoal.update({
      where: { id: id },
      data: {
        currentAmount: {
          increment: parseInt(amount)
        }
      }
    });
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ENDPOINT LAPORAN BULANAN ---
app.get('/api/reports/summary', async (req, res) => {
  try {
    const user = await prisma.user.findFirst();
    const transactions = await prisma.transaction.findMany({
      where: { userId: user?.id }
    });

    // Hitung total per kategori
    const categories = {};
    transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    // Format data untuk Pie Chart Recharts
    const chartData = Object.keys(categories).map(cat => ({
      name: cat,
      value: categories[cat]
    }));

    // Deteksi "Kebocoran" (Contoh: transaksi kecil berulang > 3x di kategori yang sama)
    const leaks = transactions
      .filter(t => t.type === 'EXPENSE' && t.classification === 'TERTIARY')
      .slice(0, 3) // Ambil 3 contoh untuk demo
      .map(t => ({ id: t.id, note: t.note, amount: t.amount }));

    res.json({
      chartData,
      totalExpense: transactions.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0),
      leaks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ClariFi berjalan di http://localhost:${PORT}`);
});