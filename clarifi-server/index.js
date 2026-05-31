const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

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

// 3a. Endpoint Income Transactions
app.get('/api/transactions/income', async (req, res) => {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const transactions = await prisma.transaction.findMany({
      where: { 
        userId: user.id,
        type: 'INCOME'
      },
      orderBy: { date: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    console.error("Gagal ambil data pemasukan:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions/income', async (req, res) => {
  const { amount, category, note } = req.body;
  try {
    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    if (!amount || !category) {
      return res.status(400).json({ message: 'Amount dan category wajib diisi' });
    }

    const newTransaction = await prisma.transaction.create({
      data: { 
        amount: parseInt(amount), 
        type: 'INCOME', 
        category, 
        userId: user.id,
        note: note || '',
        classification: 'PRIMARY'
      }
    });
    res.status(201).json({
      message: 'Pemasukan berhasil ditambahkan',
      data: newTransaction
    });
  } catch (error) {
    console.error("Gagal simpan pemasukan:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3b. Endpoint Expense Transactions
app.get('/api/transactions/expense', async (req, res) => {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const transactions = await prisma.transaction.findMany({
      where: { 
        userId: user.id,
        type: 'EXPENSE'
      },
      orderBy: { date: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    console.error("Gagal ambil data pengeluaran:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions/expense', async (req, res) => {
  const { amount, category, note, classification } = req.body;
  try {
    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    if (!amount || !category) {
      return res.status(400).json({ message: 'Amount dan category wajib diisi' });
    }

    const newTransaction = await prisma.transaction.create({
      data: { 
        amount: parseInt(amount), 
        type: 'EXPENSE', 
        category, 
        userId: user.id,
        note: note || '',
        classification: classification || 'Sekunder'
      }
    });
    res.status(201).json({
      message: 'Pengeluaran berhasil ditambahkan',
      data: newTransaction
    });
  } catch (error) {
    console.error("Gagal simpan pengeluaran:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions/expense/detect', upload.single('image'), async (req, res) => {
  try {
    const { note } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Gambar tidak ditemukan. Upload ulang gambar.' });
    }

    const user = await prisma.user.findFirst();
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const imageBase64 = req.file.buffer.toString('base64');
    const visionApiKey = process.env.GOOGLE_VISION_API_KEY;

    const extractAmountFromText = (text = '') => {
      const normalized = text.replace(/\./g, '').replace(/,/g, '').replace(/Rp|rp|IDR|idr/g, '').replace(/\s+/g, ' ');
      const amountMatch = normalized.match(/(\d{3,})/g);
      if (amountMatch) {
        return parseInt(amountMatch[amountMatch.length - 1], 10);
      }
      return 0;
    };

    const extractCategoryFromText = (text = '') => {
      const lower = text.toLowerCase();
      if (/makan|resto|warteg|kuliner|snack|minum|kopi|coffee|jajan/.test(lower)) return 'Makan & Minum';
      if (/transport|ojek|grab|gojek|taksi|bus|kereta|tol|bbm|solar|pertamax/.test(lower)) return 'Transportasi';
      if (/buku|alat tulis|stationery|pensil|pulpen|skripsi|kuliah|kelas/.test(lower)) return 'Alat & Kuliah';
      if (/pakaian|sepatu|fashion|baju|jaket|celana|kaos/.test(lower)) return 'Pakaian';
      if (/elektronik|charger|hp|laptop|gadget|headset|earphone|speaker/.test(lower)) return 'Elektronik';
      if (/snack|jajan|camilan|makanan ringan/.test(lower)) return 'Snack';
      return 'Lainnya';
    };

    const classifyCategory = (category = 'Lainnya') => {
      if (category === 'Makan & Minum' || category === 'Transportasi' || category === 'Snack') return 'Sekunder';
      if (category === 'Alat & Kuliah') return 'Primer';
      if (category === 'Pakaian' || category === 'Elektronik') return 'Tersier';
      return 'Sekunder';
    };

    let ocrText = null;
    if (visionApiKey) {
      const visionResponse = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: imageBase64,
                },
                features: [
                  {
                    type: 'TEXT_DETECTION',
                    maxResults: 5,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!visionResponse.ok) {
        const errorBody = await visionResponse.text();
        console.warn(`Vision API warning: ${visionResponse.status} ${errorBody}`);
      } else {
        const visionData = await visionResponse.json();
        ocrText = visionData?.responses?.[0]?.fullTextAnnotation?.text || visionData?.responses?.[0]?.textAnnotations?.[0]?.description;
      }
    }

    const fallbackDetected = {
      itemName: 'Pengeluaran Tidak Diketahui',
      category: 'Lainnya',
      classification: 'Sekunder',
      amount: 0,
      note: note || 'Hasil deteksi AI dari gambar',
      confidence: 'low',
    };

    if (!ocrText) {
      console.warn('OCR tidak tersedia, pakai fallback sederhana berdasarkan nama file.');
    }

    let detected = { ...fallbackDetected };
    let raw = null;

    const modelPrompt = `
Analisis teks berikut dari hasil OCR struk atau foto bukti belanja.
Tentukan:
1. Nama barang atau layanan paling relevan
2. Kategori pengeluaran (Makan & Minum, Transportasi, Alat & Kuliah, Snack, Pakaian, Elektronik, Lainnya)
3. Jenis pengeluaran (Primer, Sekunder, Tersier, Jajanan, Transport)
4. Perkiraan harga dalam rupiah

Jawab dengan JSON saja, tanpa teks tambahan, tanpa markdown, dengan format:
{
  "itemName": "...",
  "category": "...",
  "classification": "...",
  "amount": 25000,
  "confidence": "high|medium|low",
  "description": "..."
}

Teks OCR:
${ocrText || 'TIDAK ADA OCR'}
`;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      const result = await model.generateContent(modelPrompt);
      const response = await result.response;
      raw = response.text();

      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        detected = {
          itemName: parsed.itemName || fallbackDetected.itemName,
          category: parsed.category || fallbackDetected.category,
          classification: parsed.classification || fallbackDetected.classification,
          amount: parseInt(parsed.amount, 10) || fallbackDetected.amount,
          note: note || `AI Deteksi (${parsed.confidence || 'low'}): ${parsed.description || ''}`,
          confidence: parsed.confidence || fallbackDetected.confidence,
        };
      }
    } catch (aiError) {
      console.warn('Gemini AI gagal atau kuota habis, menggunakan fallback heuristik:', aiError.message);
      raw = aiError.message;
      const textSource = ocrText || req.file.originalname;
      const category = extractCategoryFromText(textSource);
      detected = {
        itemName: category === 'Lainnya' ? fallbackDetected.itemName : textSource.split(/[\n\.]/)[0].slice(0, 40),
        category,
        classification: classifyCategory(category),
        amount: extractAmountFromText(textSource),
        note: note || `Fallback deteksi dari OCR: ${textSource?.slice(0, 120)}`,
        confidence: 'low',
      };
    }

    return res.json({
      detected,
      message: 'Deteksi pengeluaran berhasil',
      ocrText,
      raw,
    });
  } catch (error) {
    console.error('Gagal deteksi pengeluaran:', error);
    res.status(500).json({
      error: 'Gagal memproses deteksi AI',
      details: error.message,
    });
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

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    
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