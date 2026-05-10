import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { getColleges, getSaved } from '../api';
import { useAuth } from '../context/AuthContext';
import CollegeCard from '../components/CollegeCard';
import FilterSidebar from '../components/FilterSidebar';
import CompareBar from '../components/CompareBar';
import { CardSkeleton, EmptyState } from '../components/Loader';
import { GraduationCap } from 'lucide-react';

const EMPTY_FILTERS = { state: '', city: '', course: '', minFees: '', maxFees: '' };

export default function Colleges() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [savedIds, setSavedIds] = useState([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, search, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const res = await getColleges(params);
      setColleges(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, filters]);

  useEffect(() => { fetchColleges(); }, [fetchColleges]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getSaved().then((res) => setSavedIds(res.data.data.map((c) => c._id))).catch(() => {});
  }, [isAuthenticated]);

  const handleSaveToggle = (id) => {
    setSavedIds((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchColleges();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="py-32 bg-bg-dark">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-10 h-[2px] bg-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-700">Discovery Engine</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter mb-4 leading-none">
            Explore Institutions
          </h1>
          <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.2em] bg-slate-100 px-4 py-2 rounded-lg w-fit">
            {loading ? 'Analyzing database...' : `${total} institutions matched`}
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-[2rem] p-2 mb-12 shadow-2xl shadow-slate-200/50 focus-within:ring-4 ring-indigo-500/10 transition-all">
          <Search size={22} className="ml-4 shrink-0 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by institution name, city, or specialization..."
            className="flex-1 bg-transparent outline-none text-base py-4 text-slate-950 placeholder:text-slate-500 font-bold" />
          <button type="submit" className="px-10 py-4 rounded-2xl bg-linear-to-r from-primary to-accent text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            Search
          </button>
          <button type="button" onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-700 border border-slate-200">
            <SlidersHorizontal size={20} />
          </button>
        </form>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar — desktop */}
          <div className="hidden md:block w-80 shrink-0">
            <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={() => { setFilters(EMPTY_FILTERS); setPage(1); }} />
          </div>

          {/* Mobile filter drawer */}
          {showMobileFilter && (
            <div className="md:hidden fixed inset-0 z-[60] flex">
              <div 
                className="flex-1 bg-slate-950/60 backdrop-blur-sm" 
                onClick={() => setShowMobileFilter(false)} 
              />
              <div 
                className="w-80 h-full overflow-y-auto p-8 bg-white border-l border-slate-200"
              >
                <FilterSidebar filters={filters} onChange={(f) => { handleFilterChange(f); setShowMobileFilter(false); }}
                  onClear={() => { setFilters(EMPTY_FILTERS); setPage(1); setShowMobileFilter(false); }} />
              </div>
            </div>
          )}

          {/* College Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array(9).fill(0).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : colleges.length === 0 ? (
              <EmptyState icon={GraduationCap} title="No institutions found"
                description="Try adjusting your search criteria or filters." />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {colleges.map((c) => (
                    <CollegeCard key={c._id} college={c} savedIds={savedIds} onSaveToggle={handleSaveToggle} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-6 mt-20">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                      className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm">
                      <ChevronLeft size={22} />
                    </button>
                    <div className="flex gap-3">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-12 h-12 rounded-2xl text-[10px] font-black transition-all border ${
                            p === page 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/20' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400'
                          }`}>
                          {p}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm">
                      <ChevronRight size={22} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <CompareBar />
    </div>


  );
}
