import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Users, Package, AlertCircle, Clock, Plus, Search, Briefcase } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';

export const AgentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  const stats = [
    { label:'Assigned Customers', value:'—', icon:Users,        color:'#fbbf24', bg:'rgba(251,191,36,0.12)' },
    { label:'Active Warranties',  value:'—', icon:Package,      color:'#34d399', bg:'rgba(52,211,153,0.12)' },
    { label:'Expiring Soon',      value:'—', icon:AlertCircle,  color:'#f87171', bg:'rgba(248,113,113,0.12)' },
    { label:'Pending Actions',    value:'—', icon:Clock,        color:'#818cf8', bg:'rgba(129,140,248,0.12)' },
  ];

  const quickActions = [
    { label:'Register Product',    desc:'Add a new product for a customer',       icon:Plus,         to:'/add-product', color:'#f59e0b' },
    { label:'Browse Products',     desc:'Search and manage all products',          icon:Search,       to:'/products',    color:'#34d399' },
    { label:'Expiring Warranties', desc:'Review warranties expiring soon',         icon:AlertCircle,  to:'/expiring',    color:'#f87171' },
    { label:'Maintenance Logs',    desc:'View full service history',               icon:Clock,        to:'/maintenance', color:'#818cf8' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-slate-700/50" style={{background:'rgba(2,6,23,0.97)',backdropFilter:'blur(20px)'}}>
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{background:'linear-gradient(135deg,#f59e0b,#ea580c)'}}>
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Agent Workspace</p>
              <h1 className="text-xl font-bold text-white">Welcome, {user?.name || 'Agent'}</h1>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-300 transition-colors" style={{background:'rgba(239,68,68,0.12)'}}>
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl border border-slate-700/50 p-6 shadow-lg" style={{background:'rgba(15,23,42,0.60)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{background:bg,color}}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map(({ label, desc, icon: Icon, to, color }) => (
              <Link key={label} to={to}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-700/50 p-5 transition-all hover:-translate-y-0.5 hover:border-slate-600/60"
                style={{background:'rgba(15,23,42,0.55)'}}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{background:`${color}18`,color}}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">{label}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border p-5 flex gap-4 items-start" style={{borderColor:'rgba(251,191,36,0.20)',background:'rgba(251,191,36,0.06)'}}>
          <Briefcase className="h-5 w-5 mt-0.5 flex-shrink-0" style={{color:'#fbbf24'}} />
          <div>
            <p className="font-medium text-amber-300">Agent Account</p>
            <p className="text-sm text-slate-400 mt-1">
              You are signed in as <span className="text-white font-medium">{user?.email}</span>.
              Contact an administrator if you need elevated permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};