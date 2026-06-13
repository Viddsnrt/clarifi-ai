import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api'; // Import URL Railway
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Loader2, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Password tidak cocok!");
    
    setLoading(true);
    try {
      // MENGGUNAKAN API_BASE_URL RAILWAY
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      alert("Registrasi Berhasil! Silakan Login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Gagal Registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 page-transition">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">New Identity</h2>
          <p className="text-slate-500 font-medium mt-1">Gabung untuk transparansi finansial.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[0.2em]">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" required value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                placeholder="David ClariFi"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[0.2em]">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="email" required value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                placeholder="david@mail.com"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[0.2em]">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="password" required value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[0.2em]">Verify Password</label>
            <div className="relative mt-1">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="password" required value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
          Sudah punya akun? <Link to="/login" className="text-emerald-600 font-black hover:underline italic ml-1">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;