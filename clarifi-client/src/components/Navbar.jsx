import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  Target,
  MessageSquare,
  FileBarChart,
  UserCircle,
} from 'lucide-react';

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'}
      `}
    >
      {icon}
      {label}
    </NavLink>
  );
}

const Navbar = () => {
  const isAuth = Boolean(localStorage.getItem('clarifi_auth'));

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo ClariFi */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl font-mono">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">ClariFi</span>
          </div>

          {/* Menu Navigasi */}
          <div className="hidden md:flex items-center gap-1">
            {isAuth ? (
              <>
                <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                <NavItem to="/transactions" icon={<ReceiptText size={18} />} label="Pemasukan" />
                <NavItem to="/budgets" icon={<Target size={18} />} label="Budgeting" />
                <NavItem to="/reports" icon={<FileBarChart size={18} />} label="Laporan" />

                <NavLink
                  to="/ai-advisor"
                  className={({ isActive }) => `
                    flex items-center gap-2 px-4 py-2 rounded-full ml-4 transition-all duration-300
                    ${isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}
                  `}
                >
                  <MessageSquare size={18} />
                  <span className="font-medium">AI Advisor</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Beranda" />
                <NavItem to="/layanan" icon={<FileBarChart size={18} />} label="Layanan" />
                <NavItem to="/about" icon={<MessageSquare size={18} />} label="Tentang" />
                <NavLink
                  to="/login"
                  className={({ isActive }) => `
                    flex items-center gap-2 px-4 py-2 rounded-full ml-4 transition-all duration-300
                    ${isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}
                  `}
                >
                  <UserCircle size={18} />
                  <span className="font-medium">Masuk</span>
                </NavLink>
              </>
            )}
          </div>

          {/* User Profile Area */}
          <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
            {isAuth ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">User Aktif</p>
                  <p className="text-sm font-bold text-slate-700">Mahasiswa ClariFi</p>
                </div>
                <div
                  className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 cursor-pointer transition-colors"
                  onClick={() => {
                    localStorage.removeItem('clarifi_auth');
                    window.location.reload();
                  }}
                >
                  <UserCircle size={28} />
                </div>
              </>
            ) : (
              <NavLink to="/login" className="text-sm font-medium text-emerald-600">Masuk / Daftar</NavLink>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
