import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Users, Package, AlertCircle, BarChart3, Briefcase, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{background:'linear-gradient(135deg,#10b981,#059669)'}}>
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-slate-400">Welcome, {user?.name || 'Administrator'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-300 transition-colors"
            style={{background:'rgba(239,68,68,0.12)'}}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-4">
          {[
            { label:'Total Users',   value:'0', icon:Users,       color:'#67e8f9', bg:'rgba(6,182,212,0.12)' },
            { label:'Products',      value:'0', icon:Package,     color:'#34d399', bg:'rgba(52,211,153,0.12)' },
            { label:'Expiring Soon', value:'0', icon:AlertCircle, color:'#fbbf24', bg:'rgba(251,191,36,0.12)' },
            { label:'Analytics',     value:'—', icon:BarChart3,   color:'#c4b5fd', bg:'rgba(139,92,246,0.12)' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl border border-slate-700/50 p-6 shadow-lg" style={{background:'rgba(15,23,42,0.60)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{background:bg,color}}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Agent Management Card */}
        <div className="rounded-2xl border p-6 shadow-xl" style={{borderColor:'rgba(245,158,11,0.25)',background:'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(2,6,23,0.80))'}}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{background:'linear-gradient(135deg,#f59e0b,#ea580c)'}}>
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Agent Management</h2>
                <p className="text-sm text-slate-400 mt-0.5">Create agent accounts and manage your agent team.</p>
              </div>
            </div>
            <Link
              to="/admin/agents"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
              style={{background:'linear-gradient(135deg,#f59e0b,#ea580c)'}}
            >
              Manage Agents <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 text-sm">
            {[
              { emoji:'🔑', title:'Create Accounts', desc:'Issue agent credentials with one click.' },
              { emoji:'📋', title:'Assign Roles',    desc:'Agents get dedicated access with controlled permissions.' },
              { emoji:'🗑️', title:'Revoke Access',   desc:'Remove agents instantly when no longer needed.' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="rounded-xl border border-slate-700/40 px-4 py-3" style={{background:'rgba(15,23,42,0.50)'}}>
                <p className="font-medium text-white">{emoji} {title}</p>
                <p className="text-slate-400 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Tools */}
        <div className="rounded-2xl border border-slate-700/50 p-8 shadow-lg" style={{background:'rgba(15,23,42,0.55)'}}>
          <h2 className="text-xl font-bold text-white mb-5">Administrator Tools</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title:'User Management',    desc:'Create, edit, and manage user accounts and permissions',  btnText:'Manage Users',  color:'rgba(6,182,212,0.15)',   textColor:'#67e8f9', to:'/products' },
              { title:'Product Management', desc:'Oversee all products and their warranty information',      btnText:'View Products', color:'rgba(16,185,129,0.15)',  textColor:'#34d399', to:'/products' },
              { title:'Warranty Claims',    desc:'Review and process warranty claims and disputes',          btnText:'View Claims',   color:'rgba(251,191,36,0.15)',  textColor:'#fbbf24', to:'/expiring' },
              { title:'Maintenance History',desc:'Full system-wide service and repair history',              btnText:'View History',  color:'rgba(139,92,246,0.15)', textColor:'#c4b5fd', to:'/maintenance' },
            ].map(({ title, desc, btnText, color, textColor, to }) => (
              <div key={title} className="rounded-xl border border-slate-700/30 p-5" style={{background:'rgba(2,6,23,0.50)'}}>
                <h3 className="font-semibold text-white mb-1.5">{title}</h3>
                <p className="text-sm text-slate-400 mb-4">{desc}</p>
                <Link to={to} className="inline-block rounded-lg px-4 py-2 text-sm font-medium transition-colors" style={{background:color,color:textColor}}>
                  {btnText}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="rounded-2xl border border-slate-700/50 p-6" style={{background:'rgba(15,23,42,0.55)'}}>
          <h2 className="text-lg font-bold text-white mb-4">System Status</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            {[
              { label:'Database',     status:'Connected', color:'#34d399' },
              { label:'API Server',   status:'Running',   color:'#34d399' },
              { label:'Frontend',     status:'Ready',     color:'#34d399' },
              { label:'Agent Portal', status:'Active',    color:'#fbbf24' },
            ].map(({ label, status, color }) => (
              <div key={label} className="flex items-center gap-2 rounded-lg border border-slate-700/40 px-4 py-2" style={{background:'rgba(2,6,23,0.50)'}}>
                <span className="h-2 w-2 rounded-full" style={{background:color}}></span>
                <span className="text-slate-300">{label}:</span>
                <span className="font-medium" style={{color}}>{status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};