import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple demo auth: set localStorage flag
    localStorage.setItem('clarifi_auth', '1');
    // In real app, call backend and store token securely
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-3xl p-8">
      <h2 className="text-2xl font-bold mb-4">Masuk ke Clarifi</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold">Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="w-full mt-2 p-3 rounded-xl border border-slate-200" />
        </div>

        <div>
          <label className="text-sm font-semibold">Kata Sandi</label>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required className="w-full mt-2 p-3 rounded-xl border border-slate-200" />
        </div>

        <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold">Masuk</button>
      </form>
    </div>
  );
};

export default Login;
