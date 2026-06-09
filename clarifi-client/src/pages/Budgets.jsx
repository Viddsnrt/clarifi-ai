import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  if (daysLeft < 60 && pct < 80) return { label: 'Mau habis', cls: 'bg-yellow-100 text-yellow-700' };
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
      const res = await axios.get(`http://localhost:5000/api/goals?userId=${userId}`);
      setGoals(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, [userId]);

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    if (!topUpAmount || isNaN(topUpAmount)) return;
    try {
      await axios.patch(`http://localhost:5000/api/goals/${selectedGoal.id}/add`, {
        amount: parseInt(topUpAmount),
      });
      setShowTopUp(false);
      setTopUpAmount('');
      fetchGoals();
    } catch {
      alert('Gagal menabung');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/goals', { ...formData, userId });
      setShowModal(false);
      setFormData({ goalName: '', targetAmount: '', deadline: '' });
      fetchGoals();
    } catch {
      alert('Gagal simpan target');
    }
  };

  const totalSaved = goals.reduce((a, g) => a + (g.currentAmount || 0), 0);
  const avgProgress = goals.length
    ? Math.round(goals.reduce((a, g) => a + Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)), 0) / goals.length)
    : 0;

  if (!userId) {
    return <div className="p-20 text-center font-bold">Silakan login terlebih dahulu.</div>;
  }

  return (
    <div className="w-full px-6 md:px-10 space-y-6 pb-20 page-transition">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rencana masa depan</h2>
          <p className="text-slate-500 text-sm mt-1">Akun aktif: {userData.name}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-semibold hover:bg-slate-700 transition text-sm"
        >
          <Plus size={16} /> Target baru
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total goals', value: goals.length },
          { label: 'Total terkumpul', value: fmt(totalSaved), green: true },
          { label: 'Rata-rata progress', value: `${avgProgress}%` },
        ].map((s) => (
          <div key={s.label} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.green ? 'text-emerald-600' : 'text-slate-800'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Goals grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 animate-pulse">Menghubungkan ke brankas...</div>
      ) : goals.length === 0 ? (
        <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
          <p className="font-bold text-lg">Halo {userData.name}, tabunganmu masih kosong.</p>
          <p className="text-sm mt-1">Mulai buat target baru sekarang!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {goals.map((goal, i) => {
            const pct = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
            const badge = getBadge(pct, goal.deadline);
            const ic = ICON_COLORS[i % ICON_COLORS.length];
            const Icon = ICON_LIST[i % ICON_LIST.length];
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const deadlineStr = new Date(goal.deadline).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'short', year: 'numeric',
            });

            return (
              <div key={goal.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-slate-300 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: ic.bg, color: ic.color }}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>

                <p className="text-base font-bold text-slate-800">{goal.goalName}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 mb-5">
                  <Calendar size={12} /> {deadlineStr}
                </p>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: getTrackColor(pct) }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mb-5">
                  <span>{fmtFull(goal.currentAmount)}</span>
                  <span>{fmtFull(goal.targetAmount)}</span>
                </div>

                <div className="flex justify-between mb-5">
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Terkumpul</p>
                    <p className="text-sm font-bold text-emerald-600">{fmt(goal.currentAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-0.5">Sisa</p>
                    <p className="text-sm font-bold text-slate-700">{fmt(remaining)}</p>
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedGoal(goal); setTopUpAmount(''); setShowTopUp(true); }}
                  className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-700 rounded-xl py-3 text-sm font-semibold hover:bg-slate-50 transition"
                >
                  <Coins size={15} /> Isi tabungan
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Top Up */}
      {showTopUp && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-7">
            <h3 className="font-bold text-lg text-slate-800 mb-1">Tambah dana</h3>
            <p className="text-sm text-slate-400 mb-5">"{selectedGoal?.goalName}"</p>
            <form onSubmit={handleTopUpSubmit} className="space-y-4">
              <input
                type="number"
                required
                autoFocus
                className="w-full p-3.5 bg-slate-100 rounded-xl outline-none text-lg font-bold text-slate-800"
                placeholder="Rp"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {QUICK_CHIPS.filter(v => v <= (selectedGoal.targetAmount - selectedGoal.currentAmount)).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setTopUpAmount(String(v))}
                    className="border border-slate-200 rounded-full px-3 py-1 text-xs text-slate-500 hover:bg-slate-50 transition"
                  >
                    {fmt(v)}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowTopUp(false)}
                  className="flex-1 py-3 text-slate-400 font-semibold text-sm">Batal</button>
                <button type="submit"
                  className="flex-[2] py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-700 transition">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal New Target */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600">
              <X size={22} />
            </button>
            <h3 className="font-bold text-xl text-slate-800 mb-1">Buat target baru</h3>
            <p className="text-sm text-slate-400 mb-6">Tentukan impian dan mulai menabung hari ini.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500">Nama impian</label>
                <input
                  type="text"
                  required
                  className="w-full p-3.5 bg-slate-100 rounded-xl outline-none font-semibold text-slate-800"
                  placeholder="cth: Beli laptop baru"
                  value={formData.goalName}
                  onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500">Target dana (Rp)</label>
                <input
                  type="number"
                  required
                  className="w-full p-3.5 bg-slate-100 rounded-xl outline-none font-semibold text-slate-800"
                  placeholder="10000000"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500">Deadline</label>
                <input
                  type="date"
                  required
                  className="w-full p-3.5 bg-slate-100 rounded-xl outline-none font-semibold text-slate-800"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-700 transition mt-2"
              >
                Buat target
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;