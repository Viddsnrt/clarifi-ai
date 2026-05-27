import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ReceiptText, 
  Target, 
  MessageSquare, 
  FileBarChart, 
  UserCircle 
} from 'lucide-react';

// Import Halaman Asli
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions'; 
import AIAdvisor from './pages/AIAdvisor';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        
        {/* --- NAVBAR HORIZONTAL --- */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              
              {/* Logo ClariFi */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl font-mono">C</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  ClariFi
                </span>
              </div>

              {/* Menu Navigasi */}
              <div className="hidden md:flex items-center gap-1">
                <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                <NavItem to="/transactions" icon={<ReceiptText size={18} />} label="Transaksi" />
                <NavItem to="/budgets" icon={<Target size={18} />} label="Budgeting" />
                <NavItem to="/reports" icon={<FileBarChart size={18} />} label="Laporan" />
                
                {/* AI Advisor Button (Highlight) */}
                <NavLink 
                  to="/ai-advisor"
                  className={({ isActive }) => `
                    flex items-center gap-2 px-4 py-2 rounded-full ml-4 transition-all duration-300
                    ${isActive 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}
                  `}
                >
                  <MessageSquare size={18} />
                  <span className="font-medium">AI Advisor</span>
                </NavLink>
              </div>

              {/* User Profile Area */}
              <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">User Aktif</p>
                  <p className="text-sm font-bold text-slate-700">Mahasiswa ClariFi</p>
                </div>
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 cursor-pointer transition-colors">
                  <UserCircle size={28} />
                </div>
              </div>

            </div>
          </div>
        </nav>

        {/* --- AREA KONTEN UTAMA --- */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
           <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/ai-advisor" element={<AIAdvisor />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>

        {/* Footer Sederhana */}
        <footer className="py-8 text-center text-slate-400 text-xs border-t border-slate-100 mt-12">
          &copy; 2026 ClariFi AI — Innovating Digital Finance
        </footer>
      </div>
    </Router>
  );
}

// Komponen Pembantu NavItem
function NavItem({ to, icon, label }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive 
          ? 'text-emerald-600 bg-emerald-50' 
          : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'}
      `}
    >
      {icon}
      {label}
    </NavLink>
  );
}

export default App;