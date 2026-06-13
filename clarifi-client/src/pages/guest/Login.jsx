import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api'; // Import URL Railway
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Sparkles, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // MENGGUNAKAN API_BASE_URL RAILWAY
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { 
        email, 
        password 
      });

      localStorage.setItem('clarifi_auth', res.data.token);
      localStorage.setItem('clarifi_user', JSON.stringify(res.data.user));

      // Redirect dan refresh untuk mengaktifkan isAuth di App.jsx
      window.location.href = "/";
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login Gagal. Cek email dan password kamu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 page-transition">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Authorized Access</h2>
          <p className="text-slate-500 font-medium mt-1">Masuk ke enkripsi data finansialmu.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[0.2em]">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required 
                className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                placeholder="name@mail.com"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[0.2em]">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required 
                className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} /> SIGN IN</>}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              Belum terdaftar? <Link to="/register" className="text-emerald-600 font-black hover:underline italic">Create Account</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;