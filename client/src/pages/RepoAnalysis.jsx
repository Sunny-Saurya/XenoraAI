import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, FileCode, MessageSquare, BookOpen, Layers, Zap, Info, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import FileTree from '../components/FileTree';
import AIChat from '../components/AIChat';
import MermaidDiagram from '../components/MermaidDiagram';

const RepoAnalysis = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.get(`/repo/${id}`);
        setAnalysis(res.data);
      } catch (err) {
        setError('Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[var(--color-brand-green)]/20 border-t-[var(--color-brand-green)] rounded-full animate-spin" />
          <Loader2 className="w-8 h-8 text-[var(--color-brand-green)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white">
        <div className="glass-card p-8 text-center neon-glow">
          <p className="text-red-500 mb-6 text-lg">{error}</p>
          <Link to="/dashboard" className="neon-btn px-6 py-2">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const { explanation, tree } = analysis;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[var(--color-brand-green)] selection:text-black pb-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 pt-8 relative z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-brand-green)] mb-12 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-brand-green)]/10 border border-[var(--color-brand-green)]/20 text-[var(--color-brand-green)] text-xs font-semibold uppercase tracking-wider mb-4">
            Analysis Results
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{analysis.repoName}</h1>
          <a href={analysis.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-lg">
            {analysis.repoUrl} <ExternalLink className="w-4 h-4" />
          </a>
        </header>

        {/* Health Score Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 neon-glow mb-12 border-[var(--color-brand-green)]/20 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-brand-green)]/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 grid md:grid-cols-4 gap-8">
            {/* Overall Stars */}
            <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/5 text-center">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Overall Health</span>
              <div className="flex gap-1 mb-2">
                <StarRating rating={explanation.healthScore?.overall || 0} />
              </div>
              <div className="text-4xl font-bold text-[var(--color-brand-green)]">
                {explanation.healthScore?.overall || 0}%
              </div>
            </div>

            {/* Metrics */}
            <div className="md:col-span-2 space-y-6">
              <MetricBar label="Code Quality" value={explanation.healthScore?.codeQuality || 0} />
              <MetricBar label="Architecture" value={explanation.healthScore?.architecture || 0} />
              <MetricBar label="Maintainability" value={explanation.healthScore?.maintainability || 0} />
            </div>

            {/* Analysis Points Grid */}
            <div className="grid grid-cols-2 gap-3">
              {explanation.analysisPoints?.map((p, i) => (
                <AnalysisPoint key={i} label={p.label} value={p.value} status={p.status} />
              ))}
              {!explanation.analysisPoints && (
                <div className="col-span-2 flex items-center justify-center text-gray-600 text-xs italic">
                  Points analysis pending...
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content (Explanation) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Purpose */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-10 neon-glow"
            >
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                <div className="p-2.5 bg-black border border-white/10 rounded-xl">
                  <BookOpen className="text-[var(--color-brand-green)] w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Purpose & Overview</h2>
              </div>
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg">
                <ReactMarkdown>{explanation.purpose || 'Not available'}</ReactMarkdown>
              </div>
            </motion.div>

            {/* Architecture Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand-green)]/5 blur-[80px] rounded-full pointer-events-none" />
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                <div className="p-2.5 bg-black border border-white/10 rounded-xl">
                  <Layers className="text-[var(--color-brand-green)] w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Architecture & Stack</h2>
              </div>
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                <ReactMarkdown>{explanation.architecture || 'Not available'}</ReactMarkdown>
              </div>
            </motion.div>

            {/* Mermaid Diagram Section */}
            {explanation.mermaidDiagram && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card p-10"
              >
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                  <div className="p-2.5 bg-black border border-white/10 rounded-xl">
                    <Zap className="text-[var(--color-brand-green)] w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Visual Flow</h2>
                </div>
                <MermaidDiagram chart={explanation.mermaidDiagram} />
              </motion.div>
            )}

            {/* Workflow */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-10"
            >
              <h2 className="text-2xl font-bold mb-8 border-b border-white/5 pb-6">Process Workflow</h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                <ReactMarkdown>{explanation.workflow || 'Not available'}</ReactMarkdown>
              </div>
            </motion.div>
            
            {/* Setup */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-10"
            >
              <h2 className="text-2xl font-bold mb-8 border-b border-white/5 pb-6">Local Setup</h2>
              <div className="prose prose-invert max-w-none text-gray-300 bg-black/30 p-6 rounded-2xl border border-white/5 font-mono text-sm">
                <ReactMarkdown>{explanation.setup || 'Not available'}</ReactMarkdown>
              </div>
            </motion.div>
            
            {/* Important Files */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-10"
            >
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                <div className="p-2.5 bg-black border border-white/10 rounded-xl">
                  <Info className="text-[var(--color-brand-green)] w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Critical Files</h2>
              </div>
              <div className="grid gap-3">
                {Array.isArray(explanation.importantFiles) ? (
                  explanation.importantFiles.map((f, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl text-gray-300 flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[var(--color-brand-green)] rounded-full mt-2 shrink-0 shadow-[0_0_8px_var(--color-brand-green)]" />
                      {f}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Not available</p>
                )}
              </div>
            </motion.div>

            {/* Interview Questions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                <div className="p-2.5 bg-black border border-white/10 rounded-xl">
                  <HelpCircle className="text-blue-400 w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Interview Prep</h2>
              </div>
              <p className="text-gray-400 mb-8">Generated technical questions based on this codebase's specific implementation.</p>
              <div className="space-y-4">
                {explanation.interviewQuestions?.map((q, i) => (
                  <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all group">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/50 mb-2 block">Question {i + 1}</span>
                    <p className="text-white font-medium group-hover:text-blue-400 transition-colors">{q}</p>
                  </div>
                ))}
                {!explanation.interviewQuestions?.length && (
                  <p className="text-gray-600 italic">No interview questions generated for this repo yet.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 lg:sticky lg:top-8 h-fit">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 flex flex-col h-[500px]"
            >
              <h3 className="font-bold mb-6 flex items-center gap-2 text-[var(--color-brand-green)]">
                <FileCode className="w-5 h-5" /> File Explorer
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 <FileTree tree={tree} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 flex flex-col h-[500px] border-[var(--color-brand-green)]/20 shadow-[0_0_30px_rgba(0,255,102,0.05)]"
            >
              <h3 className="font-bold mb-6 flex items-center gap-2 text-[var(--color-brand-green)]">
                <MessageSquare className="w-5 h-5" /> Codebase AI Chat
              </h3>
              <div className="flex-1 overflow-hidden">
                 <AIChat repoId={analysis._id} />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

const StarRating = ({ rating }) => {
  const stars = Math.round((rating / 100) * 5);
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < stars ? "text-[var(--color-brand-green)]" : "text-gray-700"}>
          ★
        </span>
      ))}
    </>
  );
};

const MetricBar = ({ label, value }) => (
  <div>
    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-[var(--color-brand-green)]">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-[var(--color-brand-green)] shadow-[0_0_10px_var(--color-brand-green)]"
      />
    </div>
  </div>
);

const AnalysisPoint = ({ label, value, status }) => (
  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
    <span className="text-[10px] uppercase font-bold text-gray-500">{label}</span>
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-semibold truncate">{value}</span>
      <div className={`w-2 h-2 rounded-full shadow-sm ${
        status === 'good' ? 'bg-[var(--color-brand-green)] shadow-[0_0_8px_var(--color-brand-green)]' : 
        status === 'average' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 
        'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
      }`} />
    </div>
  </div>
);

const ExternalLink = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
);

export default RepoAnalysis;
