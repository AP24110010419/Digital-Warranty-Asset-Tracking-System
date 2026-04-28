import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Shield, ArrowRight, CheckCircle2, ShieldCheck, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import loginHero from '../assets/login-hero.jpg';

export const CustomerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await login(formData.email, formData.password);
      
      if (response.user.role === 'ADMIN') {
        showToast('Admin login successful!', 'success');
        navigate('/admin/dashboard');
        return;
      }
      
      showToast('Login successful!', 'success');
      navigate('/dashboard');
    } catch (error) {
      showToast(error.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(168,85,247,0.18),_transparent_16%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.16),_transparent_14%),linear-gradient(135deg,_#020617_0%,_#0b1223_100%)]" />
      <div className="absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute right-10 bottom-0 h-96 w-96 rounded-full bg-emerald-500/8 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.95fr] items-center animate-fadeIn">
        <div className="space-y-8 glass glass-strong rounded-[2rem] border border-slate-700/50 p-8 shadow-2xl shadow-slate-950/30">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Account Portal
          </span>
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Your warranty information at your fingertips.
            </h1>
            <p className="max-w-xl text-slate-300 sm:text-lg">
              Track your product warranties, view service history, and manage claims in one simple dashboard. Access your purchases anytime, anywhere.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600/15 text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Easy Access</h3>
              <p className="mt-2 text-sm text-slate-400">View all your products and their warranty status instantly.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Secure & Private</h3>
              <p className="mt-2 text-sm text-slate-400">Your personal warranty data is protected with enterprise security.</p>
            </div>
          </div>

          <div className="hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/20 lg:block">
            <img
              src={loginHero}
              alt="Digital warranty dashboard"
              className="h-full w-full rounded-[2rem] object-cover"
            />
          </div>
        </div>

        <div className="glass rounded-[2rem] border border-slate-700/60 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/10">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Secure Access</p>
                <h2 className="text-2xl font-semibold text-white">Sign in to WarrantyHub</h2>
              </div>
            </div>
            <p className="text-slate-400 max-w-xl">
              Use your registered account to view warranties, manage products, and access the admin dashboard automatically when you have admin permissions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 transition-colors focus:border-emerald-500 focus:bg-slate-900 focus:outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 transition-colors focus:border-emerald-500 focus:bg-slate-900 focus:outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : <LogIn className="h-5 w-5" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-700/50 pt-6">
            <p className="text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register/customer" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-4">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to login selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
