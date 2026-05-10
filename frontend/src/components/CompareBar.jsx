import { useCompare } from '../context/CompareContext';
import { useNavigate } from 'react-router-dom';
import { GitCompare, X, ArrowRight } from 'lucide-react';

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-3 pl-8 flex items-center justify-between shadow-2xl shadow-indigo-500/10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 text-indigo-600">
            <GitCompare size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Compare ({compareList.length}/3)</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-2">
            {compareList.map((c) => (
              <div key={c._id} className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-700">
                <span className="line-clamp-1 max-w-[80px]">{c.name?.split(' ')[0]}</span>
                <button onClick={() => removeFromCompare(c._id)} className="text-slate-400 hover:text-rose-500 transition-colors">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={clearCompare} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
            Clear
          </button>
          <button
            onClick={() => navigate('/compare')}
            disabled={compareList.length < 2}
            className="bg-slate-950 text-white px-6 py-3.5 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg"
          >
            Compare <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

