import { Link } from 'react-router-dom';
import { MapPin, IndianRupee, Star, GitCompare, Bookmark, BookmarkCheck, TrendingUp, GraduationCap, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { saveCollege, unsaveCollege } from '../api';
import { useState } from 'react';
import toast from 'react-hot-toast';

function getTypeClass(type) {
  const map = { Government: 'badge-government', Private: 'badge-private', Deemed: 'badge-deemed', Autonomous: 'badge-autonomous' };
  return map[type] || 'badge-private';
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={13} fill="#f59e0b" color="#f59e0b" />
      <span className="text-sm font-semibold" style={{ color: '#f59e0b' }}>{rating?.toFixed(1)}</span>
    </div>
  );
}

export default function CollegeCard({ college, savedIds = [], onSaveToggle }) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { isAuthenticated } = useAuth();
  const [savePending, setSavePending] = useState(false);

  const inCompare = isInCompare(college._id);
  const isSaved = savedIds.includes(college._id);

  const handleCompare = () => {
    if (inCompare) {
      removeFromCompare(college._id);
      toast('Removed from compare', { icon: '➖' });
    } else {
      const added = addToCompare(college);
      if (!added) toast.error('You can compare up to 3 colleges at a time');
      else toast.success('Added to compare');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) { toast.error('Please login to save colleges'); return; }
    setSavePending(true);
    try {
      if (isSaved) {
        await unsaveCollege(college._id);
        toast('Removed from saved', { icon: '🗑️' });
      } else {
        await saveCollege(college._id);
        toast.success('College saved!');
      }
      if (onSaveToggle) onSaveToggle(college._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSavePending(false);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="glass-card overflow-hidden flex flex-col h-full group hover:border-indigo-500/40 transition-all duration-500 bg-white shadow-sm hover:shadow-xl"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-slate-100 flex items-center justify-center">
        {college.image ? (
          <img 
            src={college.image} 
            alt={college.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          />
        ) : (
          <GraduationCap size={64} className="text-slate-300 transition-transform duration-1000 group-hover:scale-110" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md border shadow-2xl ${
            college.type === 'Government' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            college.type === 'Private' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
            'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {college.type}
          </span>
        </div>
        
        {college.ranking && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest glass text-amber-500 border-amber-500/20">
            <TrendingUp size={12} /> #{college.ranking}
          </div>
        )}

        <div className="absolute bottom-4 left-5 right-5">
           <div className="flex items-center gap-1.5 text-slate-200">
            <MapPin size={12} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">{college.city}, {college.state}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1 gap-5">
        <div>
          <Link to={`/colleges/${college._id}`}>
            <h3 className="font-black text-xl leading-tight text-slate-950 group-hover:text-indigo-700 transition-colors line-clamp-2 tracking-tight">
              {college.name}
            </h3>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100 group-hover:bg-indigo-50 transition-colors">
            <div className="text-[9px] text-slate-700 font-black uppercase tracking-[0.1em] mb-1">Fees</div>
            <div className="text-sm font-black text-slate-950">
              {college.fees?.min ? `₹${(college.fees.min / 100000).toFixed(1)}L` : 'N/A'}
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100 group-hover:bg-indigo-50 transition-colors">
            <div className="text-[9px] text-slate-700 font-black uppercase tracking-[0.1em] mb-1">Rating</div>
            <Stars rating={college.rating} />
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100 group-hover:bg-indigo-50 transition-colors">
            <div className="text-[9px] text-slate-700 font-black uppercase tracking-[0.1em] mb-1">Placed</div>
            <div className="text-sm font-black text-emerald-700">
              {college.placement?.placementRate ? `${college.placement.placementRate}%` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {college.tags?.slice(0, 3).map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-[9px] font-black uppercase tracking-widest text-indigo-700 border border-indigo-100">
              {t}
            </span>
          ))}
        </div>
        
        {college.cutoffs?.[0] && (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50/80 px-3 py-2.5 rounded-xl border border-dashed border-slate-200 group-hover:border-indigo-200 transition-colors">
            <Target size={12} className="text-indigo-500" />
            <span>{college.cutoffs[0].exam} Cutoff: <span className="text-indigo-600 font-bold">{college.cutoffs[0].rank}</span></span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto pt-5 border-t border-slate-100">
          <Link to={`/colleges/${college._id}`} className="flex-1 h-11 flex items-center justify-center rounded-xl bg-linear-to-r from-primary to-accent text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-95">
            View Details
          </Link>
          <button 
            onClick={handleCompare} 
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all border ${
              inCompare ? 'bg-indigo-100 border-indigo-300 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200'
            }`}
          >
            <GitCompare size={18} />
          </button>
          <button 
            onClick={handleSave} 
            disabled={savePending}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all border ${
              isSaved ? 'bg-amber-100 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-200'
            }`}
            title={isSaved ? "Remove from saved" : "Save college"}
          >
            {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
      </div>
    </motion.div>


  );
}
