import React from 'react';
import {
  Users,
  Target,
  ShieldCheck,
  BrainCircuit,
  Sparkles,
  TrendingUp,
  Lock,
  Globe,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const values = [
  {
    icon: <BrainCircuit className="text-emerald-600" />,
    title: 'AI Innovation',
    text: 'Menghadirkan teknologi Artificial Intelligence untuk membantu pengguna memahami kondisi finansial mereka.',
  },

  {
    icon: <TrendingUp className="text-cyan-600" />,
    title: 'Financial Growth',
    text: 'Membantu pengguna membangun kebiasaan finansial yang lebih sehat dan terarah.',
  },

  {
    icon: <Lock className="text-rose-600" />,
    title: 'Privacy First',
    text: 'Keamanan dan privasi data pengguna menjadi prioritas utama Clarifi AI.',
  },

  {
    icon: <Globe className="text-violet-600" />,
    title: 'Accessible Finance',
    text: 'Membuat pengelolaan finansial modern dapat diakses oleh semua orang.',
  },
];

const About = () => {
  return (
    <div className="space-y-20 pb-20">

      {/* HERO */}
      <header className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[2rem] p-10 md:p-14 text-white overflow-hidden">

        <div className="max-w-4xl">

          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles size={18} />
            About Clarifi AI
          </div>

          <h1 className="text-5xl md:text-6xl font-black mt-6 leading-tight">
            Tentang Clarifi AI
          </h1>

          <p className="text-lg text-emerald-100 mt-6 leading-relaxed">
            Clarifi AI adalah platform manajemen keuangan berbasis
            Artificial Intelligence yang dirancang untuk membantu pengguna
            memahami kondisi finansial mereka,
            mengontrol pengeluaran,
            dan membangun kebiasaan finansial yang lebih baik.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <button className="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition">
              Pelajari Lebih Lanjut
            </button>

            <button className="bg-white/20 border border-white/20 px-6 py-3 rounded-2xl font-semibold">
              Mulai Sekarang
            </button>

          </div>

        </div>

      </header>

      {/* STORY */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        <div>

          <span className="text-emerald-600 font-bold uppercase tracking-wider">
            Cerita Kami
          </span>

          <h2 className="text-4xl font-black mt-4 leading-tight">
            Membantu Generasi Digital
            Mengelola Finansial Lebih Cerdas
          </h2>

          <p className="text-slate-600 mt-6 text-lg leading-relaxed">
            Banyak orang mengalami kesulitan mengontrol pengeluaran,
            tidak konsisten menabung,
            dan tidak memahami kondisi finansial mereka sendiri.
          </p>

          <p className="text-slate-600 mt-4 text-lg leading-relaxed">
            Di era digital saat ini,
            transaksi menjadi semakin cepat dan mudah,
            tetapi sebagian besar pengguna tidak memiliki sistem
            yang mampu membantu mereka mengambil keputusan finansial dengan baik.
          </p>

          <p className="text-slate-600 mt-4 text-lg leading-relaxed">
            Clarifi AI hadir untuk menjadi solusi modern
            yang menggabungkan teknologi Artificial Intelligence,
            financial insight,
            dan pengalaman pengguna yang sederhana
            dalam satu platform pintar.
          </p>

        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">

          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-emerald-600" size={28} />

            <h3 className="text-2xl font-black">
              Misi Kami
            </h3>
          </div>

          <p className="text-slate-600 text-lg leading-relaxed">
            Membantu setiap orang membuat keputusan finansial
            yang lebih cerdas melalui teknologi Artificial Intelligence
            yang mudah digunakan,
            modern,
            dan dapat diakses oleh semua kalangan.
          </p>

          <div className="space-y-5 mt-8">

            <MissionItem text="Meningkatkan literasi finansial digital" />
            <MissionItem text="Membantu pengguna mengontrol pengeluaran" />
            <MissionItem text="Mendorong kebiasaan menabung yang konsisten" />
            <MissionItem text="Menghadirkan pengalaman finansial modern berbasis AI" />

          </div>

        </div>

      </section>

      {/* VISION SECTION */}
      <section className="bg-slate-50 rounded-[2rem] p-10">

        <div className="text-center max-w-3xl mx-auto">

          <span className="text-emerald-600 font-bold uppercase">
            Visi & Nilai
          </span>

          <h2 className="text-4xl font-black mt-4">
            Membangun Masa Depan Finansial Digital
          </h2>

          <p className="text-slate-600 mt-5 text-lg">
            Clarifi AI percaya bahwa teknologi dapat membantu masyarakat
            memiliki kehidupan finansial yang lebih sehat dan terarah.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">

          {values.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-slate-100 rounded-[2rem] p-8"
            >

              <div className="bg-slate-50 w-fit p-4 rounded-2xl mb-5">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold">
                {item.title}
              </h3>

              <p className="text-slate-600 mt-4 leading-relaxed">
                {item.text}
              </p>

            </div>
          ))}

        </div>

      </section>

      {/* TEAM */}
      <section>

        <div className="text-center max-w-3xl mx-auto">

          <span className="text-emerald-600 font-bold uppercase">
            Tim Kami
          </span>

          <h2 className="text-4xl font-black mt-4">
            Dibangun oleh Tim yang Fokus pada Inovasi
          </h2>

          <p className="text-slate-600 mt-5 text-lg">
            Clarifi AI dikembangkan oleh tim yang memiliki fokus
            pada teknologi AI,
            pengalaman pengguna,
            dan inovasi finansial digital modern.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">

          <InfoCard
            icon={<Users className="text-emerald-600" />}
            title="Product Team"
            text="Membangun pengalaman aplikasi yang modern, sederhana, dan mudah digunakan."
          />

          <InfoCard
            icon={<BrainCircuit className="text-cyan-600" />}
            title="AI Development"
            text="Mengembangkan teknologi AI untuk analisis finansial dan insight otomatis."
          />

          <InfoCard
            icon={<ShieldCheck className="text-rose-600" />}
            title="Security & Privacy"
            text="Menjaga keamanan data pengguna dengan sistem yang aman dan terpercaya."
          />

        </div>

      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2rem] p-10 text-white text-center">

        <h2 className="text-5xl font-black">
          Mulai Finansial Lebih Cerdas
        </h2>

        <p className="text-slate-300 mt-5 text-lg max-w-3xl mx-auto">
          Gunakan Clarifi AI untuk membantu memahami kondisi finansial,
          mengontrol pengeluaran,
          dan membangun masa depan finansial yang lebih baik.
        </p>

        <button className="mt-8 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 mx-auto hover:scale-105 transition">
          Coba Clarifi AI
          <ArrowRight size={20} />
        </button>

      </section>

    </div>
  );
};

const MissionItem = ({ text }) => (
  <div className="flex items-start gap-3">

    <div className="bg-emerald-100 p-2 rounded-xl">
      <CheckCircle2 className="text-emerald-600" size={18} />
    </div>

    <p className="text-slate-700">
      {text}
    </p>

  </div>
);

const InfoCard = ({ icon, title, text }) => (
  <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-lg transition">

    <div className="bg-slate-50 w-fit p-4 rounded-2xl mb-5">
      {icon}
    </div>

    <h3 className="text-2xl font-bold">
      {title}
    </h3>

    <p className="text-slate-600 mt-4 leading-relaxed">
      {text}
    </p>

  </div>
);

export default About;