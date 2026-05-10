import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { Loader } from '../components/Loader';
import { Save, ArrowLeft, Building2, Globe, GraduationCap, Briefcase, Award, Plus, Trash2, Tag, Image as ImageIcon, Target } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CollegeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    city: '',
    state: '',
    type: 'Private',
    established: '',
    ranking: '',
    rating: 0,
    overview: '',
    fees: { min: 0, max: 0 },
    courses: [{ name: '', duration: '', fees: 0 }],
    placement: { averagePackage: 0, highestPackage: 0, placementRate: 0, topRecruiters: [''] },
    tags: [''],
    logo: '',
    image: '',
    cutoffs: [{ exam: '', rank: '', year: 2024 }],
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/colleges/${id}`)
        .then((res) => {
          const data = res.data.data;
          setForm({
            ...data,
            established: data.established || '',
            ranking: data.ranking || '',
            courses: data.courses?.length ? data.courses : [{ name: '', duration: '', fees: 0 }],
            placement: {
              ...data.placement,
              topRecruiters: data.placement?.topRecruiters?.length ? data.placement.topRecruiters : ['']
            },
            tags: data.tags?.length ? data.tags : [''],
            cutoffs: data.cutoffs?.length ? data.cutoffs : [{ exam: '', rank: '', year: 2024 }],
          });
        })
        .catch(() => toast.error('Failed to load college data'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleArrayChange = (key, index, value) => {
    const newArray = [...form[key]];
    newArray[index] = value;
    setForm({ ...form, [key]: newArray });
  };

  const addArrayItem = (key, defaultValue) => {
    setForm({ ...form, [key]: [...form[key], defaultValue] });
  };

  const removeArrayItem = (key, index) => {
    if (form[key].length <= 1) return;
    const newArray = form[key].filter((_, i) => i !== index);
    setForm({ ...form, [key]: newArray });
  };

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...form.courses];
    newCourses[index][field] = value;
    setForm({ ...form, courses: newCourses });
  };

  const handleCutoffChange = (index, field, value) => {
    const newCutoffs = [...form.cutoffs];
    newCutoffs[index][field] = value;
    setForm({ ...form, cutoffs: newCutoffs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/admin/colleges/${id}`, form);
        toast.success('College updated successfully');
      } else {
        await api.post('/admin/colleges', form);
        toast.success('College added successfully');
      }
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save college');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading form..." />;

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="py-32 bg-white min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link to="/admin" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-6 text-slate-500 hover:text-indigo-400 transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-5xl font-black text-slate-950 tracking-tighter">
            {isEdit ? 'Update Institution' : 'New Institution'}
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Fill in the details to list the college on the platform</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          {/* Basic Info */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="glass-card p-10 border border-slate-200 bg-white">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 mb-10 text-indigo-400">
              <Building2 size={20} /> Essential Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Full College Name</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ring-indigo-500/50 transition-all font-medium" placeholder="e.g. Indian Institute of Technology" value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">City</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ring-indigo-500/50 transition-all font-medium" placeholder="e.g. Mumbai" value={form.city} required
                  onChange={(e) => setForm({ ...form, city: e.target.value, location: `${e.target.value}, ${form.state}` })} />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">State</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ring-indigo-500/50 transition-all font-medium" placeholder="e.g. Maharashtra" value={form.state} required
                  onChange={(e) => setForm({ ...form, state: e.target.value, location: `${form.city}, ${e.target.value}` })} />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Institution Type</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ring-indigo-500/50 transition-all font-medium" value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {['Government', 'Private', 'Deemed', 'Autonomous'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Established Year</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ring-indigo-500/50 transition-all font-medium" type="number" placeholder="e.g. 1958" value={form.established}
                  onChange={(e) => setForm({ ...form, established: e.target.value })} />
              </div>
            </div>
          </motion.div>

          {/* Details & Ranking */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="glass-card p-10 border border-slate-200 bg-white">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 mb-10 text-purple-400">
              <Award size={20} /> Rankings & Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">NIRF Ranking</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ring-indigo-500/50 transition-all font-medium" type="number" placeholder="Current Rank" value={form.ranking}
                  onChange={(e) => setForm({ ...form, ranking: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Platform Rating (0-5)</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ring-indigo-500/50 transition-all font-medium" type="number" step="0.1" max="5" value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Institutional Overview</label>
                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ring-indigo-500/50 transition-all font-medium min-h-[160px]" placeholder="Describe the institution..." value={form.overview}
                  onChange={(e) => setForm({ ...form, overview: e.target.value })} />
              </div>
            </div>
          </motion.div>

          {/* Fees & Placement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="glass-card p-10 border border-slate-200 bg-white">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 mb-10 text-rose-400">
                <GraduationCap size={20} /> Fee Structure
              </h2>
              <div className="flex flex-col gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Min Annual Fee (₹)</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ring-indigo-500/50 transition-all font-medium" type="number" value={form.fees.min}
                    onChange={(e) => setForm({ ...form, fees: { ...form.fees, min: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Max Annual Fee (₹)</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ring-indigo-500/50 transition-all font-medium" type="number" value={form.fees.max}
                    onChange={(e) => setForm({ ...form, fees: { ...form.fees, max: e.target.value } })} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="glass-card p-10 border border-slate-200 bg-white">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 mb-10 text-amber-400">
                <Briefcase size={20} /> Placements & Recruiters
              </h2>
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Avg LPA</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/50" type="number" step="0.1" value={form.placement.averagePackage}
                      onChange={(e) => setForm({ ...form, placement: { ...form.placement, averagePackage: e.target.value } })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Max LPA</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/50" type="number" step="0.1" value={form.placement.highestPackage}
                      onChange={(e) => setForm({ ...form, placement: { ...form.placement, highestPackage: e.target.value } })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Rate %</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/50" type="number" value={form.placement.placementRate}
                      onChange={(e) => setForm({ ...form, placement: { ...form.placement, placementRate: e.target.value } })} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Top Recruiters</label>
                  <div className="flex flex-col gap-3">
                    {form.placement.topRecruiters.map((r, i) => (
                      <div key={i} className="flex gap-2">
                        <input className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/50" placeholder="Company Name" value={r}
                          onChange={(e) => {
                            const newRecs = [...form.placement.topRecruiters];
                            newRecs[i] = e.target.value;
                            setForm({ ...form, placement: { ...form.placement, topRecruiters: newRecs } });
                          }} />
                        <button type="button" onClick={() => {
                          const newRecs = form.placement.topRecruiters.filter((_, idx) => idx !== i);
                          if (newRecs.length === 0) newRecs.push('');
                          setForm({ ...form, placement: { ...form.placement, topRecruiters: newRecs } });
                        }} className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setForm({ ...form, placement: { ...form.placement, topRecruiters: [...form.placement.topRecruiters, ''] } })}
                      className="w-fit flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors ml-1 mt-1">
                      <Plus size={14} /> Add Recruiter
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Courses & Specializations */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="glass-card p-10 border border-slate-200 bg-white">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 mb-10 text-emerald-400">
              <GraduationCap size={20} /> Courses & Fees
            </h2>
            <div className="flex flex-col gap-6">
              {form.courses.map((c, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 relative group">
                  <div className="md:col-span-2">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Course Name</label>
                    <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/50" placeholder="e.g. B.Tech Computer Science" value={c.name}
                      onChange={(e) => handleCourseChange(i, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Duration</label>
                    <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/50" placeholder="4 Years" value={c.duration}
                      onChange={(e) => handleCourseChange(i, 'duration', e.target.value)} />
                  </div>
                  <div className="relative">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Fees (₹)</label>
                    <div className="flex gap-2">
                      <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/50" type="number" value={c.fees}
                        onChange={(e) => handleCourseChange(i, 'fees', e.target.value)} />
                      <button type="button" onClick={() => removeArrayItem('courses', i)} className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('courses', { name: '', duration: '', fees: 0 })}
                className="w-fit flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors ml-1 mt-2">
                <Plus size={14} /> Add New Course
              </button>
            </div>
          </motion.div>

          {/* Entrance & Cutoffs */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="glass-card p-10 border border-slate-200 bg-white">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 mb-10 text-indigo-400">
              <Target size={20} /> Entrance & Cutoffs
            </h2>
            <div className="flex flex-col gap-6">
              {form.cutoffs.map((c, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 relative group">
                  <div className="md:col-span-2">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Exam Name</label>
                    <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/50" placeholder="e.g. JEE Main" value={c.exam}
                      onChange={(e) => handleCutoffChange(i, 'exam', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Cutoff Rank</label>
                    <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/50" type="number" placeholder="e.g. 5000" value={c.rank}
                      onChange={(e) => handleCutoffChange(i, 'rank', e.target.value)} />
                  </div>
                  <div className="relative">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Year</label>
                    <div className="flex gap-2">
                      <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/50" type="number" value={c.year}
                        onChange={(e) => handleCutoffChange(i, 'year', e.target.value)} />
                      <button type="button" onClick={() => removeArrayItem('cutoffs', i)} className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('cutoffs', { exam: '', rank: '', year: 2024 })}
                className="w-fit flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors ml-1 mt-2">
                <Plus size={14} /> Add New Cutoff
              </button>
            </div>
          </motion.div>

          {/* Media & Tags */}
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="glass-card p-10 border border-slate-200 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 mb-8 text-cyan-400">
                  <ImageIcon size={20} /> Media Assets
                </h2>
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Logo URL</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/50" placeholder="https://..." value={form.logo}
                      onChange={(e) => setForm({ ...form, logo: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Campus Image URL</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/50" placeholder="https://..." value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })} />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 mb-8 text-indigo-400">
                  <Tag size={20} /> Discovery Tags
                </h2>
                <div className="flex flex-col gap-3">
                  {form.tags.map((tag, i) => (
                    <div key={i} className="flex gap-2">
                      <input className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/50" placeholder="e.g. Engineering" value={tag}
                        onChange={(e) => handleArrayChange('tags', i, e.target.value)} />
                      <button type="button" onClick={() => removeArrayItem('tags', i)} className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('tags', '')}
                    className="w-fit flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors ml-1 mt-1">
                    <Plus size={14} /> Add Tag
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-6 items-center pt-6"
          >
            <button type="submit" disabled={saving} className="flex-1 h-14 flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-primary to-accent text-white text-base font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
              {saving ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={20} /> {isEdit ? 'Update Institution' : 'Publish Institution'}</>}
            </button>
            <Link to="/admin" className="px-10 h-14 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-200 hover:text-slate-900 transition-all">Cancel</Link>
          </motion.div>
        </form>
      </div>
    </div>

  );
}

