import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registrasi Berhasil! Silakan Login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Gagal Registrasi");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UserPlus size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Daftar ClariFi</h2>
        <p className="text-slate-500 text-sm">Mulai kelola keuanganmu sekarang.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-400" size={20} />
            <input type="text" required className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Joni ClariFi" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
            <input type="email" required className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="joni@gmail.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input type="password" required className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
        </div>
        <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 uppercase tracking-widest">Daftar Sekarang</button>
      </form>
      
      <p className="mt-8 text-center text-sm text-slate-500">
        Sudah punya akun? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Login di sini</Link>
      </p>
    </div>
  );
};

export default Register;