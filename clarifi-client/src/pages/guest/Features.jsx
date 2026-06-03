import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Lightbulb,
} from 'lucide-react';

const featureData = {
  'ai-expense-monitoring': {
    title: 'AI Expense Monitoring',
    desc: 'Pantau pengeluaran otomatis dan lihat pola finansial real-time menggunakan AI.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop',
    benefits: [
      'Monitoring pengeluaran otomatis',
      'Analisis pola keuangan harian',
      'Insight pengeluaran terbesar',
      'Rekomendasi penghematan AI',
    ],
    steps: [
      'Login ke dashboard Clarifi AI',
      'Aktifkan tracking otomatis',
      'AI mulai membaca transaksi kamu',
      'Lihat insight keuangan real-time',
    ],
    guide: [
      'Gunakan minimal 7 hari untuk hasil akurat',
      'Jangan matikan tracking AI',
      'Kategorikan transaksi jika diperlukan',
      'Cek dashboard setiap hari untuk insight',
    ],
  },

  'receipt-scanner-ocr': {
    title: 'Receipt Scanner OCR',
    desc: 'Upload struk belanja dan AI akan membaca transaksi secara otomatis.',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80&auto=format&fit=crop',
    benefits: [
      'Scan struk otomatis',
      'Input transaksi tanpa manual',
      'Kategori pengeluaran otomatis',
      'History transaksi rapi',
    ],
    steps: [
      'Klik fitur Receipt Scanner',
      'Upload foto struk',
      'AI membaca nominal & item',
      'Data langsung masuk ke transaksi',
    ],
    guide: [
      'Gunakan foto yang jelas',
      'Pastikan struk tidak blur',
      'Ambil gambar dari sudut terang',
      'Review hasil sebelum simpan',
    ],
  },

  'financial-ai-assistant': {
    title: 'Financial AI Assistant',
    desc: 'Chat AI yang membantu menganalisis kondisi finansial kamu.',
    img: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80&auto=format&fit=crop',
    benefits: [
      'Chat AI 24/7',
      'Analisis keuangan personal',
      'Saran pengelolaan uang',
      'Simulasi keuangan',
    ],
    steps: [
      'Buka AI Assistant',
      'Tanyakan kondisi finansial kamu',
      'AI menganalisis data kamu',
      'Terima rekomendasi otomatis',
    ],
    guide: [
      'Gunakan pertanyaan spesifik',
      'Contoh: “berapa saya harus hemat?”',
      'Tanyakan laporan bulanan',
      'Gunakan AI secara rutin',
    ],
  },

  'saving-goal-planner': {
    title: 'Saving Goal Planner',
    desc: 'Kelola target tabungan dan pantau progres secara visual.',
    img: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=80&auto=format&fit=crop',
    benefits: [
      'Target tabungan fleksibel',
      'Progress tracking visual',
      'Estimasi waktu tercapai',
      'Motivasi saving AI',
    ],
    steps: [
      'Buat target tabungan',
      'Masukkan nominal & deadline',
      'AI menghitung strategi saving',
      'Pantau progress harian',
    ],
    guide: [
      'Gunakan target realistis',
      'Update progress rutin',
      'Jangan ubah target terlalu sering',
      'Gunakan fitur reminder',
    ],
  },
};

const Features = () => {
  const { slug } = useParams();
  const data = featureData[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-black">Feature tidak ditemukan</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-14 space-y-14 max-w-6xl mx-auto">

      {/* HERO */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* TEXT */}
        <div>

          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-semibold">
            <Sparkles size={18} />
            Feature Detail
          </div>

          <h1 className="text-5xl font-black mt-6">
            {data.title}
          </h1>

          <p className="text-slate-600 mt-6 text-lg leading-relaxed">
            {data.desc}
          </p>

          {/* BENEFITS */}
          <div className="mt-8 space-y-3">
            {data.benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-600" size={20} />
                <span>{b}</span>
              </div>
            ))}
          </div>

        </div>

        {/* IMAGE */}
        <div className="rounded-3xl overflow-hidden shadow-xl">
          <img
            src={data.img}
            className="w-full h-[450px] object-cover"
            alt={data.title}
          />
        </div>

      </div>

      {/* HOW IT WORKS */}
      <section>

        <div className="flex items-center gap-2 mb-6">
          <PlayCircle className="text-emerald-600" />
          <h2 className="text-2xl font-black">Cara Kerja</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {data.steps.map((s, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border">
              <span className="font-black text-emerald-600">Step {i + 1}</span>
              <p className="mt-2 text-slate-700">{s}</p>
            </div>
          ))}
        </div>

      </section>

      {/* GUIDE */}
      <section>

        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="text-yellow-500" />
          <h2 className="text-2xl font-black">Panduan Penggunaan</h2>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border space-y-4">

          {data.guide.map((g, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600" size={18} />
              <p>{g}</p>
            </div>
          ))}

        </div>

      </section>

    </div>
  );
};

export default Features;