import React from 'react';
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
} from 'lucide-react';

const layananList = [
  {
    title: 'AI Expense Monitoring',
    desc: 'Pantau pengeluaran secara otomatis dan lihat pola finansialmu secara real-time.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop',
  },

  {
    title: 'Receipt Scanner OCR',
    desc: 'Upload foto struk dan sistem akan membaca total transaksi otomatis.',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80&auto=format&fit=crop',
  },

  {
    title: 'Financial AI Assistant',
    desc: 'AI chatbot yang membantu menjawab pertanyaan finansial pengguna.',
    img: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80&auto=format&fit=crop',
  },

  {
    title: 'Saving Goal Planner',
    desc: 'Atur target tabungan dan lihat progres pencapaian secara visual.',
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
    text: 'Mempermudah input transaksi hanya dari foto struk.',
  },

  {
    icon: <Wallet className="text-rose-600" />,
    title: 'Budget Control',
    text: 'Membantu pengguna mengontrol pengeluaran bulanan.',
  },

  {
    icon: <TrendingUp className="text-blue-600" />,
    title: 'Financial Tracking',
    text: 'Melihat perkembangan kondisi finansial secara berkala.',
  },

  {
    icon: <Bot className="text-violet-600" />,
    title: 'AI Chat Assistant',
    text: 'AI siap membantu kapan saja terkait finansial.',
  },

  {
    icon: <BellRing className="text-orange-600" />,
    title: 'Reminder & Notification',
    text: 'Pengingat finansial otomatis untuk pengguna.',
  },
];

const Layanan = () => {
  return (
    <div className="space-y-20 pb-20">

      {/* HERO */}
      <header className="bg-white border border-slate-200 rounded-[2rem] p-10 md:p-14 overflow-hidden">

        <div className="max-w-4xl">

          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles size={18} />
            Smart Financial Services
          </div>

          <h1 className="text-5xl md:text-6xl font-black mt-6 leading-tight text-slate-900">
            Layanan Finansial
            Modern Berbasis AI
          </h1>

          <p className="text-lg text-slate-600 mt-6 leading-relaxed">
            Clarifi AI menghadirkan berbagai layanan pintar
            untuk membantu pengguna memonitor pengeluaran,
            mengelola tabungan,
            dan memahami kondisi finansial mereka
            secara lebih mudah dan modern.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <button className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition">
              Gunakan Sekarang
            </button>

            <button className="border border-slate-300 px-6 py-3 rounded-2xl font-semibold text-slate-700 hover:bg-slate-100 transition">
              Lihat Detail
            </button>

          </div>

        </div>

      </header>

      {/* INTRO */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        <div>

          <span className="text-emerald-600 font-bold uppercase tracking-wider">
            Apa yang Kami Tawarkan?
          </span>

          <h2 className="text-4xl font-black mt-4 leading-tight">
            Teknologi AI untuk Membantu
            Pengelolaan Finansial Harian
          </h2>

          <p className="text-slate-600 mt-6 text-lg leading-relaxed">
            Clarifi AI dirancang untuk membantu pengguna
            mengelola keuangan secara lebih praktis,
            cepat,
            dan efisien melalui teknologi Artificial Intelligence.
          </p>

          <p className="text-slate-600 mt-4 text-lg leading-relaxed">
            Sistem dapat membantu memonitor transaksi,
            membaca struk pembayaran,
            memberikan insight finansial,
            hingga membantu pengguna mencapai target tabungan mereka.
          </p>

        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-[2rem] p-8 text-white">

          <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-sm">

            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={28} />
              <h3 className="text-2xl font-bold">
                Mengapa Clarifi AI?
              </h3>
            </div>

            <div className="space-y-5 mt-6">

              <BenefitItem text="Pengelolaan finansial lebih praktis" />
              <BenefitItem text="Analisis pengeluaran otomatis" />
              <BenefitItem text="Insight finansial berbasis AI" />
              <BenefitItem text="Membantu membangun kebiasaan menabung" />
              <BenefitItem text="Dashboard modern dan interaktif" />

            </div>

          </div>

        </div>

      </section>

      {/* SERVICES */}
      <section>

        <div className="text-center max-w-3xl mx-auto">

          <span className="text-emerald-600 font-bold uppercase">
            Layanan Utama
          </span>

          <h2 className="text-4xl font-black mt-4">
            Fitur yang Membantu Finansialmu
          </h2>

          <p className="text-slate-600 mt-5 text-lg">
            Berbagai layanan pintar yang dirancang
            untuk membantu pengguna memahami
            dan mengontrol kondisi finansial mereka.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">

          {layananList.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition"
            >

              <img
                src={item.img}
                alt={item.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-8">

                <h3 className="text-2xl font-black">
                  {item.title}
                </h3>

                <p className="text-slate-600 mt-4 leading-relaxed">
                  {item.desc}
                </p>

                <button className="mt-6 text-emerald-600 font-bold flex items-center gap-2">
                  Pelajari Selengkapnya
                  <ArrowRight size={18} />
                </button>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* BENEFITS */}
      <section className="bg-slate-50 rounded-[2rem] p-10">

        <div className="text-center max-w-3xl mx-auto">

          <span className="text-emerald-600 font-bold uppercase">
            Keunggulan
          </span>

          <h2 className="text-4xl font-black mt-4">
            Mengapa Menggunakan Clarifi AI?
          </h2>

          <p className="text-slate-600 mt-5 text-lg">
            Platform dirancang dengan teknologi modern
            untuk memberikan pengalaman finansial yang lebih baik.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">

          {benefitList.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl border border-slate-100 p-7"
            >

              <div className="bg-slate-50 w-fit p-4 rounded-2xl mb-5">
                {item.icon}
              </div>

              <h3 className="font-bold text-xl">
                {item.title}
              </h3>

              <p className="text-slate-600 mt-3 leading-relaxed">
                {item.text}
              </p>

            </div>
          ))}

        </div>

      </section>

      {/* PREMIUM */}
      <section className="bg-white border border-slate-200 rounded-[2rem] p-10">

        <div className="text-center max-w-3xl mx-auto">

          <span className="text-emerald-600 font-bold uppercase">
            Premium Features
          </span>

          <h2 className="text-5xl font-black mt-4">
            Clarifi Premium
          </h2>

          <p className="text-slate-600 mt-5 text-lg">
            Dapatkan fitur AI lebih lengkap hanya dengan
            Rp10.000 per bulan.
          </p>

        </div>

        <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* FREE */}
          <div className="border border-slate-200 rounded-[2rem] p-8">

            <h3 className="text-2xl font-bold">
              Free Plan
            </h3>

            <div className="text-4xl font-black mt-6">
              Rp0
            </div>

            <div className="space-y-4 mt-8">

              <PricingItem text="Basic dashboard" />
              <PricingItem text="Manual transaction input" />
              <PricingItem text="Expense tracking" />
              <PricingItem text="Simple saving target" />

            </div>

          </div>

          {/* PREMIUM */}
          <div className="bg-emerald-500 text-white rounded-[2rem] p-8 relative overflow-hidden">

            <div className="absolute top-4 right-4 bg-white text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
              RECOMMENDED
            </div>

            <h3 className="text-2xl font-bold">
              Premium AI Plan
            </h3>

            <div className="text-5xl font-black mt-6">
              Rp10K
              <span className="text-lg font-medium">
                /bulan
              </span>
            </div>

            <div className="space-y-4 mt-8">

              <PricingItem text="AI Financial Analysis" />
              <PricingItem text="OCR Receipt Scanner" />
              <PricingItem text="Unlimited Saving Goals" />
              <PricingItem text="AI Financial Chatbot" />
              <PricingItem text="Premium Insight Report" />
              <PricingItem text="Advanced AI Detection" />

            </div>

            <button className="mt-10 bg-white text-emerald-600 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition">
              Upgrade Sekarang
            </button>

          </div>

        </div>

      </section>

    </div>
  );
};

const BenefitItem = ({ text }) => (
  <div className="flex items-center gap-3">

    <div className="bg-white/20 p-2 rounded-xl">
      <CheckCircle2 size={18} />
    </div>

    <span>{text}</span>

  </div>
);

const PricingItem = ({ text }) => (
  <div className="flex items-center gap-3">

    <CheckCircle2 size={18} />

    <span>{text}</span>

  </div>
);

export default Layanan;
