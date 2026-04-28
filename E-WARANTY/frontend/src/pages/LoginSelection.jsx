import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';
import loginHero from '../assets/login-hero.jpg';

export const LoginSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100 px-4 py-10">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(168,85,247,0.18),_transparent_16%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.16),_transparent_14%),linear-gradient(135deg,_#020617_0%,_#0b1223_100%)]" />
      <div className="absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute right-10 bottom-0 h-96 w-96 rounded-full bg-emerald-500/8 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/10">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl gradient-text">
            WarrantyHub
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Sign in with your account to continue
          </p>
        </div>

        {/* Login Options Grid */}
        <div className="grid gap-8 max-w-4xl mx-auto mb-12 md:grid-cols-2">
          {/* Customer Login */}
          <div
            onClick={() => navigate('/login/customer')}
            className="group cursor-pointer rounded-[2rem] border border-slate-700/60 bg-gradient-to-br from-emerald-600/20 via-slate-950/90 to-slate-950/90 p-10 shadow-2xl shadow-emerald-500/15 backdrop-blur-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500/30 transition-colors">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">Customer Portal</h2>
            <p className="text-slate-300 mb-8 text-sm leading-relaxed">
              Access warranties, view service history, and manage your products from a unified dashboard.
            </p>
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/70 px-6 py-3 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-500/20 transition-all duration-300 group-hover:translate-x-1">
              Continue to Login
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Agent Login */}
          <div
            onClick={() => navigate('/login/agent')}
            className="group cursor-pointer rounded-[2rem] border border-slate-700/60 bg-gradient-to-br from-blue-600/20 via-slate-950/90 to-slate-950/90 p-10 shadow-2xl shadow-blue-500/15 backdrop-blur-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/20 text-blue-300 group-hover:bg-blue-500/30 transition-colors">
              <Briefcase className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">Agent Portal</h2>
            <p className="text-slate-300 mb-8 text-sm leading-relaxed">
              Manage warranty claims, handle customer requests, and access support tools from your dashboard.
            </p>
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/70 px-6 py-3 text-xs font-semibold text-blue-200 ring-1 ring-blue-500/20 transition-all duration-300 group-hover:translate-x-1">
              Continue to Login
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            <h3 className="text-lg font-semibold text-white">Why WarrantyHub?</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 text-sm text-slate-300">
            <div>
              <p className="font-medium text-white mb-1">🔐 Secure</p>
              <p>Enterprise-grade security with encrypted authentication and data protection.</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">⚡ Fast</p>
              <p>Real-time warranty tracking and instant access to all your important documents.</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">📊 Complete</p>
              <p>Comprehensive warranty management with detailed analytics and reporting.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
