import React, { useState, useEffect } from 'react';
import { Wrench, Package, Calendar, DollarSign, ClipboardList, Sparkles } from 'lucide-react';
import { Navbar } from '../components/Navbar.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useToast } from '../hooks/useToast.js';
import { maintenanceService } from '../services/maintenanceService.js';

export const MaintenanceHistory = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchMaintenance();
    fetchStats();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const response = await maintenanceService.getAllMaintenance();
      setMaintenance(response.maintenance || []);
    } catch (error) {
      showToast('Failed to load maintenance records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await maintenanceService.getMaintenanceStats();
      setStats(response.stats);
    } catch (error) {
      showToast('Failed to load maintenance stats', 'error');
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="glass p-6 rounded-2xl border border-emerald-500/30 bg-slate-950/80 shadow-lg shadow-emerald-500/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value || 0}</p>
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text', 'bg')}/20 ring-2 ${color.replace('text', 'ring')}/30`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const getTypeColor = (type) => {
    switch (type) {
      case 'REPAIR':
        return 'bg-red-900/30 text-red-400 border-red-500/30';
      case 'MAINTENANCE':
        return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      case 'INSPECTION':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
      case 'REPLACEMENT':
        return 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-900/30 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <section className="glass rounded-[2rem] border border-emerald-500/30 bg-slate-950/95 p-8 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                    <ClipboardList className="h-4 w-4" />
                    Maintenance analytics
                  </div>
                  <div>
                    <h1 className="text-4xl font-semibold text-white">Maintenance History</h1>
                    <p className="text-slate-400">Monitor repair events, inspections, and service costs in one clean workspace.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="btn-primary rounded-2xl px-5 py-3">Export Report</button>
                  <button className="btn-secondary rounded-2xl px-5 py-3">Add New Record</button>
                </div>
              </div>
            </section>

            {stats && (
              <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={Wrench} title="Total Records" value={stats.total} color="text-blue-400" />
                <StatCard icon={Package} title="Repairs" value={stats.byType?.repair} color="text-red-400" />
                <StatCard icon={Calendar} title="Maintenance" value={stats.byType?.maintenance} color="text-cyan-400" />
                <StatCard icon={DollarSign} title="Total Cost" value={`₹${stats.totalCost?.toLocaleString() || 0}`} color="text-green-400" />
              </section>
            )}

            <section className="space-y-4">
              {loading ? (
                <LoadingSpinner />
              ) : maintenance.length > 0 ? (
                <div className="grid gap-5">
                  {maintenance.map((record) => (
                    <div key={record._id} className="glass rounded-[1.75rem] border border-slate-700/40 bg-slate-950/95 p-6 shadow-xl shadow-slate-950/15 transition hover:-translate-y-1">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getTypeColor(record.type)}`}>{record.type}</span>
                            <p className="text-slate-400 text-sm">{new Date(record.date).toLocaleDateString()}</p>
                          </div>
                          <p className="text-white text-lg font-semibold">{record.description}</p>
                          <p className="text-slate-300">{record.notes || 'No additional notes provided.'}</p>
                        </div>
                        <div className="grid gap-4 text-right">
                          {record.technician && (
                            <div>
                              <p className="text-slate-400 text-sm">Technician</p>
                              <p className="text-white font-medium">{record.technician}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-slate-400 text-sm">Cost</p>
                            <p className="text-2xl font-semibold text-green-400">₹{record.cost ?? '0'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass rounded-[2rem] border border-slate-700/40 bg-slate-950/95 p-12 text-center shadow-xl shadow-slate-950/15">
                  <Sparkles className="mx-auto mb-4 h-16 w-16 text-slate-500" />
                  <p className="text-slate-400">No maintenance records yet. Add your first record to begin tracking service history.</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};