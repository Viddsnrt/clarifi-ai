import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api'; // Import URL Railway
import { Target, Plus, X, Calendar, Coins, Plane, Home, Laptop, Car, Heart } from 'lucide-react';

const ICON_LIST = [Plane, Home, Laptop, Car, Heart];
const ICON_COLORS = [
  { bg: '#ede9fe', color: '#7c3aed' },
  { bg: '#dcfce7', color: '#16a34a' },
  { bg: '#fef3c7', color: '#d97706' },
  { bg: '#dbeafe', color: '#2563eb' },
  { bg: '#fce7f3', color: '#db2777' },
];

const QUICK_CHIPS = [100000, 250000, 500000, 1000000];

const fmt = (n) => {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1).replace('.0', '') + ' jt';
  if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + ' rb';
  return 'Rp ' + n.toLocaleString('id-ID');
};

const fmtFull = (n) => 'Rp ' + n.toLocaleString('id-ID');

const getBadge = (pct, deadline) => {
  const daysLeft = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  if (pct >= 100) return { label: 'Selesai 🎉', cls: 'bg-emerald-100 text-emerald-700' };
  if (daysLeft < 60 && pct < 80) return { label: 'Mendekati Deadline', cls: 'bg-yellow-100 text-yellow-700' };
  return { label: `${pct}%`, cls: 'bg-blue-100 text-blue-700' };
};

const getTrackColor = (pct) => {
  if (pct >= 100) return '#16a34a';
  if (pct > 60) return '#2563eb';
  return '#d97706';
};

const Budgets = () => {
  const userData = JSON.parse(localStorage.getItem('clarifi_user') || '{}');
  const userId = userData?.id;

  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ goalName: '', targetAmount: '', deadline: '' });

  const fetchGoals = async () => {
    if (!userId) return;
    try {
      // MENGGUNAKAN API_BASE_URL RAILWAY
      const res = await axios.get(`${API_BASE_URL}/api/goals?userId=${userId}`);
      setGoals(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Goals Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, [userId]);

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    if (!topUpAmount || isNaN(topUpAmount)) return;
    try {
      // MENGGUNAKAN API_BASE_URL RAILWAY
      await axios.patch(`${API_BASE_URL}/api/goals/${selectedGoal.id}/add`, {
        amount: parseInt(topUpAmount),
      });
      setShowTopUp(false);
      setTopUpAmount('');
      fetchGoals();
    } catch (err) {
      alert('Gagal memperbarui tabungan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // MENGGUNAKAN API_BASE_URL RAILWAY
      await axios.post(`${API_BASE_URL}/api/goals`, { ...formData, userId });
      setShowModal(false);
      setFormData({ goalName: '', targetAmount: '', deadline: '' });
      fetchGoals();
    } catch (err) {
      alert('Gagal simpan target');
    }
  };

  const totalSaved = goals.reduce((a, g) => a + (g.currentAmount || 0), 0);
  const avgProgress = goals.length
    ? Math.round(goals.reduce((a, g) => a + Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)), 0) / goals.length)
    : 0;

  if (!userId) {
    return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Unauthorized. Harap Login Terlebih Dahulu.</div>;
  }

  return (
    <div className="w-full px-6 md:px-10 space-y-6 pb-20 page-transition">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Rencana Masa Depan</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">Authorized account: {userData.name}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black hover:bg-emerald-600 transition shadow-xl uppercase text-xs tracking-widest"
        >
          <Plus size={18} /> Target baru
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total goals', value: goals.length },
          { label: 'Dana terkumpul', value: fmt(totalSaved), green: true },
          { label: 'Progress rata-rata', value: `${avgProgress}%` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-black ${s.green ? 'text-emerald-600' : 'text-slate-800'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Goals grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-bold uppercase animate-pulse">Menghubungkan ke Brankas Railway...</div>
      ) : goals.length === 0 ? (
        <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-300">
          <p className="font-black text-xl italic uppercase tracking-tighter">Halo {userData.name.split(' ')[0]}, Brankasmu kosong.</p>
          <p className="text-sm mt-1 font-medium">Mulai buat impian pertamamu dengan tombol di atas!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {goals.map((goal, i) => {
            const pct = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
            const badge = getBadge(pct, goal.deadline);
            const ic = ICON_COLORS[i % ICON_COLORS.length];
            const Icon = ICON_LIST[i % ICON_LIST.length];
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const deadlineStr = new Date(goal.deadline).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric',
            });

            return (
              <div key={goal.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform"
                    style={{ background: ic.bg, color: ic.color }}>
                    <Icon size={26} />
                  </div>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>

                <p className="text-xl font-black text-slate-800 tracking-tight">{goal.goalName}</p>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-1 mb-8 font-medium italic">
                  <Calendar size={14} /> {deadlineStr}
                </p>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%`, background: getTrackColor(pct) }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">
                  <span>{fmtFull(goal.currentAmount)}</span>
                  <span>{fmtFull(goal.targetAmount)}</span>
                </div>

                <div className="flex justify-between mb-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Terkumpul</p>
                    <p className="text-lg font-black text-emerald-600 tracking-tighter">{fmt(goal.currentAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Kekurangan</p>
                    <p className="text-lg font-black text-slate-300 tracking-tighter">{fmt(remaining)}</p>
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedGoal(goal); setTopUpAmount(''); setShowTopUp(true); }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                >
                  <Coins size={16} /> Isi tabungan
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Top Up */}
      {showTopUp && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-8 animate-in zoom-in duration-300">
            <h3 className="font-black text-2xl text-slate-800 tracking-tighter uppercase mb-1">Tambah dana</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">"{selectedGoal?.goalName}"</p>
            <form onSubmit={handleTopUpSubmit} className="space-y-6">
              <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">Rp</span>
                 <input
                    type="number" required autoFocus
                    className="w-full p-4 pl-12 bg-slate-100 rounded-2xl outline-none text-xl font-black text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    placeholder="0"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_CHIPS.filter(v => v <= (selectedGoal.targetAmount - selectedGoal.currentAmount)).map(v => (
                  <button
                    key={v} type="button"
                    onClick={() => setTopUpAmount(String(v))}
                    className="border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition"
                  >
                    +{fmt(v)}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTopUp(false)} className="flex-1 py-4 text-slate-400 font-black uppercase text-xs tracking-widest">Batal</button>
                <button type="submit" className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100">Simpan Dana</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal New Target */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 relative animate-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute right-8 top-8 text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-xl">
              <X size={20} />
            </button>
            <h3 className="font-black text-2xl text-slate-800 uppercase tracking-tighter mb-1">Set Target Baru</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Tentukan impian dan mulai beraksi.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nama Impian</label>
                <input
                  type="text" required
                  className="w-full mt-1 p-4 bg-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Beli Laptop ROG"
                  value={formData.goalName}
                  onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Target Dana (Rp)</label>
                <input
                  type="number" required
                  className="w-full mt-1 p-4 bg-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  placeholder="10.000.000"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Kapan harus tercapai?</label>
                <input
                  type="date" required
                  className="w-full mt-1 p-4 bg-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-emerald-600 transition shadow-xl mt-4">
                Luncurkan Target!
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;