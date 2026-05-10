import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Search, ArrowRight } from 'lucide-react';
import { predictColleges } from '../api';
import CollegeCard from '../components/CollegeCard';
import { CardSkeleton } from '../components/Loader';
import toast from 'react-hot-toast';

export default function Predictor() {
  const [exam, setExam] = useState('JEE');
  const [rank, setRank] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!rank || rank <= 0) {
      toast.error('Please enter a valid rank.');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await predictColleges({ exam, rank });
      setResults(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch predictions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6"
          >
            <Target size={32} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4"
          >
            College Predictor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-bold"
          >
            Enter your exam details to see where you have the highest chances of admission.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/60 max-w-3xl mx-auto mb-16"
        >
          <form onSubmit={handlePredict} className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2">
                Examination
              </label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="JEE">JEE Main / Advanced</option>
                <option value="NEET">NEET (MBBS)</option>
                <option value="CAT">CAT (MBA)</option>
                <option value="BITSAT">BITSAT</option>
                <option value="CUET">CUET (UG)</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2">
                Your Rank / Score
              </label>
              <input
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 disabled:opacity-70 transition-all flex justify-center items-center gap-2"
            >
              {loading ? <Search size={20} className="animate-spin" /> : 'Predict Now'}
            </button>
          </form>
        </motion.div>

        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-[2px] bg-indigo-500" />
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">
                Predicted Matches
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
              ) : results.length > 0 ? (
                results.map((college) => (
                  <CollegeCard key={college._id} college={college} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500 font-bold text-lg">
                  No colleges found in this rank range for the selected exam. Try a different range.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
