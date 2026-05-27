import React, { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Plus, Terminal, Search, Loader2, GitBranch, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyses, setAnalyses] = useState([]);
  const [error, setError] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const res = await api.get('/repo/history');
      setAnalyses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/repo/analyze', { repoUrl });
      navigate(`/analysis/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Check the URL or GitHub Token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[var(--color-brand-green)] selection:text-black">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-brand-green)]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <Terminal className="text-[var(--color-brand-green)]" />
            <span>XenoraAI</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-medium">{user?.fullName}</span>
              <span className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-brand-green)]/10 border border-[var(--color-brand-green)]/20 text-[var(--color-brand-green)] text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <GitBranch className="w-3 h-3" /> Dashboard
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Analyze a <span className="text-[var(--color-brand-green)]">Repository</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Paste a GitHub URL below to get instant AI-powered insights into the architecture, workflow, and technical debt.
          </p>
        </div>

        {/* Input Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 neon-glow mb-20 max-w-4xl"
        >
          <form onSubmit={handleAnalyze} className="relative">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
              <input
                type="text"
                placeholder="https://github.com/owner/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full pl-14 pr-44 py-5 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-[var(--color-brand-green)]/40 transition-all text-lg placeholder:text-gray-600"
                required
              />
              <div className="absolute right-2 top-2 bottom-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-full px-8 neon-btn flex items-center gap-2 text-sm"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </div>
            {error && <p className="mt-4 text-red-500 text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> {error}</p>}
          </form>
        </motion.div>

        {/* History Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Clock className="text-[var(--color-brand-green)]" />
              Recent Analyses
            </h2>
            <div className="h-px flex-1 mx-8 bg-white/5" />
          </div>

          {analyses.length === 0 ? (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center border-dashed border-white/5 bg-transparent">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No analyses yet</h3>
              <p className="text-gray-500 max-w-sm">Start by pasting a GitHub repository URL above to see it here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {analyses.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/analysis/${item._id}`)}
                    className="glass-card group p-6 hover:border-[var(--color-brand-green)]/30 hover:bg-white/[0.03] transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-green)]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-black border border-white/10 rounded-xl">
                        <GitBranch className="text-[var(--color-brand-green)] w-5 h-5" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                    
                    <h3 className="text-lg font-bold truncate mb-1 group-hover:text-[var(--color-brand-green)] transition-colors">
                      {item.repoName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mb-6">
                      {item.repoUrl.replace('https://github.com/', '')}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold italic">Analysis Ready</span>
                      <div className="flex items-center gap-1 text-[var(--color-brand-green)] text-xs font-semibold">
                        View <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
