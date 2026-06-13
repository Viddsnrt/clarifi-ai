import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api'; // Import Base URL Railway
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Wallet, Sparkles,
  Camera, X, CheckCircle, AlertCircle, Loader2,
  History, Bot, Image as ImageIcon, Plus, ChevronRight,
  ScanLine, Receipt, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';

const classificationOptions = ['Primer', 'Sekunder', 'Tersier', 'Jajanan', 'Transport', 'Lainnya'];

const formatRibuan = (val) => {
  if (!val) return '';
  const num = val.toString().replace(/[^0-9]/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parseAngka = (val) => parseInt(val.toString().replace(/\./g, '') || '0', 10);

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({ toast, onClose }) => (
  <AnimatePresence>
    {toast.show && (
      <motion.div
        initial={{ y: -60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -20, opacity: 0, scale: 0.95 }}
        className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-semibold backdrop-blur-sm
          ${toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-red-50 border-red-200 text-red-700'}`}
      >
        {toast.type === 'success'
          ? <CheckCircle size={18} className="shrink-0" />
          : <AlertCircle size={18} className="shrink-0" />}
        {toast.msg}
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color }) => {
  const palette = {
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-100' },
    rose: { bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-100' },
    violet: { bg: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-50', border: 'border-violet-100' },
  };
  const p = palette[color] || palette.emerald;
  return (
    <div className={`rounded-2xl p-5 border ${p.light} ${p.border} flex items-center gap-4`}>
      <div className={`w-11 h-11 rounded-xl ${p.bg} flex items-center justify-center shrink-0`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</p>
        <p className={`text-xl font-bold ${p.text} tracking-tight mt-0.5`}>{value}</p>
      </div>
    </div>
  );
};

// ─── INPUT FIELD ──────────────────────────────────────────────────────────────
const Field = ({ label, value, onChange, placeholder = '0', prefix }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">{label}</label>
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-4 text-sm font-bold text-slate-400 select-none">{prefix}</span>
      )}
      <input
        type="text" required value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${prefix ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 rounded-xl outline-none font-semibold text-slate-800 transition-all placeholder:text-slate-300 text-sm`}
      />
    </div>
  </div>
);

// ─── TRANSACTIONS PAGE ────────────────────────────────────────────────────────
const Transactions = () => {
  const userData = JSON.parse(localStorage.getItem('clarifi_user') || '{}');
  const userId = userData?.id;

  const [activeTab, setActiveTab] = useState('income');
  const [incomeTransactions, setIncomeTransactions] = useState([]);
  const [expenseTransactions, setExpenseTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [incomeForm, setIncomeForm] = useState({ amount: '', category: '' });
  const [expenseForm, setExpenseForm] = useState({ amount: '', itemName: '', classification: 'Sekunder' });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [scanStep, setScanStep] = useState('idle');
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const fileInputRef = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  useEffect(() => {
    if (userId) fetchAll();
  }, [userId]);

  const fetchAll = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // MENGGUNAKAN API_BASE_URL RAILWAY
      const [inc, exp] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/transactions/income?userId=${userId}`),
        axios.get(`${API_BASE_URL}/api/transactions/expense?userId=${userId}`)
      ]);
      setIncomeTransactions(Array.isArray(inc.data) ? inc.data : []);
      setExpenseTransactions(Array.isArray(exp.data) ? exp.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
      showToast('Gagal memuat data transaksi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    const isInc = activeTab === 'income';
    const path = isInc ? 'income' : 'expense';
    const payload = isInc
      ? { amount: parseAngka(incomeForm.amount), category: incomeForm.category, userId }
      : { amount: parseAngka(expenseForm.amount), category: expenseForm.itemName, classification: expenseForm.classification, userId };

    try {
      // MENGGUNAKAN API_BASE_URL RAILWAY
      await axios.post(`${API_BASE_URL}/api/transactions/${path}`, payload);
      showToast(isInc ? 'Pemasukan dicatat!' : 'Pengeluaran dicatat!');
      setIncomeForm({ amount: '', category: '' });
      setExpenseForm({ amount: '', itemName: '', classification: 'Sekunder' });
      clearImage();
      fetchAll();
    } catch {
      showToast('Gagal menyimpan data.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDetectAI = async () => {
    if (!imageFile) return showToast('Pilih foto struk!', 'error');
    setDetecting(true);
    setScanStep('analyzing');
    const fd = new FormData();
    fd.append('image', imageFile);

    try {
      // MENGGUNAKAN API_BASE_URL RAILWAY
      const res = await axios.post(`${API_BASE_URL}/api/transactions/expense/detect`, fd);
      const detected = res.data?.detected;
      if (!detected) throw new Error();

      setExpenseForm({
        amount: formatRibuan(detected.amount?.toString() || '0'),
        itemName: detected.itemName || '',
        classification: detected.classification || 'Sekunder',
      });
      setScanStep('done');
      showToast('AI berhasil membaca struk!');
    } catch (err) {
      setScanStep('error');
      showToast('AI gagal mengenali struk.', 'error');
    } finally {
      setDetecting(false);
    }
  };

  const clearImage = () => { setImageFile(null); setImagePreview(null); setScanStep('idle'); };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setScanStep('ready');
  };

  const totalIncome = incomeTransactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const totalExpense = expenseTransactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const balance = totalIncome - totalExpense;
  const currList = activeTab === 'income' ? incomeTransactions : expenseTransactions;

  if (!userId) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Sesi Berakhir. Login Kembali.</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 pb-24 space-y-8">
      <Toast toast={toast} />

      {/* HEADER */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-2">Ledger Environment</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">Authorized Access: <br/><span className="text-emerald-400">{userData.name || 'User'}</span></h1>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Net Balance</p>
             <p className="text-4xl font-black tracking-tighter italic">Rp {balance.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Income" value={`Rp ${totalIncome.toLocaleString('id-ID')}`} icon={ArrowUpRight} color="emerald" />
        <StatCard label="Expense" value={`Rp ${totalExpense.toLocaleString('id-ID')}`} icon={ArrowDownLeft} color="rose" />
        <StatCard label="Records" value={`${incomeTransactions.length + expenseTransactions.length} Items`} icon={Receipt} color="violet" />
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit gap-1">
        {['income', 'expense'].map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            {t === 'income' ? 'Pemasukan' : 'Pengeluaran'}
          </button>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="w-full xl:w-[400px] shrink-0">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm sticky top-24">
            <h3 className="font-black text-xl text-slate-800 uppercase italic mb-8 border-b pb-4">Add {activeTab}</h3>
            <form onSubmit={handleSave} className="space-y-5">
              {activeTab === 'income' ? (
                <>
                  <Field label="Nominal" value={incomeForm.amount} onChange={v => setIncomeForm(f => ({ ...f, amount: formatRibuan(v) }))} prefix="Rp" />
                  <Field label="Category" value={incomeForm.category} onChange={v => setIncomeForm(f => ({ ...f, category: v }))} placeholder="e.g. Freelance" />
                </>
              ) : (
                <>
                  <div className={`rounded-3xl border-2 border-dashed transition-all overflow-hidden mb-6 ${imagePreview ? 'border-emerald-500' : 'border-slate-200 bg-slate-50'}`}>
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} className="w-full h-40 object-cover opacity-80" alt="Receipt"/>
                        <button type="button" onClick={clearImage} className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg"><X size={14}/></button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center gap-2 py-10 cursor-pointer">
                        <Camera size={24} className="text-slate-300" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Scan Receipt AI</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    )}
                  </div>
                  {imageFile && (
                    <button type="button" onClick={handleDetectAI} disabled={detecting} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] mb-4 shadow-xl hover:bg-emerald-600 transition-all">
                      {detecting ? 'MENGANALISIS...' : '🤖 START AI VISION'}
                    </button>
                  )}
                  <Field label="Item Name" value={expenseForm.itemName} onChange={v => setExpenseForm(f => ({ ...f, itemName: v }))} />
                  <Field label="Nominal" value={expenseForm.amount} onChange={v => setExpenseForm(f => ({ ...f, amount: formatRibuan(v) }))} prefix="Rp" />
                  <select className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" value={expenseForm.classification} onChange={e => setExpenseForm(f => ({ ...f, classification: e.target.value }))}>
                    {classificationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </>
              )}
              <button type="submit" disabled={saving} className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black tracking-widest shadow-xl hover:bg-emerald-700 transition-all mt-4 uppercase text-xs">
                {saving ? 'SAVING...' : 'COMMIT TRANSACTION'}
              </button>
            </form>
          </div>
        </div>

        <div className="flex-1 bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
          <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-black text-xl text-slate-800 uppercase italic tracking-tight">Activity Log.</h2>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{currList.length} Entries</span>
          </div>
          <div className="divide-y divide-slate-50">
            {currList.map((item) => (
              <div key={item.id} className="flex items-center gap-6 px-10 py-6 hover:bg-slate-50/80 transition-all group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${activeTab === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                  {activeTab === 'income' ? <ArrowUpRight size={22} /> : <ArrowDownLeft size={22} />}
                </div>
                <div className="flex-1">
                  <p className="font-black text-lg text-slate-800 tracking-tight">{item.category}</p>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{new Date(item.date).toLocaleDateString('id-ID', {day:'2-digit', month:'long'})}</p>
                </div>
                <p className={`font-black text-xl italic tracking-tighter ${activeTab === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {activeTab === 'income' ? '+' : '-'} Rp {Number(item.amount).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Transactions;