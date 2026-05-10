import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSaved, unsaveCollege, getSavedComparisons, unsaveComparison } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { Bookmark, Trash2, MapPin, Star, ArrowRight, TrendingUp, GraduationCap, IndianRupee, Sparkles, GitCompare, Target } from 'lucide-react';
import { Loader, EmptyState } from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Saved() {
  const { user } = useAuth();
  const { setCompareList } = useCompare();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSaved(), getSavedComparisons()])
      .then(([colRes, compRes]) => {
        setColleges(colRes.data.data);
        setComparisons(compRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemoveCollege = async (id) => {
    try {
      await unsaveCollege(id);
      setColleges((prev) => prev.filter((c) => c._id !== id));
      toast('Removed from saved', { icon: '🗑️' });
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handleRemoveComparison = async (id) => {
    try {
      await unsaveComparison(id);
      setComparisons((prev) => prev.filter((c) => c._id !== id));
      toast('Comparison removed', { icon: '🗑️' });
    } catch {
      toast.error('Failed to remove comparison');
    }
  };

  const loadComparison = (comp) => {
    setCompareList(comp.colleges);
    navigate('/compare');
  };

  if (loading) return <Loader text="Retrieving your collection..." />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Premium Header */}
      <div className="relative pt-32 pb-20 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] -mr-64 -mt-64 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[100px] -ml-64 -mb-64 rounded-full" />
        
        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm w-fit">
              <Sparkles size={12} /> My Personal Collection
            </div>
            <div className="flex items-end justify-between gap-8">
              <div>
                <h1 className="text-4xl md:text-7xl font-black text-slate-950 tracking-tighter leading-none mb-4">Saved Institutions</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                  <Bookmark size={14} className="text-indigo-500" /> {colleges.length} PREMIUM SELECTIONS IN YOUR LIST
                </p>
              </div>
              <Link to="/colleges" className="hidden md:flex h-14 items-center gap-3 px-8 rounded-2xl bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm">
                Explore More <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 mt-16">
        {colleges.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] py-32 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-200/50">
              <Bookmark size={36} className="text-slate-300" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Your collection is empty</h2>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
              Start building your future by saving top-tier institutions you're interested in.
            </p>
            <Link to="/colleges" className="inline-flex h-16 items-center gap-3 px-10 rounded-[2rem] bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-600/20">
              Discover Colleges <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence mode="popLayout">
              {colleges.map((c) => {
                return (
                  <motion.div 
                    key={c._id}
                    layout
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:border-indigo-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all flex flex-col"
                  >
                    {/* Card Image Header */}
                    <div className="relative h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
                      {c.image ? (
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <GraduationCap size={48} className="text-slate-300 group-hover:scale-110 transition-transform duration-700" />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                      <button 
                        onClick={() => handleRemoveCollege(c._id)}
                        className="absolute top-6 right-6 w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center justify-center hover:bg-rose-500 hover:border-rose-500 transition-all shadow-xl"
                        title="Remove from saved"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 text-white/90 text-[9px] font-black uppercase tracking-widest mb-1">
                          <MapPin size={10} className="text-indigo-400" /> {c.city}
                        </div>
                        <h3 className="text-white text-xl font-black leading-tight tracking-tight line-clamp-1">{c.name}</h3>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-8 flex flex-col flex-1 gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <IndianRupee size={10} /> Annual Fees
                          </div>
                          <div className="text-sm font-black text-slate-900">
                            {c.fees?.min ? `₹${(c.fees.min/100000).toFixed(1)}L` : 'N/A'}
                          </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-amber-50/50 group-hover:border-amber-100 transition-colors">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <Star size={10} className="text-amber-500" fill="currentColor" /> Rating
                          </div>
                          <div className="text-sm font-black text-slate-900">
                            {c.rating?.toFixed(1) || '0.0'} / 5.0
                          </div>
                        </div>
                      </div>

                      {c.placement?.placementRate && (
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                              <TrendingUp size={14} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Placements</span>
                          </div>
                          <span className="text-xs font-black text-emerald-600">{c.placement.placementRate}% Success</span>
                        </div>
                      )}

                      {c.cutoffs?.[0] && (
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                              <Target size={14} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{c.cutoffs[0].exam} Cutoff</span>
                          </div>
                          <span className="text-xs font-black text-indigo-600">{c.cutoffs[0].rank}</span>
                        </div>
                      )}

                      <div className="mt-auto flex gap-3 pt-2">
                        <Link 
                          to={`/colleges/${c._id}`} 
                          className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10"
                        >
                          View Full Details <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {comparisons.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Saved Comparisons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparisons.map((comp) => (
                <div key={comp._id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <GitCompare size={20} />
                      </div>
                      <h3 className="font-black text-lg text-slate-900">{comp.name}</h3>
                    </div>
                    <button onClick={() => handleRemoveComparison(comp._id)} className="text-slate-400 hover:text-rose-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="text-xs font-bold text-slate-500 mb-6">
                    {comp.colleges.map(c => c.name).join(' vs ')}
                  </div>
                  <button onClick={() => loadComparison(comp)} className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-100 transition-colors flex justify-center items-center gap-2">
                    Open Comparison <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
