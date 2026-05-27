import React, { useEffect, useState, useRef } from 'react'; // Tambah useRef
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertTriangle, Download, Zap, Share2, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null); // Ref untuk area yang akan dicetak

  useEffect(() => {
    axios.get('http://localhost:5000/api/reports/summary')
      .then(res => {
        setReportData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil laporan:", err);
        setLoading(false);
      });
  }, []);

 const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      const element = reportRef.current;
      
      // Pengaturan html2canvas yang lebih stabil
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: "#f8fafc", // Warna bg solid agar tidak error
        removeContainer: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Kalkulasi agar gambar pas di A4
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Laporan_ClariFi.pdf`);
    } catch (error) {
      // Menampilkan error asli di console untuk debug
      console.error("Detail Error PDF:", error);
      alert("Terjadi kesalahan teknis saat membuat PDF. Pastikan browser mendukung.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSharePoster = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: "#f8fafc"
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ClariFi_Poster.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Detail Error Poster:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse font-bold text-slate-400 text-xl font-mono uppercase tracking-tighter">Menganalisis Kebocoran Kas...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 page-transition pb-20">
      
      {/* HEADER - Tidak ikut di-export agar rapi */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">Laporan Finansial</h2>
          <p className="text-slate-500 font-medium">Data jujur untuk masa depan yang lebih terencana.</p>
        </div>
        <div className="flex gap-3">
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
            >
                {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} 
                Export PDF
            </button>
            <button 
              onClick={handleSharePoster}
              disabled={isExporting}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl text-sm font-black hover:bg-emerald-600 transition shadow-xl shadow-slate-200 disabled:opacity-50"
            >
                {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Share2 size={18} />} 
                Share Poster
            </button>
        </div>
      </div>

      {/* AREA YANG DI-EXPORT (MENGGUNAKAN REF) */}
      <div ref={reportRef} className="p-4 rounded-[3rem]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* DONUT CHART */}
            <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[450px]">
              <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tighter">
                    <Zap className="text-emerald-500" size={24} strokeWidth={3} /> Alokasi Dana
                  </h3>
                  <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pengeluaran</p>
                      <p className="text-xl font-black text-slate-800 italic">Rp {reportData?.totalExpense?.toLocaleString()}</p>
                  </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData?.chartData || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                    >
                      {(reportData?.chartData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', fontWeight: 'bold' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI SIDEBAR */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-rose-100 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                        <AlertTriangle size={20} fill="white" className="text-rose-600" />
                        <h3 className="text-lg font-black tracking-tight uppercase">Leak Detector</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {(reportData?.leaks || []).map((leak, idx) => (
                           // SESUDAH (Warna solid transparan, aman diproses):
<div className="bg-rose-400/30 p-4 rounded-3xl flex justify-between items-center border border-white/20">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{leak.note || 'Transaksi'}</p>
                                    <p className="font-black text-lg italic">Rp {leak.amount?.toLocaleString()}</p>
                                </div>
                                <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/20">
                       <p className="text-[10px] font-bold text-rose-100 leading-relaxed uppercase tracking-tighter">
                         AI menganalisis ini sebagai kebocoran dana pasif yang bisa dihemat.
                       </p>
                    </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl group">
                 <h3 className="font-black text-sm mb-3 text-emerald-400 tracking-[0.3em] uppercase">Rekomendasi</h3>
                 <p className="text-slate-300 text-sm leading-relaxed font-medium font-serif italic">
                    "Kurangi pengeluaran di kategori Tersier sebesar 15% untuk mempercepat target tabunganmu hingga 2 bulan."
                 </p>
              </div>
            </div>

          </div>
      </div>
    </div>
  );
};

export default Reports;