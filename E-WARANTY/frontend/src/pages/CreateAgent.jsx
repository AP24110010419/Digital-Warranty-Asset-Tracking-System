import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Mail, Lock, User, Phone, Building2, Plus, Trash2, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import api from '../services/api.js';

const EMPTY_FORM = { name:'', email:'', password:'', confirmPassword:'', phone:'', company:'' };

export const CreateAgent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAgents = useCallback(async () => {
    try {
      setAgentsLoading(true);
      const res = await api.get('/auth/agents');
      setAgents(res.data.agents || []);
    } catch { showToast('Failed to load agents', 'error'); }
    finally { setAgentsLoading(false); }
  }, []);

  useEffect(() => {
    if (user?.role !== 'ADMIN') { navigate('/dashboard'); return; }
    fetchAgents();
  }, [user, navigate, fetchAgents]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { showToast('Name, email and password are required', 'error'); return; }
    if (form.password !== form.confirmPassword) { showToast('Passwords do not match', 'error'); return; }
    if (form.password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
    try {
      setLoading(true);
      await api.post('/auth/agents', { name:form.name, email:form.email, password:form.password, phone:form.phone, company:form.company });
      showToast('Agent created successfully!', 'success');
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchAgents();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to create agent', 'error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove agent "${name}"? This cannot be undone.`)) return;
    try {
      setDeletingId(id);
      await api.delete(`/auth/agents/${id}`);
      showToast('Agent removed', 'success');
      setAgents((prev) => prev.filter((a) => a._id !== id));
    } catch { showToast('Failed to remove agent', 'error'); }
    finally { setDeletingId(null); }
  };

  const inp = "w-full rounded-xl border border-slate-700/50 bg-slate-900/60 pl-9 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none transition-all";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-700/50" style={{background:'rgba(2,6,23,0.97)',backdropFilter:'blur(20px)'}}>
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/50 text-slate-400 hover:text-white" style={{background:'rgba(15,23,42,0.60)'}}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{background:'linear-gradient(135deg,#f59e0b,#ea580c)'}}>
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">Admin Panel</p>
                <h1 className="text-lg font-bold text-white">Agent Management</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchAgents} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white border border-slate-700/50" style={{background:'rgba(15,23,42,0.60)'}}>
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg"
              style={{background:'linear-gradient(135deg,#f59e0b,#ea580c)'}}>
              <Plus className="h-4 w-4" /> {showForm ? 'Cancel' : 'Add Agent'}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Create form */}
        {showForm && (
          <div className="rounded-2xl border border-slate-700/50 p-8 shadow-2xl" style={{background:'rgba(8,14,30,0.90)'}}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{background:'linear-gradient(135deg,#f59e0b,#ea580c)'}}>
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Create New Agent</h2>
                <p className="text-sm text-slate-400">Agents can manage customers and warranties on their behalf.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  { label:'Full Name *',        name:'name',            type:'text',     icon:User,      ph:'Jane Smith' },
                  { label:'Email Address *',     name:'email',           type:'email',    icon:Mail,      ph:'jane@company.com' },
                  { label:'Password *',          name:'password',        type:'password', icon:Lock,      ph:'Min. 6 characters' },
                  { label:'Confirm Password *',  name:'confirmPassword', type:'password', icon:Lock,      ph:'Re-enter password' },
                  { label:'Phone',               name:'phone',           type:'tel',      icon:Phone,     ph:'+91 98765 43210' },
                  { label:'Company / Branch',    name:'company',         type:'text',     icon:Building2, ph:'Hyderabad Branch' },
                ].map(({ label, name, type, icon: Icon, ph }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" style={{width:'1rem',height:'1rem'}} />
                      <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={ph} disabled={loading} className={inp} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                  className="rounded-xl border border-slate-700/50 px-5 py-2.5 text-sm text-slate-300 hover:text-white" style={{background:'rgba(15,23,42,0.60)'}}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  style={{background:'linear-gradient(135deg,#f59e0b,#ea580c)'}}>
                  {loading ? <LoadingSpinner /> : <CheckCircle2 className="h-4 w-4" />}
                  {loading ? 'Creating...' : 'Create Agent'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Agents list */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            All Agents {!agentsLoading && <span className="text-sm font-normal text-slate-400">({agents.length})</span>}
          </h2>
          {agentsLoading ? (
            <div className="flex items-center justify-center h-40"><LoadingSpinner /></div>
          ) : agents.length === 0 ? (
            <div className="rounded-2xl border border-slate-700/50 p-12 text-center" style={{background:'rgba(15,23,42,0.40)'}}>
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 text-lg font-medium">No agents yet</p>
              <p className="text-slate-500 text-sm mt-1">Click "Add Agent" to create your first agent account.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <div key={agent._id} className="group rounded-2xl border border-slate-700/50 p-5 transition-all hover:border-slate-600/60" style={{background:'rgba(15,23,42,0.55)'}}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm" style={{background:'linear-gradient(135deg,#f59e0b,#ea580c)'}}>
                        {agent.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{agent.name}</p>
                        <p className="text-xs text-amber-400 font-medium uppercase tracking-wider">Agent</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(agent._id, agent.name)} disabled={deletingId === agent._id}
                      className="opacity-0 group-hover:opacity-100 flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:text-red-300 transition-all"
                      style={{background:'rgba(239,68,68,0.12)'}}>
                      {deletingId === agent._id ? <LoadingSpinner /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-slate-300"><Mail className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" /><span className="truncate">{agent.email}</span></div>
                    {agent.phone   && <div className="flex items-center gap-2 text-slate-300"><Phone     className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" /><span>{agent.phone}</span></div>}
                    {agent.company && <div className="flex items-center gap-2 text-slate-300"><Building2 className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" /><span>{agent.company}</span></div>}
                  </div>
                  <div className="mt-4 border-t border-slate-700/50 pt-3">
                    <p className="text-xs text-slate-500">Created {new Date(agent.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border p-4 flex gap-3 items-start" style={{borderColor:'rgba(99,102,241,0.20)',background:'rgba(99,102,241,0.06)'}}>
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-indigo-400" />
          <p className="text-sm text-slate-400">
            Agents have access to product and warranty features but cannot access admin controls.
            They log in at <span className="text-indigo-300 font-medium">/login/agent</span>.
          </p>
        </div>
      </div>
    </div>
  );
};