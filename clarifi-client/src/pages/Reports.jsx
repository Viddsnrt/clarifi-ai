import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api'; // Import Base URL Railway
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertTriangle, Download, Zap, Share2, Loader2, CheckCircle, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Reports = () => {
  const userData = JSON.parse(localStorage.getItem('clarifi_user') || '{}');
  const userId = userData?.id;

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const reportRef = useRef(null);

  const showNotification = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  useEffect(() => {
    if (userId) {
      // MENGGUNAKAN API_BASE_URL DARI RAILWAY
      axios.get(`${API_BASE_URL}/api/reports/summary?userId=${userId}`)
        .then(res => {
          setReportData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Gagal ambil laporan:", err);
          showNotification("Gagal memuat data", "error");
          setLoading(false);
        });
    }
  }, [userId]);

  // --- LOGIKA EXPORT PRO (STABIL) ---
  const handleExport = async (mode) => {
    if (!reportRef.current) return;
    setIsExporting(true);

    try {
      const scrollY = window.scrollY;
      window.scrollTo(0, 0);

      // Beri waktu render CSS
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: reportRef.current.offsetWidth,
        height: reportRef.current.offsetHeight,
      });

      window.scrollTo(0, scrollY);

      if (mode === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`ClariFi_Report_${userData.name || 'User'}.pdf`);
        showNotification("PDF berhasil diunduh");
      } else {
        const link = document.createElement('a');
        link.download = `ClariFi_Poster_${userData.name || 'User'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showNotification("Poster berhasil disimpan");
      }
    } catch (err) {
      console.error("Export Error:", err);
      showNotification("Kesalahan sistem cetak", "error");
    } finally {
      setIsExporting(false);
    }
  };

  if (!userId) return <div className="p-20 text-center font-black opacity-20 tracking-[0.5em]">AUTH REQUIRED</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-10 pb-20 relative px-4">
      
      {/* ELITE TOAST */}
      <AnimatePresence mode="wait">
        {toast.show && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} 
            className={`fixed top-24 right-4 md:right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border bg-white ${toast.type === 'success' ? 'border-emerald-100 text-emerald-600' : 'border-rose-100 text-rose-600'}`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <p className="font-black text-[10px] uppercase tracking-widest">{toast.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter uppercase italic">Laporan <span className="text-emerald-500">Analitik.</span></h2>
          <p className="text-slate-400 font-medium mt-2 italic">Authorized data for: {userData.name || 'User'}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => handleExport('pdf')}
              disabled={isExporting || loading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-2 border-slate-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-50 shadow-sm"
            >
                {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />} PDF
            </button>
            <button 
              onClick={() => handleExport('poster')}
              disabled={isExporting || loading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50"
            >
                {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Share2 size={16} />} POSTER
            </button>
        </div>
      </div>

      {/* AREA CAPTURE */}
      <div ref={reportRef} className="bg-white p-6 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            <div className="lg:col-span-2 bg-slate-50 p-10 rounded-[3rem] border border-slate-100 min-h-[500px]">
              <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Distribution.</h3>
                  <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expenses</p>
                      <p className="text-3xl font-black text-slate-900 italic tracking-tighter">Rp {reportData?.totalExpense?.toLocaleString('id-ID')}</p>
                  </div>
              </div>

              <div className="h-[350px] w-full min-w-0">
                {!loading && reportData?.chartData && reportData.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={reportData.chartData}
                                cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={8}
                                dataKey="value" stroke="none" animationBegin={0}
                            >
                                {reportData.chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: 'bold' }} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                        <p className="text-sm font-medium italic">Tidak ada data pengeluaran ditemukan</p>
                    </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
                <div className="flex items-center gap-2 mb-8">
                    <AlertTriangle size={18} className="text-rose-500" />
                    <h3 className="text-lg font-black tracking-tight uppercase italic text-emerald-400">Leak Radar</h3>
                </div>
                
                <div className="space-y-4">
                    {(reportData?.leaks || []).length > 0 ? reportData.leaks.map((leak, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{leak.category || 'Data'}</p>
                                <p className="font-black text-lg italic tracking-tighter">Rp {leak.amount?.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="h-2 w-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_#f43f5e]" />
                        </div>
                    )) : (
                        <p className="py-10 text-center text-xs font-black uppercase opacity-20 tracking-widest italic">Cleared</p>
                    )}
                </div>
              </div>

              <div className="bg-emerald-500 p-10 rounded-[3rem] text-slate-900 shadow-xl">
                 <h3 className="font-black text-[10px] mb-4 text-emerald-900 tracking-[0.3em] uppercase">Recommendation</h3>
                 <p className="text-emerald-950 text-sm leading-relaxed font-black italic">
                    "Analisis data menunjukkan pola pengeluaranmu stabil. Pertahankan performa ini."
                 </p>
              </div>
            </div>
          </div>
      </div>

      <p className="text-center font-black text-slate-300 text-[8px] uppercase tracking-[1em] opacity-30">ClariFi Systems Intelligence</p>
    </motion.div>
  );
};

export default Reports;