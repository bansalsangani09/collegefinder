import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { compareColleges, saveComparison } from '../api';
import { Loader, EmptyState } from '../components/Loader';
import { GitCompare, X, ArrowRight, Check, Minus, GraduationCap, Award, MapPin, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ROWS = [
  { label: 'Location', key: (c) => c.location, icon: MapPin },
  { label: 'Institution Type', key: (c) => c.type, icon: Award },
  { label: 'NIRF Ranking', key: (c) => c.ranking ? `#${c.ranking}` : 'N/A' },
  { label: 'Overall Rating', key: (c) => c.rating ? `${c.rating} / 5.0` : 'N/A' },
  { label: 'Annual Fees (Min)', key: (c) => c.fees?.min ? `₹${(c.fees.min / 100000).toFixed(1)}L` : 'N/A' },
  { label: 'Annual Fees (Max)', key: (c) => c.fees?.max ? `₹${(c.fees.max / 100000).toFixed(1)}L` : 'N/A' },
  { label: 'Placement Rate', key: (c) => c.placement?.placementRate ? `${c.placement.placementRate}%` : 'N/A' },
  { label: 'Avg Package', key: (c) => c.placement?.averagePackage ? `₹${c.placement.averagePackage} LPA` : 'N/A' },
  { label: 'Highest Package', key: (c) => c.placement?.highestPackage ? `₹${c.placement.highestPackage} LPA` : 'N/A' },
];

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (compareList.length < 2) { setData([]); return; }
    setLoading(true);
    compareColleges(compareList.map((c) => c._id))
      .then((res) => setData(res.data.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [compareList]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save comparisons.');
      return;
    }
    setSaving(true);
    try {
      await saveComparison(compareList.map((c) => c._id), 'My Custom Comparison');
      toast.success('Comparison saved successfully!');
    } catch (err) {
      toast.error('Failed to save comparison.');
    } finally {
      setSaving(false);
    }
  };

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <GitCompare size={40} className="text-slate-300" />
          </div>
          <h1 className="text-3xl font-black text-slate-950 tracking-tighter mb-4">No Comparison</h1>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            Go to the discovery page and select up to 3 institutions to view side-by-side performance metrics.
          </p>
          <Link to="/colleges" className="inline-flex items-center gap-3 bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
            Find Institutions <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (compareList.length === 1) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-50 p-12 rounded-[3rem] border border-slate-100 text-center shadow-sm">
          <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center mx-auto mb-8 shadow-sm border border-slate-100 text-indigo-600">
            <GitCompare size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-950 mb-3 tracking-tight">One more to go!</h2>
          <p className="text-slate-500 text-sm font-medium mb-10">Select at least one more institution to unlock side-by-side analysis.</p>
          <Link to="/colleges" className="inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-950 transition-all shadow-xl shadow-indigo-200">
            Add More <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-[2px] bg-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Comparison</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter leading-none mb-4">Institutional Analysis</h1>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] bg-slate-50 px-4 py-2 rounded-lg w-fit border border-slate-100">
              Analyzing {compareList.length} global institutions
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button onClick={handleSave} disabled={saving} className="px-6 py-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all shadow-sm flex items-center gap-2">
              <Bookmark size={14} /> {saving ? 'Saving...' : 'Save Comparison'}
            </button>
            <Link to="/colleges" className="px-6 py-4 rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">
              Add More
            </Link>
            <button onClick={clearCompare} className="px-6 py-4 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all">
              Clear All
            </button>
          </div>
        </header>

        {loading ? <Loader text="Synchronizing institutional data..." /> : (
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-r border-slate-100 min-w-[200px]">Metrics & Features</th>
                    {data.map((c) => (
                      <th key={c._id} className="px-10 py-12 min-w-[300px] border-r border-slate-100 last:border-r-0 relative group">
                        <button
                          onClick={() => removeFromCompare(c._id)}
                          className="absolute top-6 right-6 p-2 rounded-xl text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X size={16} />
                        </button>
                        <div className="flex flex-col gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                            <GraduationCap size={24} className="text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-slate-950 tracking-tight leading-tight line-clamp-2">{c.name}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{c.city}, {c.state}</p>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ROWS.map(({ label, key, icon: Icon }) => (
                    <tr key={label} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-8 border-r border-slate-100 bg-slate-50/30">
                        <div className="flex items-center gap-3">
                          {Icon && <Icon size={14} className="text-indigo-400" />}
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</span>
                        </div>
                      </td>
                      {data.map((c) => (
                        <td key={c._id} className="px-10 py-8 border-r border-slate-100 last:border-r-0">
                          <span className="text-sm font-black text-slate-900">{key(c)}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="px-10 py-12 border-r border-slate-100 bg-slate-50/30"></td>
                    {data.map((c) => (
                      <td key={c._id} className="px-10 py-12 border-r border-slate-100 last:border-r-0">
                        <Link
                          to={`/colleges/${c._id}`}
                          className="w-full h-14 flex items-center justify-center gap-2 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/20"
                        >
                          View Full Specs <ArrowRight size={14} />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

