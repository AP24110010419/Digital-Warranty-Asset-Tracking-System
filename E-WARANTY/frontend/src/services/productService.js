import api from './api.js';

export const productService = {
  createProduct: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'invoice' || key === 'warrantyDoc' || key === 'productImage') {
        if (data[key]?.[0]) {
          formData.append(key, data[key][0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    });

    const response = await api.post('/products', formData);
    return response.data;
  },

  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'invoice' || key === 'warrantyDoc' || key === 'productImage') {
        if (data[key]?.[0]) {
          formData.append(key, data[key][0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    });

    const response = await api.put(`/products/${id}`, formData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/products/stats/dashboard');
    return response.data;
  },
};
