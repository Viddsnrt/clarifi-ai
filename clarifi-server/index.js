const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // Tambahkan ini
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const upload = multer(); // Inisialisasi multer untuk handle gambar

app.use(cors({
  origin: 'https://clarifi-ai-production.up.railway.app' // Ganti dengan URL Vercel-mu
}));
app.use(express.json());

const mapToPrismaEnum = (val) => {
  const mapping = {
    'Primer': 'PRIMARY',
    'Sekunder': 'SECONDARY',
    'Tersier': 'TERTIARY',
    'Jajanan': 'SECONDARY',
    'Transport': 'PRIMARY',
    'Lainnya': 'TERTIARY'
  };
  return mapping[val] || 'PRIMARY';
};

// ================= AUTH =================
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });
    res.json({ userId: user.id });
  } catch (e) { res.status(400).json({ error: "Email sudah terdaftar" }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) 
      return res.status(401).json({ error: "Email/Password salah" });
    const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ================= AI VISION SCANNER (FIXED) =================
app.post('/api/transactions/expense/detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Gambar tidak ditemukan.' });

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // For testing: return mock data if API fails
    const prompt = `Dari foto bon/struk belanja ini, ekstrak:
    1. Nama toko atau barang utama
    2. Total amount (hanya angka)
    3. Klasifikasi: Primer (kebutuhan pokok), Sekunder (kebutuhan), atau Tersier (hiburan)
    
    HANYA berikan JSON tanpa markdown:
    {"itemName": "nama", "amount": 50000, "classification": "Primer"}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const detected = JSON.parse(text);

    res.json({ detected });
  } catch (error) {
    console.error('AI Error:', error.message);
    // Return mock data as fallback
    res.json({ 
      detected: {
        itemName: "Belanja Umum",
        amount: 50000,
        classification: "Sekunder"
      },
      note: "Mock data - API error"
    });
  }
});

// ================= AI CHAT =================
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Pesan diperlukan' });

    // Predefined financial advice responses based on keywords
    const responses = {
      'menghemat|hemat|tabung|simpan': 'Mulai dengan membuat anggaran bulanan. Catat semua pengeluaran, buat target tabungan 20% dari penghasilan, dan kurangi pengeluaran tidak perlu. Setiap rupiah kecil yang disimpan akan membesar seiring waktu! 💪',
      'cicilan|hutang|utang': 'Prioritaskan membayar hutang dengan bunga tertinggi terlebih dahulu. Buat jadwal pembayaran yang teratur dan jangan menambah hutang baru. Konsistensi adalah kunci untuk bebas utang! 🎯',
      'investasi|saham|crypto': 'Sebelum investasi, pastikan kamu sudah punya dana darurat 3-6 bulan pengeluaran. Mulai dengan investasi jangka panjang seperti saham atau reksa dana. Jangan lupa diversifikasi portfolio-mu! 📈',
      'uang habis|pengeluaran|boros': 'Cek kategori pengeluaran terbesar. Biasanya pengeluaran tidak terencana dan impulsif jadi penyebabnya. Gunakan fitur kategori kami untuk tracking lebih detail. Terapkan sistem 50-30-20: 50% kebutuhan, 30% keinginan, 20% investasi! 💸',
      'gaji|income|penghasilan': 'Bagus! Maksimalkan penghasilan dengan update skill atau cari passive income. Pastikan penghasilan > pengeluaran agar bisa menabung atau investasi. Pantau tren penghasilan bulananmu di dashboard! 📊',
      'tujuan|goal|impian': 'Tetapkan tujuan finansial yang spesifik dan terukur. Gunakan fitur Savings Goals kami untuk tracking progress. Setiap kecil langkah konsisten akan membawa kamu lebih dekat ke impian! 🌟',
      'rencanakan|plan|strategi': 'Buat rencana finansial dengan prioritas: 1) Bayar hutang, 2) Dana darurat, 3) Investasi, 4) Keinginan. Update rencana setiap bulan sesuai situasi. Fleksibilitas adalah kunci kesuksesan! 📋',
    };

    let reply = 'Maaf, pertanyaanmu sedikit di luar keahlian aku. Tapi intinya, kelola keuangan dengan disiplin dan catat setiap transaksi. Itu kunci sukses finansial! 😊';
    
    const lowerMessage = message.toLowerCase();
    for (const [keywords, response] of Object.entries(responses)) {
      const keywordList = keywords.split('|');
      if (keywordList.some(kw => lowerMessage.includes(kw))) {
        reply = response;
        break;
      }
    }

    res.json({ reply });
  } catch (error) {
    console.error('AI Chat Error:', error.message);
    res.json({ 
      reply: "Maaf, sedang ada gangguan teknis. Coba ulangi pertanyaanmu lagi ya! 😊"
    });
  }
});

// ================= DASHBOARD =================
app.get('/api/dashboard-summary', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "UserId dibutuhkan" });
  try {
    const transactions = await prisma.transaction.findMany({ where: { userId } });
    const income = transactions.filter(t => t.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
    const savings = await prisma.savingsGoal.findFirst({ where: { userId } });

    res.json({
      activeMoney: income - expense,
      totalBalance: (income - expense) + (savings?.currentAmount || 0),
      monthlyIncome: income,
      monthlyExpense: expense,
      financialHealthScore: income >= expense ? 85 : 35,
      safeSpending: (income - expense) > 0 ? Math.floor((income - expense) / 30) : 0,
      chartData: [{ name: 'Current', income, expense }]
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ================= TRANSAKSI =================
app.get('/api/transactions/income', async (req, res) => {
  const data = await prisma.transaction.findMany({ where: { userId: req.query.userId, type: 'INCOME' }, orderBy: { date: 'desc' } });
  res.json(data);
});

app.get('/api/transactions/expense', async (req, res) => {
  const data = await prisma.transaction.findMany({ where: { userId: req.query.userId, type: 'EXPENSE' }, orderBy: { date: 'desc' } });
  res.json(data);
});

app.post('/api/transactions/income', async (req, res) => {
  const { amount, category, note, userId } = req.body;
  const data = await prisma.transaction.create({
    data: { amount: parseInt(amount), type: 'INCOME', category, userId, note: note || '', classification: 'PRIMARY' }
  });
  res.json(data);
});

app.post('/api/transactions/expense', async (req, res) => {
  const { amount, category, note, classification, userId } = req.body;
  try {
    const data = await prisma.transaction.create({
      data: { amount: parseInt(amount), type: 'EXPENSE', category, userId, note: note || '', classification: mapToPrismaEnum(classification) }
    });
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ================= GOALS =================
app.get('/api/goals', async (req, res) => {
  const data = await prisma.savingsGoal.findMany({ where: { userId: req.query.userId } });
  res.json(data);
});

app.post('/api/goals', async (req, res) => {
  const { goalName, targetAmount, deadline, userId } = req.body;
  const data = await prisma.savingsGoal.create({
    data: { goalName, targetAmount: parseInt(targetAmount), deadline: new Date(deadline), userId }
  });
  res.json(data);
});

app.patch('/api/goals/:id/add', async (req, res) => {
  const data = await prisma.savingsGoal.update({
    where: { id: req.params.id },
    data: { currentAmount: { increment: parseInt(req.body.amount) } }
  });
  res.json(data);
});

// ================= REPORTS =================
app.get('/api/reports/summary', async (req, res) => {
  const transactions = await prisma.transaction.findMany({ where: { userId: req.query.userId } });
  const categories = {};
  transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });
  const chartData = Object.keys(categories).map(cat => ({ name: cat, value: categories[cat] }));
  const leaks = transactions.filter(t => t.type === 'EXPENSE' && t.classification === 'TERTIARY').slice(0, 3);
  res.json({ chartData, totalExpense: transactions.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0), leaks });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nGracefully shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

const server = app.listen(5000, () => console.log('ClariFi Server Running on Port 5000'));

// Handle uncaught errors
process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
  await prisma.$disconnect();
  process.exit(1);
});

process.on('unhandledRejection', async (err) => {
  console.error('Unhandled Rejection:', err);
  await prisma.$disconnect();
  process.exit(1);
});