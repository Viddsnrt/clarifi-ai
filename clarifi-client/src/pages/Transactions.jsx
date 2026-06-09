import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
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
const Toast = ({ toast }) => (
  <AnimatePresence>
    {toast.show && (
      <motion.div
        initial={{ y: -60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -20, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
  const [scanStep, setScanStep] = useState('idle'); // idle | uploading | analyzing | done | error
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
      const [inc, exp] = await Promise.all([
        axios.get(`http://localhost:5000/api/transactions/income?userId=${userId}`),
        axios.get(`http://localhost:5000/api/transactions/expense?userId=${userId}`)
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
      await axios.post(`http://localhost:5000/api/transactions/${path}`, payload);
      showToast(isInc ? 'Pemasukan berhasil dicatat!' : 'Pengeluaran berhasil dicatat!');
      setIncomeForm({ amount: '', category: '' });
      setExpenseForm({ amount: '', itemName: '', classification: 'Sekunder' });
      clearImage();
      fetchAll();
    } catch {
      showToast('Gagal menyimpan. Periksa koneksi server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setScanStep('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('File harus berupa gambar (JPG, PNG, dll)', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 10MB', 'error');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setScanStep('ready');
  };

  const handleDetectAI = async () => {
    if (!imageFile) {
      showToast('Pilih foto struk terlebih dahulu!', 'error');
      return;
    }
    if (detecting) return;

    setDetecting(true);
    setScanStep('analyzing');

    const fd = new FormData();
    fd.append('image', imageFile);

    try {
      const res = await axios.post('http://localhost:5000/api/transactions/expense/detect', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });

      const detected = res.data?.detected;
      if (!detected) throw new Error('Respons AI tidak valid');

      setExpenseForm({
        amount: formatRibuan(detected.amount?.toString() || '0'),
        itemName: detected.itemName || '',
        classification: detected.classification || 'Sekunder',
      });
      setScanStep('done');
      showToast('AI berhasil membaca struk!');
    } catch (err) {
      console.error('AI detect error:', err);
      setScanStep('error');
      const msg = err.code === 'ECONNABORTED'
        ? 'Timeout — coba foto yang lebih jelas.'
        : err.response?.status === 422
          ? 'Struk tidak terbaca, coba foto ulang.'
          : 'AI gagal mendeteksi struk ini.';
      showToast(msg, 'error');
    } finally {
      setDetecting(false);
    }
  };

  // ─── Derived stats ──────────────────────────────────────────────────────────
  const totalIncome = incomeTransactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const totalExpense = expenseTransactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const balance = totalIncome - totalExpense;

  const currList = activeTab === 'income' ? incomeTransactions : expenseTransactions;

  if (!userId) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
      <Wallet size={48} className="mb-4 opacity-30" />
      <p className="font-semibold text-sm tracking-wide">Silakan login terlebih dahulu</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto px-4 pb-24 space-y-8">

      <Toast toast={toast} />

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white overflow-hidden relative">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute right-16 bottom-0 w-24 h-24 bg-emerald-500/10 rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-2">Selamat datang, {userData.name}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">Kelola Keuangan<br /><span className="text-emerald-400">dengan Mudah.</span></h1>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <p className="text-xs text-slate-400 mb-1">Saldo Bersih</p>
            <p className={`text-3xl font-bold tracking-tight ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              Rp {Math.abs(balance).toLocaleString('id-ID')}
            </p>
            {balance < 0 && <p className="text-xs text-rose-400 mt-0.5">Pengeluaran melebihi pemasukan</p>}
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Pemasukan" value={`Rp ${totalIncome.toLocaleString('id-ID')}`} icon={ArrowUpRight} color="emerald" />
        <StatCard label="Total Pengeluaran" value={`Rp ${totalExpense.toLocaleString('id-ID')}`} icon={ArrowDownLeft} color="rose" />
        <StatCard label="Total Transaksi" value={`${incomeTransactions.length + expenseTransactions.length} item`} icon={Receipt} color="violet" />
      </div>

      {/* ── TABS ── */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit gap-1">
        {[
          { key: 'income', label: 'Pemasukan', icon: TrendingUp },
          { key: 'expense', label: 'Pengeluaran', icon: TrendingDown },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${activeTab === key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ── MAIN 2-COL LAYOUT ── */}
      <div className="flex flex-col xl:flex-row gap-8">

        {/* ── FORM ── */}
        <div className="w-full xl:w-[400px] shrink-0">
          <motion.div key={activeTab} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-slate-100 rounded-3xl p-7 shadow-sm sticky top-24">
            
            <div className="flex items-center gap-3 mb-7">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${activeTab === 'income' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                {activeTab === 'income'
                  ? <TrendingUp size={18} className="text-emerald-600" />
                  : <TrendingDown size={18} className="text-rose-600" />}
              </div>
              <h3 className="font-bold text-slate-800">
                Tambah {activeTab === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {activeTab === 'income' ? (
                <>
                  <Field label="Nominal Dana" value={incomeForm.amount}
                    onChange={v => setIncomeForm(f => ({ ...f, amount: formatRibuan(v) }))}
                    placeholder="0" prefix="Rp" />
                  <Field label="Kategori / Sumber" value={incomeForm.category}
                    onChange={v => setIncomeForm(f => ({ ...f, category: v }))}
                    placeholder="Contoh: Freelance" />
                </>
              ) : (
                <>
                  {/* Image upload & scan zone */}
                  <div className={`rounded-2xl border-2 border-dashed transition-all overflow-hidden
                    ${imagePreview ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'}`}>
                    
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Struk"
                          className="w-full h-36 object-cover" />
                        {/* scan overlay */}
                        {detecting && (
                          <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center gap-2">
                            <ScanLine size={28} className="text-emerald-400 animate-pulse" />
                            <p className="text-xs text-white font-medium">Menganalisis struk...</p>
                          </div>
                        )}
                        {scanStep === 'done' && (
                          <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
                            <CheckCircle size={32} className="text-emerald-300" />
                          </div>
                        )}
                        <button type="button" onClick={clearImage}
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-600 p-1.5 rounded-full shadow transition-all">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center gap-2 py-7 cursor-pointer hover:bg-slate-100 transition-all">
                        <Camera size={24} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-400">Upload foto struk</span>
                        <span className="text-[11px] text-slate-300">JPG, PNG — maks 10MB</span>
                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    )}
                  </div>

                  {/* AI Scan button */}
                  {imageFile && (
                    <button type="button" onClick={handleDetectAI} disabled={detecting}
                      className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold transition-all
                        ${detecting
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : scanStep === 'done'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-900 text-white hover:bg-emerald-700 active:scale-[0.98]'}`}>
                      {detecting
                        ? <><Loader2 size={16} className="animate-spin" /> Menganalisis...</>
                        : scanStep === 'done'
                          ? <><CheckCircle size={16} /> Struk Terbaca — Scan Ulang?</>
                          : <><Bot size={16} /> Scan dengan AI Vision</>}
                    </button>
                  )}

                  <Field label="Item / Nama Barang" value={expenseForm.itemName}
                    onChange={v => setExpenseForm(f => ({ ...f, itemName: v }))}
                    placeholder="Contoh: Makan Siang" />
                  <Field label="Biaya" value={expenseForm.amount}
                    onChange={v => setExpenseForm(f => ({ ...f, amount: formatRibuan(v) }))}
                    placeholder="0" prefix="Rp" />

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Klasifikasi</label>
                    <select
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 rounded-xl outline-none font-semibold text-slate-700 text-sm transition-all"
                      value={expenseForm.classification}
                      onChange={e => setExpenseForm(f => ({ ...f, classification: e.target.value }))}>
                      {classificationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </>
              )}

              <button type="submit" disabled={saving}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm mt-2 transition-all active:scale-[0.98]
                  ${saving
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : activeTab === 'income'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100'
                      : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-100'}`}>
                {saving
                  ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</>
                  : <><Plus size={16} /> Simpan Transaksi</>}
              </button>
            </form>
          </motion.div>
        </div>

        {/* ── TRANSACTION LIST ── */}
        <div className="flex-1 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History size={18} className="text-slate-300" />
              <h2 className="font-bold text-slate-800">Riwayat Transaksi</h2>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
              {currList.length} data
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <Loader2 size={28} className="animate-spin text-slate-200" />
              <p className="text-xs text-slate-300 font-medium">Memuat transaksi...</p>
            </div>
          ) : currList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <ImageIcon size={40} className="text-slate-100" />
              <p className="text-sm text-slate-300 font-medium">Belum ada transaksi di sini</p>
              <p className="text-xs text-slate-200">Tambahkan transaksi pertamamu!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              <AnimatePresence initial={false}>
                {currList.map((item, i) => (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 px-8 py-5 hover:bg-slate-50/60 transition-all">
                    
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      ${activeTab === 'income' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                      {activeTab === 'income'
                        ? <ArrowUpRight size={18} className="text-emerald-500" />
                        : <ArrowDownLeft size={18} className="text-rose-500" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">
                        {item.category || 'Tanpa Deskripsi'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">
                          {new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        {item.classification && (
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            {item.classification}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className={`font-bold text-base shrink-0
                      ${activeTab === 'income' ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {activeTab === 'income' ? '+' : '−'} Rp {(Number(item.amount) || 0).toLocaleString('id-ID')}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Transactions;
