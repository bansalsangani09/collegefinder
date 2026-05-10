import { useState, useEffect } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, MapPin, GraduationCap, IndianRupee, Search } from 'lucide-react';
import { getFilters } from '../api';

const FEE_RANGES = [
  { label: 'Under ₹1L', max: 100000 },
  { label: '₹1L - ₹5L', min: 100000, max: 500000 },
  { label: '₹5L - ₹15L', min: 500000, max: 1500000 },
  { label: 'Above ₹15L', min: 1500000 },
];

export default function FilterSidebar({ filters, onChange, onClear }) {
  const [collapsed, setCollapsed] = useState({});
  const [options, setOptions] = useState({ states: [], cities: [], courses: [] });
  const [loading, setLoading] = useState(true);
  const [searchQueries, setSearchQueries] = useState({ state: '', city: '', course: '' });

  useEffect(() => {
    // Initial fetch for states, courses, and cities
    getFilters().then((res) => {
      setOptions((prev) => ({ 
        ...prev, 
        states: res.data.states, 
        courses: res.data.courses,
        cities: res.data.cities 
      }));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Fetch cities whenever state selection changes, but only if a state is selected
    // If no state is selected, we keep the original list of all cities
    if (filters.state) {
      getFilters({ state: filters.state }).then((res) => {
        setOptions((prev) => ({ ...prev, cities: res.data.cities }));
      }).catch(() => {});
    } else {
      // If state is cleared, refetch all cities
      getFilters().then((res) => {
        setOptions((prev) => ({ ...prev, cities: res.data.cities }));
      }).catch(() => {});
    }
  }, [filters.state]);

  const toggle = (key) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const Section = ({ title, id, icon: Icon, children, hasSearch, searchKey }) => (
    <div className="py-6 border-b border-slate-100 last:border-0">
      <button className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors mb-6 group"
        onClick={() => toggle(id)}>
        <span className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <Icon size={14} />
          </div>
          {title}
        </span>
        {collapsed[id] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
      {!collapsed[id] && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          {hasSearch && (
            <div className="relative mb-4 group">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text"
                placeholder={`Search ${title.split(' ').pop().toLowerCase()}...`}
                value={searchQueries[searchKey]}
                onChange={(e) => setSearchQueries(prev => ({ ...prev, [searchKey]: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-[10px] font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ring-indigo-500/20 focus:bg-white focus:border-indigo-200 transition-all"
              />
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );

  const filterItems = (items, query) => {
    if (!query) return items;
    return items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  };

  const filteredStates = filterItems(options.states, searchQueries.state);
  const filteredCities = filterItems(options.cities, searchQueries.city);
  const filteredCourses = filterItems(options.courses, searchQueries.course);

  return (
    <aside className="glass-card p-8 h-fit sticky top-24 border border-slate-200/60 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em] text-slate-950">
          <SlidersHorizontal size={18} className="text-indigo-500" /> Filters
        </div>
        <button onClick={() => { onClear(); setSearchQueries({ state: '', city: '', course: '' }); }} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors text-slate-600 hover:text-rose-500">
          <X size={12} /> Clear all
        </button>
      </div>

      <Section title="Select State" id="state" icon={MapPin} hasSearch searchKey="state">
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
          {filteredStates.length === 0 ? (
            <p className="text-[10px] text-slate-400 font-bold italic py-4 text-center">No states found</p>
          ) : (
            filteredStates.map((s) => (
              <label key={s} className={`flex items-center gap-3 py-2.5 px-4 rounded-xl cursor-pointer text-[11px] font-black uppercase tracking-widest transition-all border ${
                filters.state === s 
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm' 
                : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-950'
              }`}>
                <input type="radio" name="state" value={s}
                  checked={filters.state === s}
                  onChange={() => onChange({ ...filters, state: filters.state === s ? '' : s, city: '' })}
                  className="hidden" />
                <div className={`w-2 h-2 rounded-full transition-all ${filters.state === s ? 'bg-indigo-500 scale-125 shadow-lg shadow-indigo-500/50' : 'bg-slate-200'}`} />
                {s}
              </label>
            ))
          )}
        </div>
      </Section>

      <Section title="Select City" id="city" icon={MapPin} hasSearch searchKey="city">
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
          {filteredCities.length === 0 ? (
            <p className="text-[10px] text-slate-400 font-bold italic py-4 text-center">
              {filters.state ? "No cities in this state" : "No cities found"}
            </p>
          ) : (
            filteredCities.map((c) => (
              <label key={c} className={`flex items-center gap-3 py-2.5 px-4 rounded-xl cursor-pointer text-[11px] font-black uppercase tracking-widest transition-all border ${
                filters.city === c 
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm' 
                : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-950'
              }`}>
                <input type="radio" name="city" value={c}
                  checked={filters.city === c}
                  onChange={() => onChange({ ...filters, city: filters.city === c ? '' : c })}
                  className="hidden" />
                <div className={`w-2 h-2 rounded-full transition-all ${filters.city === c ? 'bg-indigo-500 scale-125 shadow-lg shadow-indigo-500/50' : 'bg-slate-200'}`} />
                {c}
              </label>
            ))
          )}
        </div>
      </Section>

      <Section title="Course" id="course" icon={GraduationCap} hasSearch searchKey="course">
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
          {filteredCourses.length === 0 ? (
            <p className="text-[10px] text-slate-400 font-bold italic py-4 text-center">No courses found</p>
          ) : (
            filteredCourses.map((c) => (
              <label key={c} className={`flex items-center gap-3 py-2.5 px-4 rounded-xl cursor-pointer text-[11px] font-black uppercase tracking-widest transition-all border ${
                filters.course === c 
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm' 
                : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-950'
              }`}>
                 <input type="radio" name="course" value={c}
                  checked={filters.course === c}
                  onChange={() => onChange({ ...filters, course: filters.course === c ? '' : c })}
                  className="hidden" />
                 <div className={`w-2 h-2 rounded-full transition-all ${filters.course === c ? 'bg-indigo-500 scale-125 shadow-lg shadow-indigo-500/50' : 'bg-slate-200'}`} />
                {c}
              </label>
            ))
          )}
        </div>
      </Section>

      <Section title="Fee Range" id="fees" icon={IndianRupee}>
        <div className="flex flex-col gap-2 pb-4">
          {FEE_RANGES.map((f) => {
            const active = filters.minFees === (f.min || '') && filters.maxFees === (f.max || '');
            return (
              <button key={f.label}
                onClick={() => onChange({ ...filters, minFees: active ? '' : (f.min || ''), maxFees: active ? '' : (f.max || '') })}
                className={`text-left px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  active 
                  ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm' 
                  : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}>
                {f.label}
              </button>
            );
          })}
        </div>
      </Section>
    </aside>
  );
}


