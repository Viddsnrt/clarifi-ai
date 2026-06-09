import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Sparkles, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Panggil API Login ke Backend
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });

      // 2. Simpan Token dan Data User ke LocalStorage
      localStorage.setItem('clarifi_auth', res.data.token);
      localStorage.setItem('clarifi_user', JSON.stringify(res.data.user));

      // 3. Redirect ke Dashboard
      // Menggunakan window.location agar App.jsx melakukan re-mount dan membaca status Auth terbaru
      window.location.href = "/";
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login Gagal. Periksa email dan password kamu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 page-transition">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-100">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Selamat Datang</h2>
          <p className="text-slate-500 font-medium mt-1">Masuk untuk mengelola keuanganmu.</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-widest">Alamat Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                required 
                className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                placeholder="joni@email.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-widest">Kata Sandi</label>
            <div className="relative mt-1">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                required 
                className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Sparkles size={20} />
                MASUK SEKARANG
              </>
            )}
          </button>
        </form>

        {/* FOOTER MODAL */}
        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Belum punya akun ClariFi? <br/>
              <Link to="/register" className="text-emerald-600 font-black hover:underline italic">
                Daftar Gratis di Sini
              </Link>
            </p>
        </div>
      </div>
      
      <p className="text-center mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        &copy; 2026 ClariFi — Secure Financial Systems
      </p>
    </div>
  );
};

export default Login;