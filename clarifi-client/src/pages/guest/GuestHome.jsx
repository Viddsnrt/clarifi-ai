import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Bot,
  Wallet,
  ScanLine,
  TrendingUp,
  BadgeDollarSign,
  BrainCircuit,
  Target,
  ShieldCheck,
} from 'lucide-react';

import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const featureList = [
  {
    title: 'AI Analisis Pengeluaran',
    desc: 'AI membaca pola pengeluaran dan memberikan insight finansial otomatis.',
    img: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=80&auto=format&fit=crop',
  },
  {
    title: 'Receipt Scanner',
    desc: 'Upload struk dan AI langsung mencatat transaksi otomatis.',
    img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80&auto=format&fit=crop',
  },
  {
    title: 'Smart Saving',
    desc: 'Target tabungan jadi lebih realistis dengan bantuan AI.',
    img: 'https://images.unsplash.com/photo-1542223616-4d4b6f4f8b30?w=1200&q=80&auto=format&fit=crop',
  },
  {
    title: 'AI Chat Assistant',
    desc: 'Konsultasi finansial langsung dengan AI pintar.',
    img: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80&auto=format&fit=crop',
  },
];

const GuestHome = () => {
  return (
    <div className="relative overflow-hidden bg-slate-50">

      {/* BACKGROUND BLUR */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-300/30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300/30 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-32">

        {/* HERO */}
        <section className="grid lg:grid-cols-2 gap-14 items-center min-h-[90vh]">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >

            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full font-semibold">
              <Sparkles size={18} />
              AI Powered Financial Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mt-6">

              Kelola
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                {' '}Keuanganmu
              </span>

              <br />
              Lebih Cerdas
            </h1>

            <p className="text-slate-600 text-lg mt-7 leading-relaxed max-w-2xl">
              Clarifi AI membantu pengguna memahami kondisi finansial,
              mengontrol pengeluaran,
              dan mencapai target tabungan menggunakan teknologi Artificial Intelligence modern.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <NavLink
                to="/login"
                className="group bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition"
              >
                Mulai Sekarang
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition"
                />
              </NavLink>

              <a
                href="#features"
                className="border border-slate-300 px-8 py-4 rounded-2xl font-semibold hover:bg-white transition"
              >
                Explore Features
              </a>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-5 mt-14">

              <StatItem number="95%" label="AI Accuracy" />
              <StatItem number="24/7" label="AI Assistant" />
              <StatItem number="Smart" label="Financial Insight" />

            </div>

          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >

            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 blur-3xl opacity-20 rounded-full"></div>

            <div className="relative bg-white/70 backdrop-blur-xl border border-white rounded-[40px] p-7 shadow-2xl">

              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop"
                alt="dashboard"
                className="rounded-3xl object-cover h-[500px] w-full"
              />

              <div className="grid grid-cols-2 gap-4 mt-5">

                <MiniCard
                  icon={<TrendingUp className="text-emerald-600" />}
                  title="Financial Score"
                  value="Excellent"
                />

                <MiniCard
                  icon={<Wallet className="text-cyan-600" />}
                  title="Monthly Saving"
                  value="+ Rp2.5JT"
                />

              </div>

            </div>

          </motion.div>

        </section>

        {/* FEATURES */}
<section id="features">

  <div className="text-center max-w-3xl mx-auto">

    <span className="text-emerald-600 font-bold uppercase tracking-widest">
      Fitur AI Modern
    </span>

    <h2 className="text-5xl font-black mt-5 leading-tight">
      Semua kebutuhan finansial
      dalam satu platform pintar
    </h2>

    <p className="text-slate-600 mt-6 text-lg">
      Pengelolaan keuangan kini lebih mudah,
      otomatis,
      dan menyenangkan dengan bantuan AI.
    </p>

  </div>

  <div className="mt-24 space-y-32">

    {featureList.map((feature, index) => {

      const isReverse = index % 2 !== 0;

      return (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className={`
            grid lg:grid-cols-2 gap-14 items-center
            ${isReverse ? 'lg:[&>*:first-child]:order-2' : ''}
          `}
        >

          {/* IMAGE */}
          <div className="relative group">

            {/* GLOW */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 blur-3xl opacity-20 rounded-[40px]"></div>

            <div className="relative overflow-hidden rounded-[40px] shadow-2xl">

              <img
                src={feature.img}
                alt={feature.title}
                className="w-full h-[420px] object-cover group-hover:scale-105 transition duration-700"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

              {/* FLOATING BADGE */}
              <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full font-bold text-sm text-emerald-600 shadow-lg">
                AI Feature #{index + 1}
              </div>

            </div>

          </div>

          {/* CONTENT */}
          <div>

            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full font-semibold">
              <Sparkles size={18} />
              Smart AI Technology
            </div>

            <h3 className="text-4xl font-black mt-6 leading-tight">
              {feature.title}
            </h3>

            <p className="text-slate-600 mt-6 text-lg leading-relaxed">
              {feature.desc}
            </p>

            <p className="text-slate-500 mt-5 leading-relaxed">
              Clarifi AI menggunakan teknologi Artificial Intelligence
              untuk membantu pengguna memahami kondisi finansial secara otomatis,
              memberikan insight real-time,
              dan membantu pengambilan keputusan finansial yang lebih cerdas.
            </p>

            {/* FEATURE POINT */}
            <div className="mt-8 space-y-4">

              <FeaturePoint text="Analisis otomatis berbasis AI" />
              <FeaturePoint text="Visualisasi data modern & interaktif" />
              <FeaturePoint text="Pengalaman pengguna lebih personal" />

            </div>

          </div>

        </motion.div>
      );
    })}

  </div>

</section>

        {/* BENEFIT */}
        <section className="grid lg:grid-cols-2 gap-10 items-center">

          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-10 rounded-[40px] text-white">

            <ShieldCheck size={60} />

            <h2 className="text-4xl font-black mt-6">
              Aman, Modern,
              dan Didukung AI
            </h2>

            <p className="mt-5 text-emerald-100 leading-relaxed text-lg">
              Clarifi AI membantu pengguna mengambil keputusan finansial
              dengan analisis cerdas,
              visualisasi modern,
              dan pengalaman pengguna yang intuitif.
            </p>

          </div>

          <div className="space-y-6">

            <BenefitItem text="AI membaca pola pengeluaran otomatis" />
            <BenefitItem text="Dashboard modern dan interaktif" />
            <BenefitItem text="Target tabungan lebih realistis" />
            <BenefitItem text="Analisis finansial real-time" />
            <BenefitItem text="Pengalaman pengguna premium" />

          </div>

        </section>

        {/* CTA */}
        <section className="relative overflow-hidden rounded-[40px] bg-black text-white p-14 text-center">

          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20"></div>

          <div className="relative z-10">

            <h2 className="text-5xl font-black leading-tight">
              Siap Mengubah
              Cara Kamu Mengatur Uang?
            </h2>

            <p className="text-slate-300 mt-6 text-lg max-w-2xl mx-auto">
              Gunakan teknologi Artificial Intelligence
              untuk membangun kebiasaan finansial yang lebih sehat.
            </p>

            <NavLink
              to="/login"
              className="inline-flex items-center gap-3 mt-10 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
            >
              Coba Clarifi AI
              <ArrowRight size={20} />
            </NavLink>

          </div>

        </section>

      </div>

    </div>
  );
};

const StatItem = ({ number, label }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center">
    <h3 className="text-3xl font-black text-emerald-600">
      {number}
    </h3>

    <p className="text-slate-600 mt-2 text-sm">
      {label}
    </p>
  </div>
);

const MiniCard = ({ icon, title, value }) => (
  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
    <div className="flex items-center gap-3">
      {icon}

      <div>
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <h4 className="font-black text-lg">
          {value}
        </h4>
      </div>
    </div>
  </div>
);

const FeaturePoint = ({ text }) => (
  <div className="flex items-center gap-4">

    <div className="bg-emerald-100 p-2 rounded-xl">
      <ShieldCheck size={18} className="text-emerald-600" />
    </div>

    <p className="font-medium text-slate-700">
      {text}
    </p>

  </div>
);

const BenefitItem = ({ text }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-lg transition">
    <div className="bg-emerald-100 p-3 rounded-xl">
      <BadgeDollarSign className="text-emerald-600" />
    </div>

    <p className="font-semibold text-slate-700">
      {text}
    </p>
  </div>
);

export default GuestHome;