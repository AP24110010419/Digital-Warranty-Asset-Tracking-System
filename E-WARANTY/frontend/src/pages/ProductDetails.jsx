import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, DollarSign, AlertCircle, ShieldCheck, Package, Sparkles } from 'lucide-react';
import { Navbar } from '../components/Navbar.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { WarrantyBadge } from '../components/WarrantyBadge.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useToast } from '../hooks/useToast.js';
import { productService } from '../services/productService.js';
import { maintenanceService } from '../services/maintenanceService.js';

const formatCurrency = (value) => {
  if (value == null || Number.isNaN(value)) return '0';
  return Number(value).toLocaleString();
};

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    type: 'MAINTENANCE',
    date: new Date().toISOString().split('T')[0],
    description: '',
    cost: '',
    technician: '',
    notes: '',
  });

  useEffect(() => {
    fetchProductDetails();
    fetchMaintenance();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await productService.getProductById(id);
      setProduct(response.product);
    } catch (error) {
      showToast('Failed to load product details', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenance = async () => {
    try {
      const response = await maintenanceService.getMaintenanceByProduct(id);
      setMaintenance(response.maintenance || []);
    } catch (error) {
      showToast('Failed to load maintenance history', 'error');
    }
  };

  const handleMaintenanceChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMaintenance = async (e) => {
    e.preventDefault();
    try {
      await maintenanceService.createMaintenance({
        ...maintenanceForm,
        productId: id,
        cost: parseFloat(maintenanceForm.cost),
      });
      showToast('Maintenance record added!', 'success');
      setShowMaintenanceForm(false);
      setMaintenanceForm({
        type: 'MAINTENANCE',
        date: new Date().toISOString().split('T')[0],
        description: '',
        cost: '',
        technician: '',
        notes: '',
      });
      fetchMaintenance();
    } catch (error) {
      showToast('Failed to add maintenance record', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <LoadingSpinner fullScreen />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">Product not found</p>
              <button onClick={() => navigate('/dashboard')} className="btn-primary">
                Back to Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="glass rounded-[2rem] border border-slate-700/40 bg-slate-950/95 p-7 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="flex flex-col gap-5 lg:flex-row lg:justify-between lg:items-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                    <ShieldCheck className="h-4 w-4" />
                    Warranty overview
                  </div>
                  <h1 className="text-4xl font-semibold text-white">{product.name}</h1>
                  <p className="text-slate-400">{product.category} · {product.manufacturer || 'Unknown manufacturer'}</p>
                </div>
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-slate-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              </div>
            </div>

            <section className="grid gap-6 lg:grid-cols-[2.4fr_1fr]">
              <div className="glass rounded-[2rem] border border-slate-700/40 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Product Details</h2>
                    <p className="mt-1 text-slate-400">Everything you need to know about this asset.</p>
                  </div>
                  <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-200">
                    {product.serialNumber || 'Serial not available'}
                  </span>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/70 p-5">
                    <p className="text-slate-400 text-sm">Manufacturer</p>
                    <p className="mt-2 text-white font-medium">{product.manufacturer || 'N/A'}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/70 p-5">
                    <p className="text-slate-400 text-sm">Category</p>
                    <p className="mt-2 text-white font-medium">{product.category}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/70 p-5">
                    <p className="text-slate-400 text-sm">Model Number</p>
                    <p className="mt-2 text-white font-medium">{product.modelNumber || 'N/A'}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/70 p-5">
                    <p className="text-slate-400 text-sm">Purchase Price</p>
                    <p className="mt-2 text-white font-medium">₹{formatCurrency(product.purchasePrice)}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  {product.description && (
                    <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-5">
                      <p className="text-slate-400 text-sm">Description</p>
                      <p className="mt-3 text-slate-100">{product.description}</p>
                    </div>
                  )}

                  {product.notes && (
                    <div className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-5">
                      <p className="text-slate-400 text-sm">Notes</p>
                      <p className="mt-3 text-slate-100">{product.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <aside className="space-y-6">
                <div className="glass rounded-[2rem] border border-slate-700/40 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-cyan-300" />
                    <h2 className="text-xl font-semibold text-white">Warranty Snapshot</h2>
                  </div>
                  <div className="mt-6 space-y-4">
                    {product.warranty ? (
                      <>
                        <div className="rounded-3xl border border-slate-700/50 bg-slate-900/65 p-4">
                          <WarrantyBadge
                            status={product.warranty.status}
                            daysRemaining={product.warranty.daysRemaining}
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="rounded-3xl bg-slate-900/70 p-4">
                            <p className="text-slate-400 text-sm">Purchase Date</p>
                            <p className="mt-2 flex items-center gap-2 text-white font-medium">
                              <Calendar className="h-4 w-4 text-slate-400" />
                              {new Date(product.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="rounded-3xl bg-slate-900/70 p-4">
                            <p className="text-slate-400 text-sm">Expiry Date</p>
                            <p className="mt-2 text-white font-medium">{new Date(product.warranty.expiryDate).toLocaleDateString()}</p>
                          </div>
                          <div className="rounded-3xl bg-slate-900/70 p-4">
                            <p className="text-slate-400 text-sm">Days Remaining</p>
                            <p className="mt-2 text-white font-medium">{product.warranty.daysRemaining} days</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-slate-400">Warranty details are not available for this product.</p>
                    )}
                  </div>
                </div>

                {(product.invoiceUrl || product.warrantyDocUrl) && (
                  <div className="glass rounded-[2rem] border border-slate-700/40 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Documents</h3>
                    <div className="space-y-3">
                      {product.invoiceUrl && (
                        <a
                          href={product.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-3xl border border-slate-700/50 bg-slate-900/60 px-4 py-3 text-sm text-cyan-300 transition hover:bg-slate-900"
                        >
                          <Download className="h-4 w-4" />
                          Download Invoice
                        </a>
                      )}
                      {product.warrantyDocUrl && (
                        <a
                          href={product.warrantyDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-3xl border border-slate-700/50 bg-slate-900/60 px-4 py-3 text-sm text-cyan-300 transition hover:bg-slate-900"
                        >
                          <Download className="h-4 w-4" />
                          Download Warranty Document
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </aside>
            </section>

            <section className="glass rounded-[2rem] border border-slate-700/40 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Maintenance History</h2>
                  <p className="text-slate-400">Track service and repair records for this asset.</p>
                </div>
                <button
                  onClick={() => setShowMaintenanceForm(!showMaintenanceForm)}
                  className="btn-primary"
                >
                  {showMaintenanceForm ? 'Hide form' : '+ Add record'}
                </button>
              </div>

              {showMaintenanceForm && (
                <div className="glass mt-6 rounded-[1.75rem] border border-slate-700/40 bg-slate-900/85 p-6">
                  <form onSubmit={handleAddMaintenance} className="space-y-5">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                        <select
                          name="type"
                          value={maintenanceForm.type}
                          onChange={handleMaintenanceChange}
                          className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                        >
                          <option>REPAIR</option>
                          <option>MAINTENANCE</option>
                          <option>INSPECTION</option>
                          <option>REPLACEMENT</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={maintenanceForm.date}
                          onChange={handleMaintenanceChange}
                          className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={maintenanceForm.description}
                        onChange={handleMaintenanceChange}
                        placeholder="Describe the maintenance work"
                        rows="4"
                        className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                        required
                      />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Cost</label>
                        <input
                          type="number"
                          name="cost"
                          value={maintenanceForm.cost}
                          onChange={handleMaintenanceChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Technician</label>
                        <input
                          type="text"
                          name="technician"
                          value={maintenanceForm.technician}
                          onChange={handleMaintenanceChange}
                          placeholder="Technician name"
                          className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <button type="submit" className="btn-primary rounded-2xl px-5 py-3">
                        Save record
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMaintenanceForm(false)}
                        className="btn-secondary rounded-2xl px-5 py-3"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="mt-6 space-y-4">
                {maintenance.length > 0 ? (
                  maintenance.map((record) => (
                    <div key={record._id} className="glass rounded-[1.75rem] border border-slate-700/40 bg-slate-950/95 p-6 shadow-xl shadow-slate-950/15">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300`}>{record.type}</span>
                            <p className="text-slate-400 text-sm">{new Date(record.date).toLocaleDateString()}</p>
                          </div>
                          <p className="text-white text-lg font-semibold">{record.description}</p>
                          <p className="text-slate-300">{record.notes || 'No additional notes available.'}</p>
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
                  ))
                ) : (
                  <div className="glass rounded-[1.75rem] border border-slate-700/40 bg-slate-950/95 p-8 text-center shadow-xl shadow-slate-950/15">
                    <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900/70 text-cyan-300">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <p className="text-slate-400">No maintenance records yet. Use the form above to save your first report.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};