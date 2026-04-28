import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Briefcase, Shield, Zap, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';

export const AgentLogin = () => {
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
      if (response.user.role !== 'AGENT') {
        showToast('This portal is for agents only. Please use the customer login.', 'error');
        return;
      }
      showToast('Welcome back, Agent!', 'success');
      navigate('/agent/dashboard');
    } catch (error) {
      showToast(error.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100 px-4 py-10">
      <div className="absolute inset-0" style={{background:'radial-gradient(circle at top left, rgba(251,191,36,0.12), transparent 20%), radial-gradient(circle at bottom right, rgba(168,85,247,0.12), transparent 20%), linear-gradient(135deg, #020617 0%, #0b1120 100%)'}} />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Link to="/login" className="mb-10 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowRight className="h-4 w-4 rotate-180" /> Back to login selection
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 items-start">
          {/* Left — info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-widest" style={{borderColor:'rgba(251,191,36,0.25)',background:'rgba(251,191,36,0.08)',color:'#fbbf24'}}>
                <Briefcase className="h-3.5 w-3.5" /> Agent Portal
              </span>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
                Your command centre<br />
                <span style={{color:'#f59e0b'}}>for warranty management.</span>
              </h1>
              <p className="max-w-xl text-slate-300 sm:text-lg leading-relaxed">
                Handle customer warranty registrations, manage claims, review service histories,
                and coordinate with administrators — all from one dedicated agent workspace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Users,  color:'#fbbf24', bg:'rgba(251,191,36,0.12)', title:'Customer Handling', desc:'Register and manage customer products on their behalf.' },
                { icon: Shield, color:'#c4b5fd', bg:'rgba(139,92,246,0.12)', title:'Warranty Actions',   desc:'Process claims, flag expiries, and escalate issues.' },
                { icon: Zap,    color:'#67e8f9', bg:'rgba(6,182,212,0.12)',  title:'Live Dashboard',     desc:'Real-time stats and alerts for your active case queue.' },
              ].map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} className="rounded-2xl border border-slate-700/50 p-5" style={{background:'rgba(15,23,42,0.50)'}}>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{background:bg,color}}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="mt-1.5 text-sm text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="rounded-3xl border border-slate-700/60 p-8 shadow-2xl backdrop-blur-xl" style={{background:'rgba(2,6,23,0.95)'}}>
            <div className="mb-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg" style={{background:'linear-gradient(135deg,#f59e0b,#ea580c)'}}>
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Secure Agent Access</p>
                  <h2 className="text-xl font-bold text-white">Agent Sign In</h2>
                </div>
              </div>
              <p className="text-sm text-slate-400">Use your agent credentials provided by your administrator.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">Agent Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" style={{width:'1.125rem',height:'1.125rem'}} />
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="agent@company.com" disabled={loading}
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none transition-all" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" style={{width:'1.125rem',height:'1.125rem'}} />
                  <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}
                    placeholder="••••••••" disabled={loading}
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none transition-all" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition-all disabled:opacity-60"
                style={{background:'linear-gradient(135deg,#f59e0b,#ea580c)'}}>
                {loading ? <LoadingSpinner /> : <Briefcase className="h-4 w-4" />}
                {loading ? 'Signing in...' : 'Sign in as Agent'}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-800 pt-5 space-y-3">
              <p className="text-center text-xs text-slate-500">
                Don't have agent credentials? <span style={{color:'#f59e0b'}}>Contact your administrator.</span>
              </p>
              <p className="text-center text-xs text-slate-600">
                Not an agent? <Link to="/login/customer" className="text-slate-400 hover:text-slate-200 transition-colors">Customer login →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};