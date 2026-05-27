import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Plus, X, Calendar, CircleDollarSign, Coins, TrendingUp, CheckCircle } from 'lucide-react';

const Budgets = () => {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal buat Target Baru
  const [showTopUp, setShowTopUp] = useState(false); // Modal buat Isi Tabungan
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ goalName: '', targetAmount: '', deadline: '' });

  const fetchGoals = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/goals');
      setGoals(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // --- FUNGSI ISI TABUNGAN BARU ---
  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    if (!topUpAmount || isNaN(topUpAmount)) return;

    try {
      await axios.patch(`http://localhost:5000/api/goals/${selectedGoal.id}/add`, {
        amount: parseInt(topUpAmount)
      });
      setShowTopUp(false);
      setTopUpAmount('');
      fetchGoals(); // Refresh data
    } catch (err) {
      alert("Gagal memperbarui tabungan");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRes = await axios.get('http://localhost:5000/api/dashboard-summary');
      await axios.post('http://localhost:5000/api/goals', { ...formData, userId: userRes.data.userId });
      setShowModal(false);
      setFormData({ goalName: '', targetAmount: '', deadline: '' });
      fetchGoals();
    } catch (err) { alert("Gagal menyimpan target"); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 page-transition pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Rencana Masa Depan</h2>
          <p className="text-slate-500 font-medium">Kelola tabunganmu dengan lebih cerdas dan visual.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-200"
        >
          <Plus size={20} strokeWidth={3} /> Buat Target Baru
        </button>
      </div>

      {/* GRID GOALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-2 text-center py-20 text-slate-400 font-medium animate-pulse">Membuka brankas rahasia...</div>
        ) : goals.map(goal => {
          const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
          return (
            <div key={goal.id} className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden">
              {/* Background Dekorasi */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 uppercase" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-slate-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                    <Target size={28} />
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${percentage === 100 ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {percentage}% tercapai
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 mb-1">{goal.goalName}</h3>
                <p className="text-sm text-slate-400 mb-8 flex items-center gap-2 font-medium">
                  <Calendar size={14} /> Deadline: {new Date(goal.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                
                {/* Progress Bar Interactive */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2 items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter italic">Progress Tabungan</span>
                    <span className="text-lg font-black text-emerald-600 tracking-tighter">Rp {goal.currentAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-5 rounded-full p-1 border border-slate-50 shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 relative ${percentage === 100 ? 'bg-blue-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-100'}`}
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-dashed border-slate-100">
                   <p className="text-xs font-bold text-slate-400">Target Akhir: <span className="text-slate-600">Rp {goal.targetAmount.toLocaleString()}</span></p>
                   {percentage === 100 && <CheckCircle className="text-blue-500" size={20} />}
                </div>

                <button 
                  onClick={() => { setSelectedGoal(goal); setShowTopUp(true); }}
                  className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
                >
                  <Coins size={20} /> Isi Tabungan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- MODAL TOP UP (GANTINYA PROMPT JELREK) --- */}
      {showTopUp && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 text-center bg-slate-50 border-b border-slate-100">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} />
              </div>
              <h3 className="font-black text-2xl text-slate-800 tracking-tight">Tambah Dana</h3>
              <p className="text-slate-500 text-sm font-medium">Mau nabung berapa untuk <br/> <span className="text-emerald-600">"{selectedGoal?.goalName}"</span>?</p>
            </div>
            
            <form onSubmit={handleTopUpSubmit} className="p-8 space-y-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">Rp</span>
                <input 
                  autoFocus
                  type="number" required
                  className="w-full p-5 pl-12 bg-slate-100 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none text-xl font-black transition-all"
                  placeholder="0"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                />
              </div>

              {/* Quick Actions Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {[50000, 100000, 250000, 500000].map(amt => (
                  <button 
                    key={amt} type="button"
                    onClick={() => setTopUpAmount(amt.toString())}
                    className="py-2.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-100 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                  >
                    +Rp {amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowTopUp(false)} className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600 transition">Batal</button>
                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition shadow-xl shadow-emerald-100">Konfirmasi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL TARGET BARU (SAMA TAPI LEBIH RAPI) --- */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-2xl text-slate-800 tracking-tighter uppercase">Set Goal Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-xl shadow-sm"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-widest">Apa Mimpimu?</label>
                <input type="text" required className="w-full p-4 mt-1 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700" placeholder="Contoh: Beli Playstation 6" value={formData.goalName} onChange={(e) => setFormData({...formData, goalName: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-widest">Butuh Dana Berapa? (Rp)</label>
                <input type="number" required className="w-full p-4 mt-1 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700" placeholder="10000000" value={formData.targetAmount} onChange={(e) => setFormData({...formData, targetAmount: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-widest">Kapan Deadline-nya?</label>
                <input type="date" required className="w-full p-4 mt-1 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-emerald-600 transition shadow-xl">Gass, Simpan Target!</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;