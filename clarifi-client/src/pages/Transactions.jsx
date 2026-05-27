import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Receipt, ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    category: 'Makan',
    classification: 'PRIMARY',
    note: ''
  });

  // Ambil data transaksi dari backend
  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle Input Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kita ambil userId secara dinamis (untuk sementara ambil user pertama dari database)
      const userRes = await axios.get('http://localhost:5000/api/dashboard-summary');
      const userId = userRes.data.userId || transactions[0]?.userId; 

      await axios.post('http://localhost:5000/api/transactions', {
        ...formData,
        amount: parseInt(formData.amount),
        userId: userId // Pastikan userId terisi
      });
      
      // Reset form dan refresh data
      setFormData({ amount: '', type: 'EXPENSE', category: 'Makan', classification: 'PRIMARY', note: '' });
      fetchTransactions();
      alert("Transaksi Berhasil Dicatat!");
    } catch (err) {
      alert("Gagal mencatat transaksi");
    }
  };

  return (
    <div className="space-y-8 page-transition">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* FORM INPUT TRANSAKSI */}
        <div className="w-full md:w-1/3">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <PlusCircle className="text-emerald-600" size={20} />
              Catat Transaksi
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Nominal (Rp)</label>
                <input 
                  type="number" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  placeholder="Contoh: 50000"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Tipe</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="EXPENSE">Pengeluaran</option>
                    <option value="INCOME">Pemasukan</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Klasifikasi</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={formData.classification}
                    onChange={(e) => setFormData({...formData, classification: e.target.value})}
                  >
                    <option value="PRIMARY">Primer (Pokok)</option>
                    <option value="SECONDARY">Sekunder</option>
                    <option value="TERTIARY">Tersier (Hiburan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
                <input 
                  type="text" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="Makan, Transport, Gaji, dll"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Catatan</label>
                <textarea 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="Beli apa hari ini?"
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">
                Simpan Transaksi
              </button>
            </form>
          </div>
        </div>

        {/* TABEL RIWAYAT TRANSAKSI */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <Receipt className="text-slate-400" size={20} />
                Riwayat Transaksi
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4 font-bold">Tanggal</th>
                    <th className="px-6 py-4 font-bold">Kategori</th>
                    <th className="px-6 py-4 font-bold">Klasifikasi</th>
                    <th className="px-6 py-4 font-bold text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="4" className="p-10 text-center text-slate-400">Memuat data...</td></tr>
                  ) : transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(t.date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-700">{t.category}</p>
                        <p className="text-xs text-slate-400">{t.note}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                        <span className={`px-2 py-1 rounded-md ${
                          t.classification === 'PRIMARY' ? 'bg-blue-50 text-blue-600' :
                          t.classification === 'SECONDARY' ? 'bg-amber-50 text-amber-600' :
                          'bg-purple-50 text-purple-600'
                        }`}>
                          {t.classification}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'INCOME' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
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