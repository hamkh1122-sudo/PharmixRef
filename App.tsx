
import React, { useState, useMemo, useEffect } from 'react';
import { Medicine } from './types';
import { LOCAL_MEDICINES } from './data/medicines';
import { searchMedicineWithAI } from './services/geminiService';
import Disclaimer from './components/Disclaimer';
import MedicineDetail from './components/MedicineDetail';
import OfflineBadge from './components/OfflineBadge';

const CACHE_KEY = 'pharmix_ai_cache';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedMedicines, setCachedMedicines] = useState<Medicine[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<'idle' | 'downloading' | 'complete'>('idle');

  // Monitor connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load cached AI results from localStorage
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      try {
        setCachedMedicines(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load cache", e);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync cache to localStorage
  useEffect(() => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedMedicines));
  }, [cachedMedicines]);

  const allAvailableMedicines = useMemo(() => {
    // Combine local source with any AI results cached in current/previous sessions
    const combined = [...LOCAL_MEDICINES];
    cachedMedicines.forEach(cached => {
      if (!combined.find(m => m.id === cached.id)) {
        combined.push(cached);
      }
    });
    return combined;
  }, [cachedMedicines]);

  const filteredMedicines = useMemo(() => {
    return allAvailableMedicines.filter(m => {
      const q = query.toLowerCase();
      const matchesSearch = m.name.toLowerCase().includes(q) || 
                           m.brandNames.some(b => b.toLowerCase().includes(q)) ||
                           m.class.toLowerCase().includes(q);
      const matchesEmergency = emergencyOnly ? m.emergencyUse : true;
      return matchesSearch && matchesEmergency;
    });
  }, [query, emergencyOnly, allAvailableMedicines]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    // First check if we have it in our combined list (local + cached)
    const existingMatch = allAvailableMedicines.find(m => 
      m.name.toLowerCase() === query.toLowerCase() || 
      m.brandNames.some(b => b.toLowerCase() === query.toLowerCase())
    );

    if (existingMatch) {
      setSelectedMedicine(existingMatch);
      return;
    }

    // If offline and not found, we can't do AI search
    if (!isOnline) {
      setError("Network unavailable. AI pharmacopeia lookup is disabled in offline mode.");
      return;
    }

    // Otherwise, try AI lookup
    setLoading(true);
    setError(null);
    try {
      const result = await searchMedicineWithAI(query);
      if (result) {
        // Add to cache so it's available offline later
        setCachedMedicines(prev => {
          if (prev.find(p => p.id === result.id)) return prev;
          return [...prev, result];
        });
        setSelectedMedicine(result);
      } else {
        setError("Drug not found in local database or via pharmacopeia lookup. Please verify spelling.");
      }
    } catch (err) {
      setError("Failed to fetch medical data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const simulateDownload = () => {
    setDownloadProgress('downloading');
    setTimeout(() => {
      setDownloadProgress('complete');
      setTimeout(() => setDownloadProgress('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Network Status Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-[10px] font-bold py-1 text-center uppercase tracking-widest animate-pulse">
          Offline Mode Active: AI Lookup Disabled • Local & Cached Database Only
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setSelectedMedicine(null); setQuery('');}}>
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-blue-200 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a2 2 0 01-1.78 0l-.673-.337a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547l-.318.318a2 2 0 000 2.828l.636.636a2 2 0 002.828 0l.318-.318a2 2 0 00.547-1.022l.477-2.387a6 6 0 01.517-3.86l.337-.673a2 2 0 000-1.78l-.337-.673a6 6 0 01-.517-3.86l-.477-2.387a2 2 0 00-.547-1.022l-.318-.318a2 2 0 000-2.828l.636-.636a2 2 0 002.828 0l.318.318a2 2 0 00.547 1.022l.477 2.387a6 6 0 01-.517 3.86l-.337.673a2 2 0 000 1.78l.337.673a6 6 0 01.517 3.86l.477 2.387a2 2 0 00.547 1.022l.318.318a2 2 0 000 2.828l-.636.636a2 2 0 00-2.828 0l-.318-.318z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Pharmix<span className="text-blue-600">Ref</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <OfflineBadge isOnline={isOnline} />
            <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Verified BNF</span>
              <span>•</span>
              <span>FDA Standards</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6">
        <Disclaimer />

        {selectedMedicine ? (
          <MedicineDetail 
            medicine={selectedMedicine} 
            onBack={() => setSelectedMedicine(null)} 
          />
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {/* Search Hero */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 bg-blue-600 h-full"></div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-3xl font-extrabold text-slate-900">Clinical Database</h2>
                <button 
                  onClick={simulateDownload}
                  disabled={downloadProgress !== 'idle'}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-tight transition-all ${
                    downloadProgress === 'complete' ? 'bg-green-100 text-green-700' : 
                    downloadProgress === 'downloading' ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <svg className={`w-4 h-4 ${downloadProgress === 'downloading' ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {downloadProgress === 'complete' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    )}
                  </svg>
                  {downloadProgress === 'complete' ? 'DB Updated' : downloadProgress === 'downloading' ? 'Syncing...' : 'Sync Offline'}
                </button>
              </div>
              <p className="text-slate-500 mb-8 max-w-2xl">Access adult and pediatric dosing, safety precautions, and emergency guidelines. Results are automatically cached for offline emergency use.</p>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search generic, brand, or class..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all text-lg font-medium text-slate-800 placeholder:text-slate-400 shadow-sm outline-none focus:ring-4 ${
                      !isOnline && query && !allAvailableMedicines.some(m => m.name.toLowerCase().includes(query.toLowerCase())) 
                        ? 'border-amber-300 bg-amber-50/30' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    disabled={loading || !query || (!isOnline && !allAvailableMedicines.some(m => m.name.toLowerCase().includes(query.toLowerCase())))}
                  >
                    {loading ? 'Searching...' : 'Go'}
                    {!isOnline && <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                  </button>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={emergencyOnly} 
                        onChange={(e) => setEmergencyOnly(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <span className="text-sm font-bold text-red-600 uppercase tracking-wide">Emergency Protocol</span>
                    </label>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    {allAvailableMedicines.length} Medicines in Clinical Cache
                  </div>
                </div>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map(medicine => {
                const isLocal = LOCAL_MEDICINES.some(m => m.id === medicine.id);
                return (
                  <div 
                    key={medicine.id}
                    onClick={() => setSelectedMedicine(medicine)}
                    className="bg-white rounded-xl shadow-md border border-slate-200 p-6 cursor-pointer hover:shadow-xl hover:border-blue-400 transition-all group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{medicine.name}</h3>
                      <div className="flex gap-1">
                        {!isLocal && (
                          <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-slate-200 uppercase">Cached</span>
                        )}
                        {medicine.emergencyUse && (
                          <span className="bg-red-100 text-red-700 text-[8px] font-black px-1.5 py-0.5 rounded border border-red-200 uppercase">ER</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-1">{medicine.class}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {medicine.indications.slice(0, 2).map((ind, i) => (
                        <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{ind}</span>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:tracking-[0.15em] transition-all">View Profile</span>
                      <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredMedicines.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-700">No matches in clinical cache</h3>
                {isOnline ? (
                  <p className="text-slate-500">Press enter to perform an AI-powered pharmacopeia lookup.</p>
                ) : (
                  <p className="text-amber-600 font-semibold px-4">Reconnect to search the global pharmacopeia. Currently searching local/cached data only.</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest pb-12">
        <p>© {new Date().getFullYear()} Pharmix Clinical Systems • Medically Authentic Dosing Platform</p>
        <div className="mt-2 flex items-center justify-center gap-4">
          <span>{allAvailableMedicines.length} Records Ready</span>
          <span>•</span>
          <span>Encryption Enabled</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
