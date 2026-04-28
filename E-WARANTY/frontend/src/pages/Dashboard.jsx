import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertCircle, CheckCircle, Zap, ShieldCheck, Activity, Shield, MessageSquare } from 'lucide-react';
import { useProduct } from '../hooks/useProduct.js';
import { Navbar } from '../components/Navbar.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useToast } from '../hooks/useToast.js';
import { productService } from '../services/productService.js';


export const Dashboard = () => {
  const { products, loading, stats, fetchProducts, fetchStats } = useProduct();
  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        showToast('Product deleted successfully', 'success');
        fetchProducts();
        fetchStats();
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to delete', 'error');
      }
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="glass card-hover p-6 rounded-3xl border border-slate-700/40 shadow-xl shadow-slate-950/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-3 ${color}`}>{value || 0}</p>
        </div>
        <div className={`rounded-3xl p-3 ${color.replace('text', 'bg')}/15`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="glass glass-strong rounded-[2rem] border border-slate-700/40 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl animate-slideInUp">
              <div className="grid gap-8 lg:grid-cols-[1.6fr_1.4fr] lg:items-center">
                <div className="space-y-6">
                  <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200">
                    <ShieldCheck className="h-4 w-4" />
                    Warranty protection hub
                  </p>
                  <h1 className="text-4xl font-bold text-white sm:text-5xl">Your warranty operations, protected.</h1>
                  <p className="max-w-2xl text-slate-400">
                    Track product registrations, identify expiring warranties, and keep your asset portfolio secure with enterprise-grade warranty management.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link to="/add-product" className="btn-primary text-sm inline-flex items-center justify-center gap-2">
                      Add New Product
                    </Link>
                    <Link to="/maintenance" className="btn-secondary text-sm inline-flex items-center justify-center gap-2">
                      View Maintenance History
                    </Link>
                  </div>
                </div>

                <div className="relative hidden overflow-hidden rounded-[2rem] border border-emerald-500/30 bg-gradient-to-br from-slate-900/80 via-slate-950/80 to-slate-950/80 shadow-2xl shadow-emerald-500/20 lg:flex lg:items-center lg:justify-center">
                  <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                  <div className="relative text-center">
                    <div className="inline-flex items-center justify-center rounded-3xl bg-emerald-500/20 p-8 mb-6 ring-2 ring-emerald-500/30">
                      <Shield className="h-24 w-24 text-emerald-400" strokeWidth={1.5} />
                    </div>
                    <p className="text-emerald-300 font-bold text-lg">Protected by WarrantyHub</p>
                    <p className="text-slate-400 font-medium text-sm mt-1">Enterprise-grade warranty management</p>
                  </div>
                </div>
              </div>
            </div>

            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="space-y-6">
                {stats ? (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
                    <StatCard icon={Package} title="Total Products" value={stats.total} color="text-blue-400" />
                    <StatCard icon={CheckCircle} title="Active Warranties" value={stats.active} color="text-emerald-400" />
                    <StatCard icon={AlertCircle} title="Expiring Soon" value={stats.expiringsSoon} color="text-amber-400" />
                    <StatCard icon={Zap} title="Expired" value={stats.expired} color="text-rose-400" />
                  </div>
                ) : (
                  <div className="glass p-8 rounded-3xl border border-slate-700/40 text-center">
                    <LoadingSpinner />
                  </div>
                )}

                <div className="glass rounded-[2rem] border border-emerald-500/30 bg-slate-950/90 p-6 shadow-xl shadow-emerald-500/10">
                  <div className="flex items-center gap-4">
                    <Activity className="h-7 w-7 text-emerald-400" />
                    <div>
                      <h2 className="text-xl font-semibold text-white">Warranty Protection Insights</h2>
                      <p className="text-sm text-slate-400">Stay ahead of deadlines with real-time alerts and notifications for your critical warranties.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass rounded-[2rem] border border-slate-700/40 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Service readiness</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 rounded-3xl border border-slate-700/60 bg-slate-900/70 p-4">
                      <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                        <CheckCircle className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-white">24/7 purchase history access</p>
                        <p className="text-sm text-slate-400">Quickly review warranty start dates and asset details anytime.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 rounded-3xl border border-slate-700/60 bg-slate-900/70 p-4">
                      <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                        <Package className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-white">Product snapshots</p>
                        <p className="text-sm text-slate-400">Important product details are always grouped for easy review.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="glass rounded-[2rem] border border-slate-700/40 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-emerald-600/15 text-emerald-300">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Quick actions</p>
                      <h3 className="text-lg font-semibold text-white">Fast access menu</h3>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Link className="btn-secondary block text-center" to="/products">
                      View all products
                    </Link>
                    <Link className="btn-secondary block text-center" to="/maintenance">
                      Review maintenance logs
                    </Link>
                    <Link className="btn-primary block text-center" to="/assistant">
                      <span className="inline-flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Ask the AI Assistant
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Recent Products</h2>
                  <p className="text-sm text-slate-400">A curated view of your latest warranty entries.</p>
                </div>
                <Link to="/add-product" className="btn-primary text-sm">
                  Add New Product
                </Link>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {products.slice(0, 6).map((product) => (
                    <ProductCard key={product._id} product={product} onDelete={handleDelete} />
                  ))}
                </div>
              ) : (
                <div className="glass rounded-[2rem] border border-slate-700/40 bg-slate-950/90 p-12 text-center shadow-xl shadow-slate-950/10">
                  <Package className="mx-auto mb-4 h-16 w-16 text-slate-500" />
                  <p className="text-slate-400 mb-4">No products yet. Add your first warranty to get started.</p>
                  <Link to="/add-product" className="btn-primary inline-flex items-center justify-center gap-2">
                    + Add Product
                  </Link>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};
