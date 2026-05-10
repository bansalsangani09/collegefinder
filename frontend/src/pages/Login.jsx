import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api';
import { LogIn, Eye, EyeOff, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await loginApi(form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/colleges');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-bg-dark relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] -mr-64 -mt-64 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] -ml-64 -mb-64 rounded-full" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 bg-linear-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/40"
          >
            <GraduationCap size={32} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tighter">Welcome back</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Login to access your saved colleges</p>
        </div>

        <div className="glass-card p-10 border border-slate-200 bg-white shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Email Address</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ring-indigo-500/50 transition-all font-medium" 
                type="email" 
                placeholder="you@example.com"
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
              {errors.email && <p className="text-[10px] font-bold text-rose-400 mt-2 ml-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Password</label>
              <div className="relative">
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ring-indigo-500/50 transition-all font-medium pr-12" 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={form.password} 
                  onChange={(e) => setForm({ ...form, password: e.target.value })} 
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] font-bold text-rose-400 mt-2 ml-1">{errors.password}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="mt-2 w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-accent text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>

          <p className="text-center text-xs font-bold mt-8 text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">Create account</Link>
          </p>
        </div>
      </div>
    </div>

  );
}
