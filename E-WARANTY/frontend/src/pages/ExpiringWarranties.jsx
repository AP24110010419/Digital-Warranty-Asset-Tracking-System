import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Plus } from 'lucide-react';
import { useProduct } from '../hooks/useProduct.js';
import { Navbar } from '../components/Navbar.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useToast } from '../hooks/useToast.js';
import { productService } from '../services/productService.js';

export const ExpiringWarranties = () => {
  const { products, loading, fetchProducts } = useProduct();
  const { showToast } = useToast();
  const [expiringProducts, setExpiringProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products that are expiring soon or already expired
    const expiring = products.filter((product) => {
      const status = product.warranty?.status;
      return status === 'EXPIRING_SOON' || status === 'EXPIRED';
    });
    setExpiringProducts(expiring);
  }, [products]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        showToast('Product deleted successfully', 'success');
        fetchProducts();
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to delete', 'error');
      }
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-lg bg-emerald-500/20 p-2 ring-2 ring-emerald-500/30">
                    <AlertTriangle className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h1 className="text-4xl font-bold text-white">Expiring Soon</h1>
                </div>
                <p className="text-emerald-300 mt-1 font-medium">Products with warranties expiring within 90 days or already expired</p>
              </div>
              <Link
                to="/add-product"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 shadow-lg shadow-emerald-500/30"
              >
                <Plus className="w-5 h-5" />
                Add New Product
              </Link>
            </div>

            {/* Alert Banner */}
            {expiringProducts.length > 0 && (
              <div className="mb-8 rounded-[2rem] border border-emerald-500/30 bg-emerald-500/10 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-100">Action Required</h3>
                    <p className="text-emerald-100/80 mt-1">
                      You have {expiringProducts.length} product{expiringProducts.length !== 1 ? 's' : ''} with warranties expiring soon or already expired. Please take action to renew or replace these warranties.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : expiringProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {expiringProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="glass rounded-[2rem] border border-emerald-500/30 bg-slate-950/90 p-12 text-center shadow-xl shadow-emerald-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-3xl bg-emerald-500/20 p-6 ring-2 ring-emerald-500/30">
                    <AlertTriangle className="h-16 w-16 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">All Warranties Active</h3>
                <p className="text-slate-400 mb-6">Great news! None of your products have warranties expiring soon. Keep your portfolio protected and check back regularly.</p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 shadow-lg shadow-emerald-500/30"
                >
                  View All Products
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
