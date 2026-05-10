import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Star, TrendingUp, Users, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { getColleges, getSaved } from '../api';
import { useAuth } from '../context/AuthContext';
import CollegeCard from '../components/CollegeCard';
import { CardSkeleton } from '../components/Loader';

const STATS = [
  { icon: Award, value: '20+', label: 'Top Colleges' },
  { icon: Users, value: '50K+', label: 'Students Helped' },
  { icon: TrendingUp, value: '95%', label: 'Avg Placement' },
  { icon: Zap, value: 'Real', label: 'Live Data' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getColleges({ limit: 6, page: 1 })
      .then((res) => setFeatured(res.data.data))
      .catch(() => { })
      .finally(() => setLoading(false));
    
    if (isAuthenticated) {
      getSaved().then((res) => setSavedIds(res.data.data.map((c) => c._id))).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleSaveToggle = (id) => {
    setSavedIds((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/colleges?search=${encodeURIComponent(search)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero.png"
            alt="Premium Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/50 to-bg-dark" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 relative z-10 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-black mb-6 bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
            >
              <Star size={12} className="fill-indigo-600" /> India's #1 College Discovery Platform
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-black mb-6 leading-[0.9] text-slate-900 tracking-tighter"
            >
              Find Your <span className="gradient-text">Dream College</span>
              <br />with Confidence
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl mb-10 max-w-2xl text-slate-600 leading-relaxed font-bold"
            >
              Experience the most advanced way to discover, compare, and apply to top institutions across the nation. Real data, real placements, real dreams.
            </motion.p>

            <motion.div variants={itemVariants}>
              <form onSubmit={handleSearch}
                className="flex flex-col md:flex-row items-center gap-3 bg-white rounded-[2rem] p-2 shadow-2xl border border-slate-200/60 focus-within:ring-4 ring-indigo-500/10 transition-all"
              >
                <div className="flex items-center flex-1 w-full gap-3 px-4">
                  <Search size={22} className="text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search colleges, cities, or courses..."
                    className="flex-1 bg-transparent outline-none text-lg py-4 text-slate-900 placeholder:text-slate-400 font-bold"
                  />
                </div>
                <button type="submit" className="w-full md:w-auto px-10 py-4 text-lg font-black uppercase tracking-widest rounded-2xl bg-linear-to-r from-primary to-accent text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
                  Explore <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 -mt-20 pb-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="glass-card p-10 text-center group hover:border-indigo-500/40 hover:shadow-xl">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-indigo-50 text-indigo-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm border border-indigo-100">
                  <Icon size={32} />
                </div>
                <div className="text-4xl font-black mb-2 gradient-text tracking-tight">{value}</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-10 h-[2px] bg-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Premium Selection</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter"
              >
                Featured Institutions
              </motion.h2>
            </div>
            <Link to="/colleges" className="px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2 group shadow-sm">
              Explore All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {loading
              ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
              : featured.map((c) => (
                <motion.div key={c._id} variants={itemVariants}>
                  <CollegeCard college={c} savedIds={savedIds} onSaveToggle={handleSaveToggle} />
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] p-12 md:p-24 text-center overflow-hidden border border-slate-200 bg-white shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] -mr-64 -mt-64 rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] -ml-64 -mb-64 rounded-full" />

            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-black mb-8 text-slate-900 tracking-tighter">Start Your Journey Today</h2>
              <p className="text-xl mb-12 text-slate-600 max-w-2xl mx-auto font-bold leading-relaxed">
                Join 50,000+ students who have already found their path. Create your profile and get personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link to="/colleges" className="px-12 py-5 text-sm font-black uppercase tracking-[0.2em] rounded-2xl bg-linear-to-r from-primary to-accent text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Browse Colleges
                </Link>
                <Link to="/register" className="px-12 py-5 text-sm font-black uppercase tracking-[0.2em] rounded-2xl bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200 transition-all">
                  Join Now
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>

  );
}

