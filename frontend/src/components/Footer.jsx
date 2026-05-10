import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50/80 backdrop-blur-xl border-t border-slate-200/60 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 font-black text-2xl mb-6 tracking-tighter">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20">
                <GraduationCap size={22} className="text-white" />
              </div>
              <span className="gradient-text">CollegeFinder</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm font-medium">
              India's most trusted college discovery platform. Find, compare, and shortlist your dream college with real data.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-950 mb-6">Explore</h4>
            <div className="flex flex-col gap-4">
              {[['/', 'Home'], ['/colleges', 'All Colleges'], ['/compare', 'Compare Colleges']].map(([to, label]) => (
                <Link key={to} to={to} className="text-sm font-bold text-slate-600 transition-all hover:text-indigo-600">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-950 mb-6">Account</h4>
            <div className="flex flex-col gap-4">
              {[['/login', 'Login'], ['/register', 'Sign Up'], ['/saved', 'Saved Colleges']].map(([to, label]) => (
                <Link key={to} to={to} className="text-sm font-bold text-slate-600 transition-all hover:text-indigo-600">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="h-[1px] bg-slate-200/60 w-full mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            © {new Date().getFullYear()} CollegeFinder. Built with ❤️ for students.
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Data sourced from public university records.
          </p>
        </div>
      </div>
    </footer>

  );
}
