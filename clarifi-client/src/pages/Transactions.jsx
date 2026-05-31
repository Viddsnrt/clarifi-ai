import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  PlusCircle,
  Receipt,
  ArrowUpCircle,
  TrendingUp,
  Wallet,
  PiggyBank,
  Sparkles,
} from 'lucide-react';

const classificationOptions = [
  'Primer',
  'Sekunder',
  'Tersier',
  'Jajanan',
  'Transport',
  'Lainnya',
];

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('income');
  const [incomeTransactions, setIncomeTransactions] = useState([]);
  const [expenseTransactions, setExpenseTransactions] = useState([]);
  const [incomeLoading, setIncomeLoading] = useState(true);
  const [expenseLoading, setExpenseLoading] = useState(true);
  const [incomeForm, setIncomeForm] = useState({
    amount: '',
    category: '',
    note: '',
  });
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    itemName: '',
    classification: 'Jajanan',
    note: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [detectedExpense, setDetectedExpense] = useState(null);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    fetchIncomeTransactions();
    fetchExpenseTransactions();
  }, []);

  const fetchIncomeTransactions = async () => {
    setIncomeLoading(true);
    try {
      const res = await axios.get(
        'http://localhost:5000/api/transactions/income'
      );
      setIncomeTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIncomeLoading(false);
    }
  };

  const fetchExpenseTransactions = async () => {
    setExpenseLoading(true);
    try {
      const res = await axios.get(
        'http://localhost:5000/api/transactions/expense'
      );
      setExpenseTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setExpenseLoading(false);
    }
  };

  const handleSubmitIncome = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/transactions/income', {
        amount: parseInt(incomeForm.amount, 10),
        category: incomeForm.category,
        note: incomeForm.note,
      });

      setIncomeForm({ amount: '', category: '', note: '' });
      fetchIncomeTransactions();
      alert('Pemasukan berhasil ditambahkan!');
    } catch (err) {
      console.error(err);
      alert('Gagal menambahkan pemasukan');
    }
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/transactions/expense', {
        amount: parseInt(expenseForm.amount, 10),
        category: expenseForm.itemName || 'Pengeluaran',
        note: expenseForm.note,
        classification: expenseForm.classification,
      });

      setExpenseForm({ amount: '', itemName: '', classification: 'Jajanan', note: '' });
      setImageFile(null);
      setDetectedExpense(null);
      fetchExpenseTransactions();
      alert('Pengeluaran berhasil ditambahkan!');
    } catch (err) {
      console.error(err);
      alert('Gagal menambahkan pengeluaran');
    }
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files?.[0] || null);
    setDetectedExpense(null);
  };

  const handleDetectExpenseImage = async () => {
    if (!imageFile) {
      alert('Silakan pilih gambar pengeluaran dulu.');
      return;
    }

    setDetecting(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const res = await axios.post(
        'http://localhost:5000/api/transactions/expense/detect',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data.detected) {
        setDetectedExpense(res.data.detected);
        setExpenseForm((prev) => ({
          ...prev,
          amount: res.data.detected.amount.toString(),
          itemName: res.data.detected.itemName,
          classification: res.data.detected.classification,
          note: res.data.detected.note,
        }));
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.details || err.message;
      alert(`Gagal mendeteksi gambar: ${errorMsg}`);
    } finally {
      setDetecting(false);
    }
  };

  const totalIncome = incomeTransactions.reduce(
    (acc, item) => acc + (item.amount || 0),
    0
  );

  const totalExpense = expenseTransactions.reduce(
    (acc, item) => acc + (item.amount || 0),
    0
  );

  const formatCurrency = (value) => {
    return (value || 0).toLocaleString('id-ID');
  };

  return (
    <div className="space-y-8">

      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 text-[180px] opacity-10 font-black">
          +
        </div>

        <div className="relative z-10 max-w-3xl">
          <p className="uppercase tracking-widest text-sm text-emerald-100 font-semibold mb-3">
            Manajemen Pemasukan & Pengeluaran
          </p>

          <h1 className="text-4xl md:text-5xl font-black leading-tight">
            Catat Pemasukan dan Pengeluaran dengan Lebih Cerdas
          </h1>

          <p className="mt-5 text-emerald-50 text-lg leading-relaxed">
            Tambahkan pemasukan secara teratur, catat pengeluaran dengan kategori yang lebih rinci,
            dan gunakan AI untuk mendeteksi detail dari foto struk atau bukti belanja.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="bg-emerald-50 w-fit p-3 rounded-2xl mb-5">
            <Wallet className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Total Pemasukan</h2>
          <p className="text-3xl font-black text-slate-900">Rp {formatCurrency(totalIncome)}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="bg-red-50 w-fit p-3 rounded-2xl mb-5">
            <TrendingUp className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Total Pengeluaran</h2>
          <p className="text-3xl font-black text-slate-900">Rp {formatCurrency(totalExpense)}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="bg-blue-50 w-fit p-3 rounded-2xl mb-5">
            <Sparkles className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Saldo Bersih</h2>
          <p className="text-3xl font-black text-slate-900">Rp {formatCurrency(totalIncome - totalExpense)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('income')}
          className={`rounded-2xl px-5 py-3 font-semibold transition ${
            activeTab === 'income'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Pemasukan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('expense')}
          className={`rounded-2xl px-5 py-3 font-semibold transition ${
            activeTab === 'expense'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Pengeluaran
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="w-full xl:w-1/3">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-50 p-3 rounded-2xl">
                <PlusCircle className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {activeTab === 'income' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran'}
                </h2>
                <p className="text-sm text-slate-500">
                  {activeTab === 'income'
                    ? 'Catat pemasukan harianmu.'
                    : 'Tambahkan pengeluaran dengan kategori yang jelas dan dukungan AI.'}
                </p>
              </div>
            </div>

            {activeTab === 'income' ? (
              <form onSubmit={handleSubmitIncome} className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Nominal</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 500000"
                    className="w-full mt-2 p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={incomeForm.amount}
                    onChange={(e) =>
                      setIncomeForm({
                        ...incomeForm,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Kategori</label>
                  <input
                    type="text"
                    required
                    placeholder="Gaji, Freelance, Bonus"
                    className="w-full mt-2 p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={incomeForm.category}
                    onChange={(e) =>
                      setIncomeForm({
                        ...incomeForm,
                        category: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Catatan</label>
                  <textarea
                    rows="4"
                    placeholder="Catatan pemasukan..."
                    className="w-full mt-2 p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={incomeForm.note}
                    onChange={(e) =>
                      setIncomeForm({
                        ...incomeForm,
                        note: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 transition text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100"
                >
                  Simpan Pemasukan
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitExpense} className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Nama Barang / Pengeluaran</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Snack, Transport, Buku"
                    className="w-full mt-2 p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={expenseForm.itemName}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        itemName: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Kategori Pengeluaran</label>
                  <select
                    className="w-full mt-2 p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={expenseForm.classification}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        classification: e.target.value,
                      })
                    }
                  >
                    {classificationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Nominal</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 25000"
                    className="w-full mt-2 p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={expenseForm.amount}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Catatan</label>
                  <textarea
                    rows="4"
                    placeholder="Catatan pengeluaran..."
                    className="w-full mt-2 p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={expenseForm.note}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        note: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Foto Struk / Bukti Pengeluaran</label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="w-full mt-2"
                    onChange={handleImageChange}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleDetectExpenseImage}
                  disabled={detecting}
                  className={`w-full py-4 rounded-2xl font-bold shadow-lg transition ${
                    detecting
                      ? 'bg-slate-400 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  {detecting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin"></div>
                      Mendeteksi dengan Gemini Vision AI...
                    </div>
                  ) : (
                    '🤖 Deteksi AI dari Gambar'
                  )}
                </button>

                {detectedExpense && (
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4">
                    <h3 className="font-bold text-slate-800 mb-3">Hasil Deteksi AI Gemini Vision</h3>
                    
                    <div className={`mb-3 text-xs font-semibold px-3 py-1 rounded-full w-fit ${
                      detectedExpense.confidence === 'high' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : detectedExpense.confidence === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      Kepercayaan: {detectedExpense.confidence?.toUpperCase() || 'MEDIUM'}
                    </div>

                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <p><span className="font-bold text-slate-700">Barang:</span> {detectedExpense.itemName}</p>
                      <p><span className="font-bold text-slate-700">Kategori:</span> {detectedExpense.category}</p>
                      <p><span className="font-bold text-slate-700">Jenis Pengeluaran:</span> {detectedExpense.classification}</p>
                      <p><span className="font-bold text-slate-700">Perkiraan Harga:</span> Rp {formatCurrency(detectedExpense.amount)}</p>
                      {detectedExpense.note && (
                        <p><span className="font-bold text-slate-700">Deskripsi:</span> {detectedExpense.note}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpenseForm({
                          amount: detectedExpense.amount.toString(),
                          itemName: detectedExpense.itemName,
                          classification: detectedExpense.classification,
                          note: detectedExpense.note,
                        })
                      }
                      className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 transition text-white py-3 rounded-2xl font-semibold"
                    >
                      ✓ Gunakan Deteksi AI
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 transition text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100"
                >
                  Simpan Pengeluaran
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="w-full xl:w-2/3">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="bg-slate-100 p-3 rounded-2xl">
                <Receipt className="text-slate-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {activeTab === 'income' ? 'Riwayat Pemasukan' : 'Riwayat Pengeluaran'}
                </h2>
                <p className="text-sm text-slate-500">
                  {activeTab === 'income'
                    ? 'Semua pemasukan yang sudah kamu catat.'
                    : 'Daftar pengeluaran dengan kategori dan catatan.'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Tanggal</th>
                    <th className="px-6 py-4 text-left font-bold">Nama / Kategori</th>
                    <th className="px-6 py-4 text-left font-bold">Detail</th>
                    <th className="px-6 py-4 text-left font-bold">Jumlah</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {activeTab === 'income' ? (
                    incomeLoading ? (
                      <tr>
                        <td colSpan="4" className="text-center p-10 text-slate-400">
                          Memuat data pemasukan...
                        </td>
                      </tr>
                    ) : incomeTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center p-10 text-slate-400">
                          Belum ada pemasukan
                        </td>
                      </tr>
                    ) : (
                      incomeTransactions.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-5 text-sm text-slate-500">
                            {new Date(item.date).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="bg-emerald-50 p-2 rounded-xl">
                                <ArrowUpCircle className="text-emerald-600" size={18} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-700">{item.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-slate-500">{item.note || '-'}</td>
                          <td className="px-6 py-5 text-right font-bold text-emerald-600">+ Rp {formatCurrency(item.amount)}</td>
                        </tr>
                      ))
                    )
                  ) : expenseLoading ? (
                    <tr>
                      <td colSpan="4" className="text-center p-10 text-slate-400">
                        Memuat data pengeluaran...
                      </td>
                    </tr>
                  ) : expenseTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-10 text-slate-400">
                        Belum ada pengeluaran
                      </td>
                    </tr>
                  ) : (
                    expenseTransactions.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-5 text-sm text-slate-500">
                          {new Date(item.date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                              <div className="bg-red-50 p-2 rounded-xl">
                                <ArrowUpCircle className="text-red-600" size={18} />
                              </div>
                              <p className="font-bold text-slate-700">{item.category}</p>
                            </div>
                            <span className="text-xs text-slate-400">{item.classification}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500">{item.note || '-'}</td>
                        <td className="px-6 py-5 text-right font-bold text-rose-600">- Rp {formatCurrency(item.amount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
