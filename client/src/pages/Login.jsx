import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-brand-green)]/5 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-10 relative z-10 neon-glow"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-black border border-[var(--color-brand-green)]/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,255,102,0.1)]">
            <Terminal className="w-8 h-8 text-[var(--color-brand-green)]" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-2 text-center">Enter your details to access your repository analyses</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 px-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--color-brand-green)]/50 transition-colors text-white placeholder:text-gray-600"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 px-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--color-brand-green)]/50 transition-colors text-white placeholder:text-gray-600"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full neon-btn py-4 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-brand-green)] hover:underline font-medium">
            Create account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
