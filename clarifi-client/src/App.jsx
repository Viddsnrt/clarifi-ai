import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// AUTH PAGES
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AIAdvisor from './pages/AIAdvisor';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';

// GUEST PAGES
import GuestHome from './pages/guest/GuestHome';
import Layanan from './pages/guest/Layanan';
import About from './pages/guest/About';
import Login from './pages/guest/Login';
import Register from './pages/guest/Register';

// 🔥 FEATURE DETAIL PAGE (BARU)
import FeatureDetail from './pages/guest/Features';

function App() {
  const isAuth = Boolean(localStorage.getItem('clarifi_auth'));

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">

        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <Routes>

            {/* ================= AUTH ROUTES ================= */}
            {isAuth ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/ai-advisor" element={<AIAdvisor />} />
                <Route path="/reports" element={<Reports />} />

                {/* optional kalau user login tetap bisa lihat feature */}
                <Route path="/features/:slug" element={<FeatureDetail />} />
              </>
            ) : (
              <>
                {/* ================= GUEST ROUTES ================= */}
                <Route path="/" element={<GuestHome />} />
                <Route path="/layanan" element={<Layanan />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* FEATURE DETAIL (IMPORTANT) */}
                <Route path="/features/:slug" element={<FeatureDetail />} />
              </>
            )}

          </Routes>

        </main>

        <Footer />

      </div>
    </Router>
  );
}

export default App;