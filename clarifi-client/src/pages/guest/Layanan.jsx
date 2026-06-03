import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BrainCircuit,
  ScanLine,
  Wallet,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Bot,
  BellRing,
  CheckCircle2,
  Sparkles,
  Crown,
  PlayCircle,
} from 'lucide-react';

import { motion } from 'framer-motion';

const layananList = [
  {
    title: 'AI Expense Monitoring',
    desc: 'Pantau pengeluaran otomatis dan lihat pola finansial real-time menggunakan teknologi AI modern.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop',
  },

  {
    title: 'Receipt Scanner OCR',
    desc: 'Upload struk belanja dan AI langsung membaca total transaksi secara otomatis.',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80&auto=format&fit=crop',
  },

  {
    title: 'Financial AI Assistant',
    desc: 'AI chatbot pintar yang membantu pengguna memahami kondisi finansial mereka.',
    img: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80&auto=format&fit=crop',
  },

  {
    title: 'Saving Goal Planner',
    desc: 'Buat target tabungan dan lihat progres pencapaian secara visual dan interaktif.',
    img: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=80&auto=format&fit=crop',
  },
];

const benefitList = [
  {
    icon: <BrainCircuit className="text-emerald-600" />,
    title: 'AI Financial Insight',
    text: 'AI membantu memahami kebiasaan pengeluaran pengguna.',
  },

  {
    icon: <ScanLine className="text-cyan-600" />,
    title: 'Smart OCR Scanner',
    text: 'Input transaksi lebih cepat hanya dari foto struk.',
  },

  {
    icon: <Wallet className="text-rose-600" />,
    title: 'Budget Control',
    text: 'Kontrol pengeluaran bulanan lebih mudah.',
  },

  {
    icon: <TrendingUp className="text-blue-600" />,
    title: 'Financial Tracking',
    text: 'Pantau perkembangan finansial secara berkala.',
  },

  {
    icon: <Bot className="text-violet-600" />,
    title: 'AI Chat Assistant',
    text: 'AI siap membantu pengguna kapan saja.',
  },

  {
    icon: <BellRing className="text-orange-600" />,
    title: 'Reminder & Notification',
    text: 'Pengingat finansial otomatis berbasis AI.',
  },
];

const slugify = (text) =>
  text.toLowerCase().replace(/\s+/g, '-');

const Layanan = () => {
  return (
    <div className="relative overflow-hidden bg-slate-50">

      {/* BACKGROUND */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-300/20 blur-3xl rounded-full"></div>

      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-cyan-300/20 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-32">

        {/* HERO */}
        <section className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >

            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full font-semibold">
              <Sparkles size={18} />
              Smart Financial Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mt-8">

              Layanan
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                {' '}Finansial AI
              </span>

              <br />

              Masa Depan

            </h1>

            <p className="text-slate-600 text-lg mt-8 leading-relaxed max-w-2xl">
              Clarifi AI membantu pengguna memahami,
              mengontrol,
              dan meningkatkan kondisi finansial mereka
              melalui teknologi Artificial Intelligence modern.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <button className="group bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/20">

                Gunakan Sekarang

                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition"
                />

              </button>

              <button className="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-semibold hover:bg-slate-100 transition flex items-center gap-2">

                <PlayCircle size={20} />
                Lihat Demo

              </button>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-5 mt-14">

              <StatItem number="24/7" label="AI Assistant" />
              <StatItem number="95%" label="AI Accuracy" />
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

            <div className="relative bg-white/70 backdrop-blur-2xl border border-white rounded-[40px] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.12)]">

              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop"
                alt="dashboard"
                className="rounded-[30px] object-cover h-[500px] w-full"
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

        {/* SERVICES */}
        <section>

          {/* HEADER */}
          <div className="text-center max-w-4xl mx-auto">

            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full font-semibold">
              <Sparkles size={18} />
              Layanan Utama
            </div>

            <h2 className="text-5xl md:text-6xl font-black mt-6 leading-tight">

              Solusi Finansial
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                {' '}Interaktif
              </span>

            </h2>

            <p className="text-slate-600 text-lg mt-6 leading-relaxed max-w-3xl mx-auto">
              Pengalaman finansial modern dengan AI,
              visual premium,
              dan sistem otomatis yang membantu pengguna.
            </p>

          </div>

          {/* CONTENT */}
          <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-7">

            {/* BIG CARD */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="lg:col-span-7 relative overflow-hidden rounded-[40px] min-h-[650px] group"
            >

              <img
                src={layananList[0].img}
                alt={layananList[0].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

              <div className="relative z-10 h-full flex flex-col justify-end p-10">

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2 rounded-full w-fit text-white font-semibold">
                  Smart Monitoring AI
                </div>

                <h3 className="text-5xl font-black text-white mt-6 leading-tight">
                  {layananList[0].title}
                </h3>

                <p className="text-white/80 text-lg mt-5 max-w-2xl leading-relaxed">
                  {layananList[0].desc}
                </p>

                <NavLink
                  to={`/features/${slugify(layananList[0].title)}`}
                  className="mt-8 bg-white text-black px-7 py-4 rounded-2xl font-bold flex items-center gap-3 w-fit hover:scale-105 transition"
                >
                  Explore Feature
                  <ArrowRight size={18} />
                </NavLink>

              </div>

            </motion.div>

            {/* SIDE */}
            <div className="lg:col-span-5 flex flex-col gap-7">

              {layananList.slice(1, 3).map((item, index) => (

                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-[35px] border border-slate-100 p-6 shadow-sm hover:shadow-2xl transition-all duration-500"
                >

                  <div className="flex flex-col md:flex-row gap-5">

                    <div className="md:w-40 h-40 rounded-3xl overflow-hidden shrink-0">

                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />

                    </div>

                    <div className="flex-1">

                      <div className="bg-emerald-100 text-emerald-600 w-fit p-3 rounded-2xl mb-4">

                        {index === 0
                          ? <ScanLine size={20} />
                          : <Bot size={20} />
                        }

                      </div>

                      <h3 className="text-2xl font-black leading-tight">
                        {item.title}
                      </h3>

                      <p className="text-slate-600 mt-4 leading-relaxed">
                        {item.desc}
                      </p>

                      <NavLink
                        to={`/features/${slugify(item.title)}`}
                        className="mt-5 text-emerald-600 font-bold flex items-center gap-2 hover:gap-4 transition-all"
                      >
                        Explore Feature
                        <ArrowRight size={18} />
                      </NavLink>

                    </div>

                  </div>

                </motion.div>

              ))}

            </div>

          </div>

          {/* BOTTOM */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mt-7 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[40px] p-10 text-white overflow-hidden relative"
          >

            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 blur-3xl rounded-full"></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">

              <div>

                <NavLink
                  to={`/features/${slugify(layananList[3].title)}`}
                  className="mt-8 w-fit bg-white text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition"
                >
                  Explore Feature
                  <ArrowRight size={18} />
                </NavLink>

                <h3 className="text-5xl font-black mt-7 leading-tight">
                  {layananList[3].title}
                </h3>

                <p className="text-white/80 text-lg mt-6 leading-relaxed">
                  {layananList[3].desc}
                </p>

                <div className="grid grid-cols-2 gap-5 mt-10">

                  <GlassCard title="85%" subtitle="Saving Success" />

                  <GlassCard title="AI" subtitle="Smart Recommendation" />

                </div>

              </div>

              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[35px] p-8">

                <div className="space-y-6">

                  <SavingProgress title="Liburan" percent="75%" />

                  <SavingProgress title="Laptop Baru" percent="50%" />

                  <SavingProgress title="Dana Darurat" percent="90%" />

                </div>

              </div>

            </div>

          </motion.div>

        </section>

        {/* BENEFITS */}
        <section>

          <div className="text-center max-w-3xl mx-auto">

            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full font-semibold">
              <ShieldCheck size={18} />
              Keunggulan Platform
            </div>

            <h2 className="text-5xl font-black mt-6">
              Mengapa Memilih Clarifi AI?
            </h2>

            <p className="text-slate-600 mt-6 text-lg">
              Platform modern dengan pengalaman finansial yang cepat,
              interaktif,
              dan mudah digunakan.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-16">

            {benefitList.map((item) => (

              <motion.div
                key={item.title}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[30px] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500"
              >

                <div className="bg-slate-50 w-fit p-4 rounded-2xl mb-6">
                  {item.icon}
                </div>

                <h3 className="text-2xl font-black">
                  {item.title}
                </h3>

                <p className="text-slate-600 mt-4 leading-relaxed">
                  {item.text}
                </p>

              </motion.div>

            ))}

          </div>

        </section>

        {/* PRICING */}
        <section>

          <div className="text-center max-w-3xl mx-auto">

            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-semibold">
              <Crown size={18} />
              Premium Plan
            </div>

            <h2 className="text-5xl font-black mt-6">
              Upgrade ke Clarifi Premium
            </h2>

            <p className="text-slate-600 mt-6 text-lg">
              Dapatkan seluruh fitur AI premium dengan harga terjangkau.
            </p>

          </div>

          <div className="mt-16 grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* FREE */}
            <div className="bg-white border border-slate-200 rounded-[40px] p-10">

              <h3 className="text-3xl font-black">
                Free Plan
              </h3>

              <div className="text-5xl font-black mt-8">
                Rp0
              </div>

              <div className="space-y-5 mt-10">

                <PricingItem text="Basic dashboard" />
                <PricingItem text="Expense tracking" />
                <PricingItem text="Manual input transaction" />
                <PricingItem text="Simple saving planner" />

              </div>

            </div>

            {/* PREMIUM */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-400 to-cyan-500 text-white rounded-[40px] p-10 shadow-[0_20px_80px_rgba(16,185,129,0.35)]">

              <div className="absolute top-0 right-0 w-72 h-72 bg-white/20 blur-3xl rounded-full"></div>

              <div className="absolute top-5 right-5 bg-white text-emerald-600 px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 shadow-lg">
                <Crown size={14} />
                MOST POPULAR
              </div>

              <div className="relative z-10">

                <h3 className="text-3xl font-black">
                  Premium AI Plan
                </h3>

                <p className="text-white/80 mt-3">
                  Full access semua fitur AI modern.
                </p>

                <div className="mt-8">

                  <span className="text-6xl font-black">
                    Rp10K
                  </span>

                  <span className="text-lg ml-2 text-white/80">
                    /bulan
                  </span>

                </div>

                <div className="space-y-5 mt-10">

                  <PricingItem text="AI Financial Analysis" />
                  <PricingItem text="OCR Receipt Scanner" />
                  <PricingItem text="Unlimited Saving Goals" />
                  <PricingItem text="AI Financial Chatbot" />
                  <PricingItem text="Premium Insight Report" />
                  <PricingItem text="Advanced AI Detection" />

                </div>

                <button className="mt-12 w-full bg-white text-emerald-600 py-4 rounded-2xl font-black hover:scale-[1.02] transition-all duration-300 shadow-lg">

                  Upgrade Sekarang

                </button>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

const StatItem = ({ number, label }) => (
  <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-5 text-center shadow-sm">

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

const GlassCard = ({ title, subtitle }) => (
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5">

    <h4 className="text-4xl font-black">
      {title}
    </h4>

    <p className="text-white/70 mt-2">
      {subtitle}
    </p>

  </div>
);

const SavingProgress = ({ title, percent }) => (
  <div>

    <div className="flex items-center justify-between mb-3">

      <h4 className="font-bold text-lg">
        {title}
      </h4>

      <span className="text-sm text-white/70 font-semibold">
        {percent}
      </span>

    </div>

    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">

      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: percent }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="h-full bg-white rounded-full"
      />

    </div>

  </div>
);

const PricingItem = ({ text }) => (
  <div className="flex items-center gap-3">

    <div className="bg-white/20 p-2 rounded-xl">
      <CheckCircle2 size={18} />
    </div>

    <span>{text}</span>

  </div>
);

export default Layanan;

