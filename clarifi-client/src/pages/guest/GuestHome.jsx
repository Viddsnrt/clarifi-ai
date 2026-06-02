import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Bot,
  Wallet,
  ShieldCheck,
  ScanLine,
  TrendingUp,
  BadgeDollarSign,
  BrainCircuit,
  Target,
  Check,
} from 'lucide-react';

import { NavLink } from 'react-router-dom';

const featureList = [
  {
    title: 'AI Analisis Pengeluaran',
    desc: 'AI membaca pola pengeluaran dan memberikan insight finansial secara otomatis.',
    img: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=80&auto=format&fit=crop',
  },
  {
    title: 'AI Receipt Scanner',
    desc: 'Upload struk belanja dan AI akan mencatat transaksi secara otomatis.',
    img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80&auto=format&fit=crop',
  },
  {
    title: 'Smart Saving Target',
    desc: 'Tentukan target tabungan dan AI membantu menghitung strategi terbaik.',
    img: 'https://images.unsplash.com/photo-1542223616-4d4b6f4f8b30?w=1200&q=80&auto=format&fit=crop',
  },
  {
    title: 'AI Financial Advisor',
    desc: 'Tanyakan kondisi finansialmu langsung ke AI chatbot pintar.',
    img: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80&auto=format&fit=crop',
  },
];

const GuestHome = () => {
  return (
    <div className="space-y-20 pb-20">

      {/* HERO */}
      <header className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl p-10 md:p-14 text-white overflow-hidden">

        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles size={18} />
            Smart AI Personal Finance Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-black mt-6 leading-tight">
            Clarifi AI
          </h1>

          <p className="mt-6 text-lg md:text-xl text-emerald-100 leading-relaxed">
            Platform manajemen keuangan berbasis Artificial Intelligence
            yang membantu pengguna memahami kondisi finansial,
            mengontrol pengeluaran,
            dan mencapai target tabungan secara lebih cerdas.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <NavLink
              to="/login"
              className="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
            >
              Mulai Sekarang
            </NavLink>

            <a
              href="#features"
              className="bg-white/20 border border-white/20 px-6 py-3 rounded-2xl font-semibold"
            >
              Jelajahi Fitur
            </a>
          </div>
        </div>

        {/* FEATURE PREVIEW */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featureList.map((f) => (
            <div
              key={f.title}
              className="bg-white/10 backdrop-blur-lg p-4 rounded-3xl border border-white/10"
            >
              <img
                src={f.img}
                alt={f.title}
                className="w-full h-40 object-cover rounded-2xl mb-4"
              />

              <h3 className="font-bold text-lg">{f.title}</h3>

              <p className="text-sm text-emerald-100 mt-2 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* ABOUT */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        <div>
          <span className="text-emerald-600 font-bold uppercase tracking-wider">
            Kenapa Clarifi AI Hadir?
          </span>

          <h2 className="text-4xl font-black mt-4 leading-tight">
            Banyak orang punya uang,
            tapi tidak benar-benar memahami kondisi finansial mereka.
          </h2>

          <p className="text-slate-600 mt-6 leading-relaxed text-lg">
            Di era transaksi digital yang serba cepat,
            banyak pengguna mengalami pengeluaran impulsif,
            sulit menabung,
            dan tidak memiliki kontrol finansial yang jelas.
          </p>

          <p className="text-slate-600 mt-4 leading-relaxed text-lg">
            Clarifi AI hadir untuk membantu pengguna mengelola keuangan
            secara otomatis menggunakan Artificial Intelligence,
            sehingga pengelolaan finansial menjadi lebih mudah,
            modern,
            dan terarah.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold mb-6">
            Masalah Finansial yang Sering Terjadi
          </h3>

          <div className="space-y-5">
            <ProblemItem text="Pengeluaran tidak terkontrol setiap bulan" />
            <ProblemItem text="Sulit mencapai target tabungan" />
            <ProblemItem text="Tidak tahu uang habis ke mana" />
            <ProblemItem text="Aplikasi keuangan terasa membosankan" />
            <ProblemItem text="Tidak ada insight finansial yang membantu" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-emerald-600 font-bold uppercase">
            Fitur Unggulan
          </span>

          <h2 className="text-4xl font-black mt-4">
            Semua kebutuhan finansial dalam satu aplikasi AI
          </h2>

          <p className="text-slate-600 mt-5 text-lg">
            Clarifi AI membantu pengguna memahami,
            mengontrol,
            dan meningkatkan kondisi finansial mereka secara real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">

          <FeatureCard
            icon={<BrainCircuit className="text-emerald-600" />}
            title="AI Financial Insight"
            text="AI menganalisis pola keuangan dan memberikan rekomendasi finansial personal."
          />

          <FeatureCard
            icon={<ScanLine className="text-cyan-600" />}
            title="Receipt Scanner"
            text="Scan struk belanja dan AI otomatis membaca total transaksi serta kategorinya."
          />

          <FeatureCard
            icon={<Wallet className="text-rose-600" />}
            title="Expense Tracking"
            text="Pantau seluruh pengeluaran dan pemasukan dalam dashboard modern."
          />

          <FeatureCard
            icon={<Target className="text-orange-600" />}
            title="Smart Saving"
            text="AI membantu menghitung target tabungan harian dan estimasi tercapai."
          />

          <FeatureCard
            icon={<Bot className="text-violet-600" />}
            title="AI Financial Chatbot"
            text="Tanya apa saja tentang kondisi finansialmu langsung ke AI."
          />

          <FeatureCard
            icon={<TrendingUp className="text-sky-600" />}
            title="Financial Health Score"
            text="Lihat seberapa sehat kondisi finansialmu berdasarkan analisis AI."
          />

        </div>
      </section>

      {/* PREMIUM */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-10">

        <div className="text-center max-w-3xl mx-auto">
          <span className="text-emerald-400 font-bold uppercase">
            Clarifi Premium
          </span>

          <h2 className="text-5xl font-black mt-4">
            Hanya Rp10.000 / Bulan
          </h2>

          <p className="text-slate-300 mt-5 text-lg">
            Dapatkan pengalaman AI finansial yang lebih lengkap
            dengan fitur premium eksklusif.
          </p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold">Free Plan</h3>

            <p className="text-slate-300 mt-2">
              Cocok untuk penggunaan dasar.
            </p>

            <div className="text-4xl font-black mt-6">
              Rp0
            </div>

            <div className="space-y-4 mt-8">
              <PlanItem text="Pencatatan pemasukan & pengeluaran" />
              <PlanItem text="Dashboard finansial dasar" />
              <PlanItem text="Manual expense tracking" />
              <PlanItem text="Target tabungan sederhana" />
            </div>
          </div>

          <div className="bg-emerald-500 text-white rounded-3xl p-8 relative overflow-hidden">

            <div className="absolute top-4 right-4 bg-white text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
              BEST VALUE
            </div>

            <h3 className="text-2xl font-bold">
              Premium AI Plan
            </h3>

            <p className="text-emerald-100 mt-2">
              Semua fitur AI pintar untuk finansialmu.
            </p>

            <div className="text-5xl font-black mt-6">
              Rp10K
              <span className="text-lg font-medium">/bulan</span>
            </div>

            <div className="space-y-4 mt-8">
              <PlanItem text="AI Financial Analysis" />
              <PlanItem text="AI Chatbot Assistant" />
              <PlanItem text="Receipt Scanner OCR" />
              <PlanItem text="Financial Health Score" />
              <PlanItem text="Unlimited Saving Goals" />
              <PlanItem text="AI Spending Anomaly Detection" />
              <PlanItem text="Premium Financial Reports" />
            </div>

            <button className="mt-10 bg-white text-emerald-600 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition">
              Upgrade Premium
            </button>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border border-slate-200 rounded-3xl p-10 text-center">
        <h2 className="text-4xl font-black">
          Mulai Kelola Keuanganmu Lebih Cerdas
        </h2>

        <p className="text-slate-600 mt-4 text-lg max-w-2xl mx-auto">
          Gunakan kekuatan Artificial Intelligence untuk membantu
          mengontrol pengeluaran,
          membangun kebiasaan menabung,
          dan mencapai kondisi finansial yang lebih sehat.
        </p>

        <div className="mt-8 flex justify-center">
          <NavLink
            to="/login"
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition"
          >
            Coba Clarifi AI
            <ArrowRight size={20} />
          </NavLink>
        </div>
      </section>

    </div>
  );
};

const FeatureCard = ({ icon, title, text }) => (
  <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-sm hover:shadow-lg transition">
    <div className="bg-slate-50 w-fit p-4 rounded-2xl mb-5">
      {icon}
    </div>

    <h3 className="font-bold text-xl mb-3">
      {title}
    </h3>

    <p className="text-slate-600 leading-relaxed">
      {text}
    </p>
  </div>
);

const ProblemItem = ({ text }) => (
  <div className="flex items-start gap-3">
    <div className="bg-red-100 p-2 rounded-xl">
      <BadgeDollarSign className="text-red-500" size={18} />
    </div>

    <p className="text-slate-700">
      {text}
    </p>
  </div>
);

const PlanItem = ({ text }) => (
  <div className="flex items-center gap-3">
    <Check size={18} />
    <span>{text}</span>
  </div>
);

export default GuestHome;
