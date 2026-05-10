import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { Loader, EmptyState } from '../components/Loader';
import { Plus, Edit, Trash2, LayoutDashboard, Building2, MapPin, ExternalLink, MessageSquare, Star, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [colleges, setColleges] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('institutions');

  const fetchData = async () => {
    try {
      const [collegesRes, reviewsRes] = await Promise.all([
        api.get('/admin/colleges'),
        api.get('/admin/reviews')
      ]);
      setColleges(collegesRes.data.data);
      setReviews(reviewsRes.data.data);
    } catch (err) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteCollege = async (id) => {
    if (!window.confirm('Are you sure you want to delete this college?')) return;
    try {
      await api.delete(`/admin/colleges/${id}`);
      setColleges(colleges.filter((c) => c._id !== id));
      toast.success('College deleted successfully');
    } catch (err) {
      toast.error('Failed to delete college');
    }
  };

  const handleDeleteReview = async (collegeId, reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/colleges/${collegeId}/reviews/${reviewId}`);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      toast.success('Review removed');
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <Loader text="Loading admin panel..." />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="py-32 bg-bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-950 tracking-tighter">Admin Console</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Total {colleges.length} institutions in database</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button 
                onClick={() => setActiveTab('institutions')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'institutions' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Institutions
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'reviews' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Moderation
              </button>
            </div>
            <Link to="/admin/add" className="w-full md:w-auto h-12 flex items-center justify-center gap-3 px-8 rounded-xl bg-linear-to-r from-primary to-accent text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all">
              <Plus size={16} /> Add New
            </Link>
          </div>
        </motion.div>

        {activeTab === 'institutions' ? (
          colleges.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState icon={Building2} title="No institutions listed" description="Start by adding a new college to the platform database." />
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="glass-card overflow-hidden border border-slate-200 shadow-2xl bg-white"
            >
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Institution Details</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Location</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {colleges.map((c) => (
                      <motion.tr 
                        key={c._id} 
                        variants={itemVariants}
                        className="group hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-8 py-6 min-w-[300px]">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg flex-shrink-0">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight line-clamp-1">{c.name}</div>
                              <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.15em] mt-1">{c.ranking ? `NIRF #${c.ranking}` : 'UNRANKED'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <MapPin size={14} className="text-indigo-400" />
                            {c.city}, {c.state}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                            c.type === 'Government' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            c.type === 'Private' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                            'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {c.type}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex gap-3 justify-end">
                            <Link to={`/colleges/${c._id}`} target="_blank" className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-indigo-600 transition-all">
                              <ExternalLink size={16} />
                            </Link>
                            <Link to={`/admin/edit/${c._id}`} className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                              <Edit size={16} />
                            </Link>
                            <button onClick={() => handleDeleteCollege(c._id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.length === 0 ? (
              <div className="md:col-span-2">
                <EmptyState icon={MessageSquare} title="No reviews yet" description="Moderation list is empty." />
              </div>
            ) : reviews.map((r) => (
              <motion.div 
                key={r._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative group"
              >
                <button 
                  onClick={() => handleDeleteReview(r.collegeId, r._id)}
                  className="absolute top-6 right-6 p-2 rounded-lg bg-rose-50 text-rose-500 transition-all hover:bg-rose-500 hover:text-white"
                >
                  <Trash2 size={14} />
                </button>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">
                    {(r.author || 'U').charAt(0)}
                  </div>
                  <div>
                    <div className="font-black text-slate-900 leading-none">{r.author || 'Anonymous'}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => <Star key={s} size={10} fill={s <= r.rating ? '#f59e0b' : 'transparent'} color="#f59e0b" />)}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                        <Clock size={10} /> {new Date(r.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6 italic">"{r.comment}"</p>
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <Building2 size={12} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{r.collegeName}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
