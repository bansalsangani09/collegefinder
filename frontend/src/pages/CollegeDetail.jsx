import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, TrendingUp, Building2, Calendar, BookOpen, Bookmark, BookmarkCheck, GitCompare, ArrowLeft, IndianRupee, Users, Award, Trash2, Send, MessageSquare, GraduationCap, Target } from 'lucide-react';
import { getCollege, addReview, deleteReview, saveCollege, unsaveCollege, getSaved } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { Loader } from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TABS = ['Overview', 'Courses', 'Cutoffs', 'Placements', 'Reviews'];

function getTypeClass(type) {
  const map = { Government: 'badge-government', Private: 'badge-private', Deemed: 'badge-deemed', Autonomous: 'badge-autonomous' };
  return map[type] || 'badge-private';
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={16} fill={i <= Math.round(rating) ? '#f59e0b' : 'transparent'} color="#f59e0b" />
      ))}
      <span className="ml-1 font-bold">{rating?.toFixed(1)}</span>
    </div>
  );
}

export default function CollegeDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Overview');
  const [isSaved, setIsSaved] = useState(false);
  const [savePending, setSavePending] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewPending, setReviewPending] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCollege(id).then((res) => setCollege(res.data.data)).catch(() => { }).finally(() => setLoading(false));
    if (isAuthenticated) {
      getSaved().then((res) => {
        setIsSaved(res.data.data.some((c) => c._id === id));
      }).catch(() => { });
    }
  }, [id, isAuthenticated]);

  const handleSave = async () => {
    if (!isAuthenticated) { toast.error('Please login to save colleges'); return; }
    setSavePending(true);
    try {
      if (isSaved) { await unsaveCollege(id); setIsSaved(false); toast('Removed from saved', { icon: '🗑️' }); }
      else { await saveCollege(id); setIsSaved(true); toast.success('College saved!'); }
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSavePending(false); }
  };

  const handleCompare = () => {
    if (isInCompare(id)) { removeFromCompare(id); toast('Removed from compare', { icon: '➖' }); }
    else {
      const added = addToCompare(college);
      if (!added) toast.error('You can compare up to 3 colleges');
      else toast.success('Added to compare');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to post a review'); return; }
    if (!reviewForm.comment.trim()) { toast.error('Comment cannot be empty'); return; }

    setReviewPending(true);
    try {
      const res = await addReview(id, reviewForm);
      setCollege({ ...college, reviews: res.data.data, rating: res.data.averageRating });
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review posted successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post review');
    } finally {
      setReviewPending(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await deleteReview(id, reviewId);
      setCollege({ ...college, reviews: res.data.data, rating: res.data.averageRating });
      toast.success('Review deleted');
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <Loader text="Loading college details..." />;
  if (!college) return (
    <div className="section page-container text-center">
      <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>College not found</h2>
      <Link to="/colleges" className="btn-primary">← Back to Colleges</Link>
    </div>
  );

  const inCompare = isInCompare(id);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center overflow-hidden">
          {college.image ? (
            <img
              src={college.image}
              alt={college.name}
              className="w-full h-[120%] object-cover opacity-40 scale-105"
            />
          ) : (
            <GraduationCap size={120} className="text-slate-800 opacity-40" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-[1600px] mx-auto px-6 w-full pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link to="/colleges" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] mb-8 text-slate-600 hover:text-indigo-600 transition-colors bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-200 shadow-sm">
                <ArrowLeft size={14} /> Back to Discovery
              </Link>

              <div className="flex flex-wrap items-end justify-between gap-8">
                <div className="flex-1 min-w-[300px]">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${college.type === 'Government' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        college.type === 'Private' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                          'bg-amber-50 text-amber-600 border-amber-200'
                      }`}>
                      {college.type}
                    </span>
                    {college.ranking && (
                      <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200 shadow-sm flex items-center gap-1.5">
                        <Award size={14} /> NIRF #{college.ranking}
                      </span>
                    )}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none drop-shadow-2xl">{college.name}</h1>
                  <div className="flex flex-wrap items-center gap-8 text-white/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                        <MapPin size={16} className="text-white" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">{college.location}</span>
                    </div>
                    {college.established && (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                          <Calendar size={16} className="text-white" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Est. {college.established}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={handleCompare}
                    className={`h-16 px-10 rounded-[2rem] flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all border ${inCompare ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-600/30' : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-400 shadow-sm'
                      }`}
                  >
                    <GitCompare size={20} /> {inCompare ? 'Comparing' : 'Compare'}
                  </button>
                  <button onClick={handleSave} disabled={savePending}
                    className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all border ${
                      isSaved 
                        ? 'bg-amber-100 border-amber-300 text-amber-600 shadow-xl scale-110' 
                        : 'bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 shadow-sm'
                    }`}
                    title={isSaved ? "Remove from saved" : "Save college"}
                  >
                    {isSaved ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 mt-16">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { icon: IndianRupee, label: 'Min Fees', value: college.fees?.min ? `₹${(college.fees.min / 100000).toFixed(1)}L` : 'N/A', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { icon: Star, label: 'Rating', value: <Stars rating={college.rating} />, color: 'text-amber-600', bg: 'bg-amber-50' },
            { icon: TrendingUp, label: 'Placement', value: college.placement?.placementRate ? `${college.placement.placementRate}%` : 'N/A', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: Users, label: 'Avg Package', value: college.placement?.averagePackage ? `₹${college.placement.averagePackage} LPA` : 'N/A', color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center group hover:border-indigo-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all">
              <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center mb-6 border border-transparent group-hover:scale-110 transition-transform ${color}`}>
                <Icon size={28} />
              </div>
              <div className="text-3xl font-black text-slate-950 mb-2">{value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-12 border-b border-slate-100">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                tab === t ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'
              }`}>
              {t}
              {tab === t && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="transition-all"
        >
          {tab === 'Overview' && (
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2 bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-8 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <BookOpen size={22} />
                  </div>
                  Institutional Overview
                </h2>
                <p className="text-slate-700 text-2xl leading-relaxed font-semibold">
                  {college.overview || 'No overview available.'}
                </p>
                {college.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 mt-12 pt-12 border-t border-slate-50">
                    {college.tags.map((t) => (
                      <span key={t} className="px-4 py-2 rounded-xl bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-600 border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 h-fit">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Quick Facts</h2>
                <div className="flex flex-col gap-8">
                  {[
                    { label: 'Institution Type', value: college.type, icon: Building2 },
                    { label: 'Established Year', value: college.established || 'N/A', icon: Calendar },
                    { label: 'Global Ranking', value: college.ranking ? `NIRF #${college.ranking}` : 'N/A', icon: Award },
                    { label: 'Highest Package', value: college.placement?.highestPackage ? `₹${college.placement.highestPackage} LPA` : 'N/A', icon: TrendingUp },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm text-indigo-600">
                        <Icon size={18} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
                        <span className="text-base font-black text-slate-900">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'Courses' && (
            <div className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Course Specialization</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Duration</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Annual Fees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {college.courses?.length > 0 ? college.courses.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-10 py-8 font-black text-slate-950 text-base group-hover:text-indigo-600 transition-colors">{c.name}</td>
                      <td className="px-10 py-8 text-slate-600 text-sm font-black uppercase tracking-widest">{c.duration}</td>
                      <td className="px-10 py-8 text-right font-black text-emerald-600 text-base">₹{c.fees?.toLocaleString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="text-center py-20 text-slate-600 font-bold uppercase tracking-widest text-xs">No Course data currently listed</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'Cutoffs' && (
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Target size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Entrance Exam & Cutoffs</h2>
                  <p className="text-sm font-bold text-slate-500">Minimum rank requirements for admission.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {college.cutoffs?.length > 0 ? college.cutoffs.map((c, i) => (
                  <div key={i} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:border-indigo-200 hover:shadow-xl transition-all">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">{c.exam}</div>
                    <div className="text-4xl font-black text-indigo-600 mb-2">{c.rank}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opening Rank ({c.year})</div>
                  </div>
                )) : (
                  <div className="col-span-full py-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs">No cutoff data available for this institution</div>
                )}
              </div>
            </div>
          )}

          {tab === 'Placements' && (
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-10">Performance Metrics</h3>
                <div className="flex flex-col gap-6">
                  {[
                    { label: 'Overall Placement Rate', value: `${college.placement?.placementRate || 0}%`, color: 'text-emerald-600' },
                    { label: 'Average CTC Offered', value: `₹${college.placement?.averagePackage || 0} LPA` },
                    { label: 'Highest Salary Offered', value: `₹${college.placement?.highestPackage || 0} LPA`, color: 'text-amber-600' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex justify-between items-center p-8 rounded-3xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                      <span className={`text-xl font-black ${color || 'text-slate-950'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-10">Top Global Recruiters</h3>
                <div className="flex flex-wrap gap-4">
                  {college.placement?.topRecruiters?.length > 0 ? college.placement.topRecruiters.map((r) => (
                    <span key={r} className="px-6 py-4 rounded-2xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-700 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 transition-all cursor-default">
                      {r}
                    </span>
                  )) : <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Recruiter data coming soon</p>}
                </div>
              </div>
            </div>
          )}

          {tab === 'Reviews' && (
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 flex flex-col gap-8">
                {college.reviews?.length > 0 ? [...college.reviews].reverse().map((r, i) => (
                  <div key={r._id || i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group relative">
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDeleteReview(r._id)}
                        className="absolute top-8 right-8 p-3 rounded-xl bg-rose-50 text-rose-500 transition-all hover:bg-rose-500 hover:text-white shadow-sm"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl shadow-sm border border-indigo-100">
                          {(r.author || 'U').charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-slate-950 text-base tracking-tight">{r.author || 'Anonymous'}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">
                            {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill={s <= r.rating ? '#f59e0b' : 'transparent'} color="#f59e0b" />)}
                      </div>
                    </div>
                    <p className="text-slate-700 text-base leading-relaxed font-medium pr-12">{r.comment}</p>
                  </div>
                )) : (
                  <div className="bg-white p-24 rounded-[3rem] text-center border border-slate-100 border-dashed">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-8">
                      <MessageSquare size={32} className="text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-950 mb-2">No reviews yet</h3>
                    <p className="text-slate-400 text-sm font-medium">Be the first one to share your institutional experience.</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 sticky top-32">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <MessageSquare size={18} />
                    </div>
                    Share Your Review
                  </h3>

                  {isAuthenticated ? (
                    <form onSubmit={handleSubmitReview} className="flex flex-col gap-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Overall Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                              className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${reviewForm.rating >= s
                                  ? 'bg-amber-50 border-amber-200 text-amber-500 shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-300'
                                }`}
                            >
                              <Star size={20} fill={reviewForm.rating >= s ? 'currentColor' : 'transparent'} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Your Experience</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          placeholder="Tell us about the campus, faculty, and placements..."
                          className="w-full h-40 bg-white border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium resize-none text-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={reviewPending}
                        className="w-full h-14 bg-linear-to-r from-primary to-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                      >
                        {reviewPending ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Post Review <Send size={14} /></>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                        Join our community of students to share your institutional experience.
                      </p>
                      <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                        Sign in to Review
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>

  );
}
