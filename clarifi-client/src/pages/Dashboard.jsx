import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, ArrowUpCircle, ArrowDownCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pastikan URL port-nya sesuai dengan backend (5000)
    axios.get('http://localhost:5000/api/dashboard-summary')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal mengambil data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat Data ClariFi...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Gagal terhubung ke server.</div>;

  return (
    <div className="space-y-8 page-transition">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Uang Aktif" amount={data.activeBalance} icon={<Wallet className="text-emerald-600" />} color="bg-emerald-50" />
        <StatCard title="Pemasukan" amount={data.activeBalance + data.monthlyExpense} icon={<ArrowUpCircle className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Pengeluaran" amount={data.monthlyExpense} icon={<ArrowDownCircle className="text-rose-600" />} color="bg-rose-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-700">Analisis Arus Kas</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorInc)" strokeWidth={3} />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="transparent" strokeWidth={3} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI ALERT */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-emerald-400" size={20} />
            <h3 className="font-bold text-lg text-white">ClariFi AI Insight</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
            "Berdasarkan analisis AI, pengeluaranmu bulan ini didominasi oleh kategori hiburan. Kamu bisa hemat Rp 200rb lagi bulan depan!"
          </p>
          <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition text-sm">
            Tanya AI Advisor
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, amount, icon, color }) => (
  <div className="p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 bg-white">
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-800">Rp {amount.toLocaleString('id-ID')}</p>
    </div>
  </div>
);

export default Dashboard;