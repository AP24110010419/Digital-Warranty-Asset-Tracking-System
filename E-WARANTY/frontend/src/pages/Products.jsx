import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Grid3X3 } from 'lucide-react';
import { useProduct } from '../hooks/useProduct.js';
import { Navbar } from '../components/Navbar.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useToast } from '../hooks/useToast.js';
import { productService } from '../services/productService.js';

export const Products = () => {
  const { products, loading, fetchProducts } = useProduct();
  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

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
              <div className="glass glass-strong rounded-[2rem] border border-emerald-500/30 bg-slate-950/95 p-8 flex-1 shadow-xl shadow-emerald-500/10">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-emerald-500/20 p-4 ring-2 ring-emerald-500/30">
                    <Grid3X3 className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Product Inventory</h1>
                    <p className="text-emerald-300 mt-1 font-medium">Manage all your registered products and warranties</p>
                  </div>
                </div>
              </div>
              <Link
                to="/add-product"
                className="btn-primary inline-flex items-center gap-2 h-fit"
              >
                <Plus className="w-5 h-5" />
                Add New Product
              </Link>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="glass glass-strong rounded-[2rem] border border-emerald-500/30 bg-slate-950/90 p-12 text-center shadow-xl shadow-emerald-500/10">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-3xl bg-emerald-500/20 p-6 ring-2 ring-emerald-500/30">
                    <Package className="h-16 w-16 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Products Yet</h3>
                <p className="text-slate-400 mb-6">Start by adding your first product to manage its warranty and documentation.</p>
                <Link
                  to="/add-product"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Product
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
