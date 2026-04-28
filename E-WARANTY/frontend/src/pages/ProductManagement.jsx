import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Plus, Search } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import api from '../services/api.js';

export const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        if (response.data.products) {
          setProducts(response.data.products);
        } else if (Array.isArray(response.data)) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        showToast(error.response?.data?.message || 'Failed to load products', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showToast]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-950/95 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="rounded-lg p-2 hover:bg-slate-700/30 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Package className="h-8 w-8 text-emerald-300" />
                  Product Management
                </h1>
                <p className="mt-1 text-slate-400">Manage all products and warranties</p>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-emerald-600/20 px-4 py-2 text-emerald-300 hover:bg-emerald-600/30 transition-colors">
              <Plus className="h-5 w-5" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner fullScreen />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Package className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No products found</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product._id} className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 hover:bg-slate-900/70 transition-colors cursor-pointer">
                  <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-sm text-slate-400 mb-3">{product.brand}</p>
                  <div className="space-y-2 text-sm text-slate-300 mb-4">
                    <p>Model: {product.model || '—'}</p>
                    <p>Serial: {product.serialNumber || '—'}</p>
                    <p className="text-xs mt-3">
                      <span className="px-2 py-1 rounded-full bg-emerald-600/20 text-emerald-300">
                        {product.warrantyType}
                      </span>
                    </p>
                  </div>
                  <button className="w-full rounded-lg bg-emerald-600/20 px-3 py-2 text-sm text-emerald-300 hover:bg-emerald-600/30 transition-colors">
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
