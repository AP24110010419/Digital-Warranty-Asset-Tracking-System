import { useState, useCallback } from 'react';
import { productService } from '../services/productService.js';
import { warrantyService } from '../services/warrantyService.js';
import { useToast } from './useToast.js';

export const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const { showToast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      setProducts(response.products || []);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await warrantyService.getWarrantyStats();
      setStats(response.stats);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to fetch stats', 'error');
    }
  }, [showToast]);

  const createProduct = useCallback(async (data) => {
    try {
      setLoading(true);
      await productService.createProduct(data);
      showToast('Product added successfully', 'success');
      await fetchProducts();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add product', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, showToast]);

  const updateProduct = useCallback(async (id, data) => {
    try {
      setLoading(true);
      await productService.updateProduct(id, data);
      showToast('Product updated successfully', 'success');
      await fetchProducts();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update product', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, showToast]);

  const deleteProduct = useCallback(async (id) => {
    try {
      setLoading(true);
      await productService.deleteProduct(id);
      showToast('Product deleted successfully', 'success');
      await fetchProducts();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete product', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, showToast]);

  return {
    products,
    loading,
    stats,
    fetchProducts,
    fetchStats,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
