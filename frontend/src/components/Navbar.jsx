import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, Bookmark, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { compareList } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/colleges', label: 'Colleges' },
    { to: '/predictor', label: 'Predictor' },
    { to: '/qna', label: 'Q&A' },
    { to: '/compare', label: 'Compare', badge: compareList.length || null },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Dashboard' }] : []),
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass border-b border-slate-200/60 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-black text-2xl group tracking-tighter">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30"
            >
              <GraduationCap size={22} className="text-white" />
            </motion.div>
            <span className="gradient-text">CollegeFinder</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 group ${
                  isActive(link.to) ? 'text-indigo-700' : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                {isActive(link.to) && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-indigo-600/10 rounded-xl border border-indigo-600/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
                {link.badge > 0 && (
                  <span className="relative z-10 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/saved" className="text-slate-500 hover:text-indigo-500 transition-colors p-2 hover:bg-slate-100 rounded-xl" title="Saved">
                  <Bookmark size={20} />
                </Link>
                <div className="h-6 w-[1px] bg-slate-200 mx-1" />
                <div className="flex items-center gap-4 pl-2">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black text-slate-900 leading-none tracking-tight">{user?.name}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user?.role}</span>
                  </div>
                  <button onClick={handleLogout} className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-200">
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Login</Link>
                <Link to="/register" className="px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl bg-linear-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-slate-100"
            >
              <div className="py-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all border ${
                      isActive(link.to) ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'text-slate-600 border-transparent'
                    }`}
                  >
                    {link.label}
                    {link.badge > 0 && (
                      <span className="w-6 h-6 rounded-full text-xs flex items-center justify-center bg-indigo-500 text-white font-black">{link.badge}</span>
                    )}
                  </Link>
                ))}
                
                <div className="h-[1px] bg-slate-100 my-6" />
                
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2 px-2">
                    <Link to="/saved" onClick={() => setMobileOpen(false)} className="flex items-center gap-4 px-6 py-4 text-slate-600 font-black uppercase tracking-widest text-xs">
                      <Bookmark size={20} className="text-indigo-500" /> Saved Colleges
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 text-rose-500 font-black uppercase tracking-widest text-xs w-full text-left">
                      <LogOut size={20} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 px-2 pt-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="px-6 py-4 text-sm font-black uppercase tracking-widest text-slate-500 text-center">Login</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="px-6 py-5 text-sm font-black uppercase tracking-widest rounded-2xl bg-linear-to-r from-primary to-accent text-white text-center shadow-xl shadow-primary/20">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>


  );
}

