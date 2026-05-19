import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Lock, BarChart3, Settings, Play } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--color-brand-green)]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Terminal className="text-[var(--color-brand-green)]" />
          <span>XenoraAI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400 font-medium">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Log in</Link>
          <Link to="/register" className="neon-btn px-5 py-2 text-sm flex items-center gap-2">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-green)]">New Release</span>
          <span className="text-xs text-gray-300">Mermaid Architecture Diagrams</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-tight mb-6"
        >
          The AI SaaS your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">product needs</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-2xl mb-10 text-lg"
        >
          Our AI solution analyzes complex GitHub repositories instantly, delivering comprehensive architectural diagrams, workflow documentation, and security insights.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4"
        >
          <Link to="/register" className="neon-btn px-8 py-3 text-lg">
            Start Analyzing
          </Link>
          <a href="#" className="px-8 py-3 text-lg font-medium rounded-full border border-white/10 hover:bg-white/5 transition-colors">
            Learn More
          </a>
        </motion.div>
      </main>

      {/* Feature Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Access to the future of code</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Experience AI-driven code analysis, seamless repository insights, and real-time interactive diagrams.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-card p-8 bg-gradient-to-br from-[#0a1a10] to-[#050505] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand-green)]/10 blur-[80px] rounded-full group-hover:bg-[var(--color-brand-green)]/20 transition-all duration-700" />
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-black/50 border border-[var(--color-brand-green)]/30 text-[var(--color-brand-green)] text-xs font-medium mb-6">Scalability</span>
              <h3 className="text-3xl font-bold mb-4 max-w-md">Build scalable products with the help of our AI</h3>
              <p className="text-gray-400 max-w-md mb-8">Instantly grasp complex codebases. Generate high-level documentation and mermaid graphs automatically.</p>
              
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-center h-48 mt-4 relative">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-brand-green)]/20 flex items-center justify-center backdrop-blur-md border border-[var(--color-brand-green)]/30 cursor-pointer hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-[var(--color-brand-green)] ml-1" />
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 flex flex-col">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-gray-400 text-sm">Use fine-grained Personal Access Tokens. We don't store your sensitive code, keeping your IP safe.</p>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
               <h3 className="text-xl font-bold mb-3">Analytics & Insights</h3>
               <p className="text-gray-400 text-sm">Gain valuable insights through built-in automated code structure analysis.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
