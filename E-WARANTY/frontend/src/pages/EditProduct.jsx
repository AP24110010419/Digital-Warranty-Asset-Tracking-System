import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useToast } from '../hooks/useToast.js';
import { productService } from '../services/productService.js';

export const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    purchaseDate: '',
    purchasePrice: '',
    warrantyPeriod: '',
    serialNumber: '',
    modelNumber: '',
    manufacturer: '',
    notes: '',
  });

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await productService.getProductById(id);
      const prod = response.product;
      setProduct(prod);

      // Check if edit limit reached
      if (prod.editCount >= 2) {
        showToast('Edit limit reached (2 edits maximum)', 'error');
        navigate(`/product/${id}`);
        return;
      }

      setFormData({
        name: prod.name,
        description: prod.description || '',
        category: prod.category,
        purchaseDate: new Date(prod.purchaseDate).toISOString().split('T')[0],
        purchasePrice: prod.purchasePrice,
        warrantyPeriod: prod.warrantyPeriod,
        serialNumber: prod.serialNumber || '',
        modelNumber: prod.modelNumber || '',
        manufacturer: prod.manufacturer || '',
        notes: prod.notes || '',
      });
    } catch (error) {
      showToast('Failed to load product', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.purchaseDate || !formData.purchasePrice || !formData.warrantyPeriod) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSaving(true);
      await productService.updateProduct(id, {
        ...formData,
        purchasePrice: parseFloat(formData.purchasePrice),
        warrantyPeriod: parseInt(formData.warrantyPeriod),
      });
      showToast('Product updated successfully!', 'success');
      navigate(`/product/${id}`);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update product', 'error');
    } finally {
      setSaving(false);
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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8 rounded-[2rem] border border-amber-500/30 bg-gradient-to-r from-slate-900 to-slate-950 p-8 shadow-xl shadow-amber-500/10">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-amber-500/20 p-3 ring-2 ring-amber-500/30">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => navigate(`/product/${id}`)}
                      className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-amber-400" />
                    </button>
                  </div>
                  <h1 className="text-4xl font-bold text-white">Edit Product</h1>
                  <p className="text-amber-300 mt-1 font-medium">
                    Edit Count: {product.editCount}/2 - {2 - product.editCount} edit(s) remaining
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl border border-amber-500/20 bg-slate-950/90 shadow-xl shadow-amber-500/10">
              {/* Product Info */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Product Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Product Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., iPhone 14 Pro"
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Optional product description..."
                      rows="3"
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                      >
                        <option>Electronics</option>
                        <option>Appliances</option>
                        <option>Furniture</option>
                        <option>Tools</option>
                        <option>Vehicles</option>
                        <option>Medical</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Manufacturer</label>
                      <input
                        type="text"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleChange}
                        placeholder="Brand/Manufacturer"
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Serial Number</label>
                      <input
                        type="text"
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleChange}
                        placeholder="Serial/IMEI"
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Model Number</label>
                      <input
                        type="text"
                        name="modelNumber"
                        value={formData.modelNumber}
                        onChange={handleChange}
                        placeholder="Model/Version"
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Warranty Info */}
              <div className="mb-8 pb-8 border-b border-slate-700/50">
                <h2 className="text-xl font-semibold text-white mb-4">Warranty Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Purchase Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Purchase Price <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        name="purchasePrice"
                        value={formData.purchasePrice}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Warranty Period (Months) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="warrantyPeriod"
                      value={formData.warrantyPeriod}
                      onChange={handleChange}
                      placeholder="12"
                      min="1"
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any additional information..."
                      rows="2"
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/product/${id}`)}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
