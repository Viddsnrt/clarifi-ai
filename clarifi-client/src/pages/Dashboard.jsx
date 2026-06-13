import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api'; // Import Base URL dari Railway
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
  Wallet, PiggyBank, ArrowUpCircle, ArrowDownCircle, ShieldCheck, Sparkles,
  Bot, Bell, Target, TrendingUp, AlertTriangle, Activity, Calendar, 
  Layers, Zap, ArrowUpRight, Clock
} from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

const Dashboard = () => {
  const [data, setData] = useState({
    totalBalance: 0, activeMoney: 0, savingBalance: 0, monthlyIncome: 0,
    monthlyExpense: 0, financialHealthScore: 0, safeSpending: 0,
    chartData: [], expenseCategories: [], insights: [],
    anomalies: [], notifications: [],
  });

  const [loading, setLoading] = useState(true);
  const userData = JSON.parse(localStorage.getItem('clarifi_user') || '{}');
  const userId = userData?.id;

  useEffect(() => {
    if (userId) fetchDashboard();
  }, [userId]);

  const fetchDashboard = async () => {
    try {
      // MENGGUNAKAN API_BASE_URL DARI RAILWAY
      const res = await axios.get(`${API_BASE_URL}/api/dashboard-summary?userId=${userId}`);
      setData(prev => ({ ...prev, ...res.data }));
    } catch (error) {
      console.log("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => (val || 0).toLocaleString('id-ID');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (loading) return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-slate-50">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-16 h-16 bg-emerald-500 rounded-full blur-xl mb-4"
      />
      <h1 className="text-slate-400 font-bold tracking-widest uppercase text-xs">Synchronizing Your Assets...</h1>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-20"
    >
      {/* --- ELITE HERO SECTION --- */}
      <motion.section 
        variants={itemVariants}
        className="relative bg-slate-900 rounded-[48px] p-10 md:p-16 text-white overflow-hidden shadow-2xl border border-slate-800"
      >
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
                    Live Status
                </span>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <Clock size={14} /> {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter">
              Clarity in <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">Numbers.</span>
            </h1>
            <p className="mt-8 text-slate-400 text-lg font-medium leading-relaxed italic">
              "Halo {userData.name?.split(' ')[0] || 'User'}, sistem kami telah mengamankan data finansialmu. Semua terkendali."
            </p>
          </div>
          
          <div className="w-full md:w-80 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 shadow-inner relative group">
             <Zap className="absolute top-6 right-8 text-emerald-400 animate-pulse" size={20} />
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Safe to Spend Today</p>
             <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Rp {formatCurrency(data.safeSpending)}</h2>
             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: '70%' }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400" 
                />
             </div>
             <p className="text-[10px] text-emerald-400/60 mt-4 font-bold italic">Berdasarkan sisa anggaran bulananmu.</p>
          </div>
        </div>
      </motion.section>

      {/* --- STATS GRID --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Saldo Total" amount={data.totalBalance} icon={<Wallet />} color="emerald" variants={itemVariants} />
        <StatCard title="Uang Aktif" amount={data.activeMoney} icon={<Activity />} color="blue" variants={itemVariants} />
        <StatCard title="Tabungan" amount={data.savingBalance} icon={<PiggyBank />} color="pink" variants={itemVariants} />
        <StatCard title="Pemasukan" amount={data.monthlyIncome} icon={<ArrowUpCircle />} color="cyan" variants={itemVariants} />
        <StatCard title="Pengeluaran" amount={data.monthlyExpense} icon={<ArrowDownCircle />} color="rose" variants={itemVariants} />
      </section>

      {/* --- ANALYTICS HUB --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <motion.div variants={itemVariants} className="xl:col-span-2 bg-white border border-slate-100 rounded-[48px] p-10 shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3 uppercase italic">
                <TrendingUp className="text-emerald-500" /> Cash Flow Matrix
              </h2>
              <p className="text-slate-400 text-xs font-bold mt-1 tracking-widest uppercase opacity-60">Weekly performance tracking</p>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="premiumGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }} />
                <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={5} fill="url(#premiumGrad)" animationDuration={2000} />
                <Area type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} fill="transparent" strokeDasharray="8 8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-50 border border-slate-200 rounded-[48px] p-10 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all" />
          <div className="relative z-10">
            <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase mb-2 flex items-center gap-3">
               <Layers className="text-emerald-600" size={22} /> Budget Status
            </h2>
            <div className="space-y-8 mt-8">
               <BudgetProgress label="Primary Needs" percent={65} color="bg-emerald-500" />
               <BudgetProgress label="Secondary Wants" percent={20} color="bg-blue-500" />
               <BudgetProgress label="Tertiary/Fun" percent={15} color="bg-amber-500" />
            </div>
          </div>
          <div className="mt-12 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Health Score</p>
             <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-slate-800 leading-none">{data.financialHealthScore}</span>
                <span className="text-emerald-500 font-bold text-xs mb-1 uppercase tracking-widest flex items-center gap-1">Good <ArrowUpRight size={14} /></span>
             </div>
          </div>
        </motion.div>
      </div>

      <motion.section variants={itemVariants} className="bg-white border border-slate-100 rounded-[56px] p-10 md:p-14 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                    <ShieldCheck className="text-emerald-500" size={32} /> Financial Clarity Matrix
                </h2>
                <p className="text-slate-400 text-sm font-medium mt-2">Pemisahan cerdas antara kebutuhan, keinginan, dan hiburan.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <MetricBox title="Kebutuhan Pokok" value={formatCurrency(data.monthlyExpense * 0.5)} desc="Batas aman: 50% dari total income." icon={<ShieldCheck size={20} />} color="text-emerald-600" bg="bg-emerald-50" />
            <MetricBox title="Gaya Hidup" value={formatCurrency(data.monthlyExpense * 0.3)} desc="Batas aman: 30% dari total income." icon={<Sparkles size={20} />} color="text-blue-600" bg="bg-blue-50" />
            <MetricBox title="Entertainment" value={formatCurrency(data.monthlyExpense * 0.2)} desc="Batas aman: 20% dari total income." icon={<Zap size={20} />} color="text-amber-600" bg="bg-amber-50" />
        </div>
      </motion.section>
    </motion.div>
  );
};

// --- SUB COMPONENTS (Tetap Sama) ---
const StatCard = ({ title, amount, icon, color, variants }) => {
  const styles = { emerald: "bg-emerald-50 text-emerald-600", blue: "bg-blue-50 text-blue-600", pink: "bg-pink-50 text-pink-600", rose: "bg-rose-50 text-rose-600", cyan: "bg-cyan-50 text-cyan-600" };
  return (
    <motion.div variants={variants} whileHover={{ y: -12, scale: 1.02 }} className="bg-white border border-slate-100 rounded-[38px] p-8 shadow-sm transition-all duration-300">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${styles[color]}`}>{React.cloneElement(icon, { size: 26, strokeWidth: 2.5 })}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">Rp {amount.toLocaleString('id-ID')}</h2>
    </motion.div>
  );
};

const BudgetProgress = ({ label, percent, color }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-500">{label}</span>
            <span className="text-slate-800">{percent}%</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} whileInView={{ width: `${percent}%` }} className={`h-full ${color} rounded-full shadow-lg`} />
        </div>
    </div>
);

const MetricBox = ({ title, value, desc, icon, color, bg }) => (
    <motion.div whileHover={{ backgroundColor: '#fff' }} className="p-8 rounded-[40px] border border-slate-100 bg-slate-50/50 transition-all group">
        <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>{icon}</div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{title}</h3>
        <p className={`text-2xl font-black ${color} tracking-tighter mb-4 italic`}>Rp {value}</p>
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-tighter">{desc}</p>
    </motion.div>
);

export default Dashboard;