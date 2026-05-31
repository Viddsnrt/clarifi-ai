import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

import {
  Wallet,
  PiggyBank,
  ArrowUpCircle,
  ArrowDownCircle,
  ShieldCheck,
  Sparkles,
  Bot,
  Bell,
  Target,
  TrendingUp,
  AlertTriangle,
  Brain,
  Activity,
} from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B'];

const Dashboard = () => {
  const [data, setData] = useState({
    totalBalance: 0,
    activeMoney: 0,
    savingBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    financialHealthScore: 0,
    safeSpending: 0,

    chartData: [],
    expenseCategories: [],
    savingGoals: [],
    insights: [],
    anomalies: [],
    notifications: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/dashboard-summary'
      );

      setData(prevData => ({
        ...prevData,
        ...res.data,
        // Ensure array fields default to empty arrays if missing
        chartData: res.data.chartData || [],
        expenseCategories: res.data.expenseCategories || [],
        savingGoals: res.data.savingGoals || [],
        insights: res.data.insights || [],
        anomalies: res.data.anomalies || [],
        notifications: res.data.notifications || [],
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return (value || 0).toLocaleString('id-ID');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h1 className="text-slate-500 text-xl font-semibold">
          Memuat Clarifi...
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HERO */}
      <section className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[32px] p-8 md:p-12 text-white overflow-hidden relative">

        <div className="absolute right-0 top-0 text-[180px] opacity-10 font-black">
          $
        </div>

        <div className="relative z-10 max-w-3xl">

          <p className="uppercase tracking-[4px] text-sm text-emerald-100 mb-4 font-semibold">
            AI Personal Finance Dashboard
          </p>

          <h1 className="text-4xl md:text-5xl font-black leading-tight">
            Kelola Keuangan Lebih
            Cerdas Bersama Clarifi
          </h1>

          <p className="mt-5 text-lg text-emerald-50 leading-relaxed">
            Clarifi membantu kamu mengelola uang aktif,
            tabungan, pemasukan, pengeluaran, dan kesehatan
            finansial menggunakan AI modern secara real-time.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">

            <button className="bg-white text-emerald-600 px-6 py-4 rounded-2xl font-bold hover:scale-105 transition">
              Mulai Menabung
            </button>

            <button className="bg-white/20 border border-white/20 px-6 py-4 rounded-2xl font-semibold hover:bg-white/30 transition">
              Analisis AI
            </button>

          </div>

        </div>

      </section>

      {/* MOTIVATION */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <MotivationCard
          title="Bangun Kebiasaan Menabung"
          desc="Menabung sedikit demi sedikit setiap hari akan membantu mencapai tujuan besar di masa depan."
          icon={<PiggyBank className="text-emerald-600" />}
        />

        <MotivationCard
          title="Keuangan Lebih Stabil"
          desc="Clarifi AI membantu menjaga pola pengeluaran tetap sehat dan stabil."
          icon={<ShieldCheck className="text-blue-600" />}
        />

        <MotivationCard
          title="Pantau Finansial Real-time"
          desc="Dashboard pintar untuk memantau kondisi keuangan setiap saat."
          icon={<TrendingUp className="text-orange-500" />}
        />

      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

        <StatCard
          title="Total Saldo"
          amount={data.totalBalance}
          icon={<Wallet className="text-emerald-600" />}
          bg="bg-emerald-50"
        />

        <StatCard
          title="Uang Aktif"
          amount={data.activeMoney}
          icon={<Activity className="text-cyan-600" />}
          bg="bg-cyan-50"
        />

        <StatCard
          title="Tabungan"
          amount={data.savingBalance}
          icon={<PiggyBank className="text-pink-600" />}
          bg="bg-pink-50"
        />

        <StatCard
          title="Pemasukan"
          amount={data.monthlyIncome}
          icon={<ArrowUpCircle className="text-blue-600" />}
          bg="bg-blue-50"
        />

        <StatCard
          title="Pengeluaran"
          amount={data.monthlyExpense}
          icon={<ArrowDownCircle className="text-rose-600" />}
          bg="bg-rose-50"
        />

      </section>

      {/* HEALTH */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* HEALTH SCORE */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Financial Health
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                AI Financial Monitoring
              </p>
            </div>

            <div className="bg-emerald-100 p-3 rounded-2xl">
              <ShieldCheck className="text-emerald-600" />
            </div>

          </div>

          <h1 className="text-6xl font-black text-emerald-600">
            {data.financialHealthScore}
          </h1>

          <p className="mt-2 text-emerald-700 font-semibold">
            HEALTHY
          </p>

          <div className="mt-8 bg-emerald-50 rounded-2xl p-5">

            <p className="text-sm text-slate-500 mb-2">
              Safe Spending Hari Ini
            </p>

            <h2 className="text-3xl font-black text-emerald-600">
              Rp {formatCurrency(data.safeSpending)}
            </h2>

          </div>

        </div>

        {/* PIE CHART */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-800">
              Kategori Pengeluaran
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Analisis AI pengeluaran
            </p>

          </div>

          <div className="h-72">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={data.expenseCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                >

                  {(data.expenseCategories || []).map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* NOTIFICATION */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">

          <div className="flex items-center gap-3 mb-6">

            <div className="bg-yellow-100 p-3 rounded-2xl">
              <Bell className="text-yellow-600" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Notifikasi
              </h2>

              <p className="text-sm text-slate-500">
                Reminder Finansial
              </p>
            </div>

          </div>

          <div className="space-y-4">

            {(data.notifications || []).map((item, index) => (

              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-4"
              >

                <p className="text-sm text-slate-600">
                  🔔 {item}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CHART + AI */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* CHART */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-800">
              Analisis Finansial
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Pemasukan, pengeluaran, dan tabungan mingguan
            </p>

          </div>

          <div className="h-96">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={data.chartData}>

                <defs>

                  <linearGradient
                    id="income"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#10B981"
                      stopOpacity={0.2}
                    />

                    <stop
                      offset="95%"
                      stopColor="#10B981"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis hide />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  fill="url(#income)"
                  strokeWidth={3}
                />

                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  fill="transparent"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                />

                <Line
                  type="monotone"
                  dataKey="saving"
                  stroke="#3B82F6"
                  strokeWidth={3}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* AI INSIGHT */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-6 shadow-sm">

          <div className="flex items-center gap-3 mb-6">

            <div className="bg-white p-3 rounded-2xl">
              <Brain className="text-emerald-600" />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Clarifi AI Insight
              </h2>

              <p className="text-sm text-slate-500">
                AI Financial Analysis
              </p>

            </div>

          </div>

          <div className="space-y-4">

            {(data.insights || []).map((item, index) => (

              <div
                key={index}
                className="bg-white border border-emerald-100 rounded-2xl p-4"
              >

                <p className="text-sm text-slate-600 leading-relaxed">
                  💡 {item}
                </p>

              </div>

            ))}

          </div>

          <button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 transition text-white py-4 rounded-2xl font-semibold">
            Tanya Clarifi AI
          </button>

        </div>

      </section>

      {/* SAVING GOALS */}
      <section className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              Target Tabungan
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              AI membantu menghitung strategi menabung
            </p>

          </div>

          <div className="bg-blue-100 p-3 rounded-2xl">
            <Target className="text-blue-600" />
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {(data.savingGoals || []).map((goal) => {

            const progress =
              (goal.current / goal.target) * 100;

            return (
              <div
                key={goal.id}
                className="border border-slate-200 rounded-3xl p-5"
              >

                <div className="flex justify-between mb-3">

                  <h3 className="text-lg font-bold text-slate-800">
                    {goal.title}
                  </h3>

                  <p className="text-sm font-semibold text-emerald-600">
                    {Math.round(progress)}%
                  </p>

                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 mb-4">

                  <div
                    className="bg-emerald-500 h-3 rounded-full"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

                <div className="space-y-2 text-sm text-slate-600">

                  <p>
                    Terkumpul:
                    <span className="font-bold ml-2">
                      Rp {formatCurrency(goal.current)}
                    </span>
                  </p>

                  <p>
                    Target:
                    <span className="font-bold ml-2">
                      Rp {formatCurrency(goal.target)}
                    </span>
                  </p>

                  <p>
                    Target Harian:
                    <span className="font-bold ml-2">
                      Rp {formatCurrency(goal.dailyTarget)}
                    </span>
                  </p>

                  <p>
                    Estimasi:
                    <span className="font-bold ml-2 text-emerald-600">
                      {goal.estimate}
                    </span>
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* ANOMALY */}
      <section className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-red-100 p-3 rounded-2xl">
            <AlertTriangle className="text-red-600" />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              Deteksi Pengeluaran Tidak Wajar
            </h2>

            <p className="text-sm text-slate-500">
              Clarifi AI mendeteksi pola finansial abnormal
            </p>

          </div>

        </div>

        <div className="space-y-4">

          {(data.anomalies || []).map((item, index) => (

            <div
              key={index}
              className="bg-red-50 border border-red-100 rounded-2xl p-5"
            >

              <p className="text-sm text-red-700">
                ⚠️ {item}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* FLOATING AI */}
      <div className="fixed bottom-6 right-6">

        <button className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl shadow-lg px-6 py-4 flex items-center gap-3 transition">

          <Bot className="text-emerald-600" />

          <span className="font-semibold text-slate-800">
            Ask Clarifi AI
          </span>

        </button>

      </div>

    </div>
  );
};

const StatCard = ({
  title,
  amount,
  icon,
  bg,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">

      <div className={`w-fit p-3 rounded-2xl ${bg} mb-5`}>
        {icon}
      </div>

      <p className="text-sm text-slate-500 mb-2">
        {title}
      </p>

      <h2 className="text-2xl font-black text-slate-900">
        Rp {(amount || 0).toLocaleString('id-ID')}
      </h2>

    </div>
  );
};

const MotivationCard = ({
  title,
  desc,
  icon,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

      <div className="bg-slate-50 w-fit p-3 rounded-2xl mb-5">
        {icon}
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-3">
        {title}
      </h2>

      <p className="text-sm text-slate-600 leading-relaxed">
        {desc}
      </p>

    </div>
  );
};

export default Dashboard;