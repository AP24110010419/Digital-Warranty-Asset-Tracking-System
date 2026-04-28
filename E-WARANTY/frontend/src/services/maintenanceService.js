import api from './api.js';

export const maintenanceService = {
  getAllMaintenance: async () => {
    const response = await api.get('/maintenance');
    return response.data;
  },

  getMaintenanceByProduct: async (productId) => {
    const response = await api.get(`/maintenance/product/${productId}`);
    return response.data;
  },

  getMaintenanceStats: async () => {
    const response = await api.get('/maintenance/stats');
    return response.data;
  },

  createMaintenance: async (data) => {
    const response = await api.post('/maintenance', data);
    return response.data;
  },

  updateMaintenance: async (id, data) => {
    const response = await api.put(`/maintenance/${id}`, data);
    return response.data;
  },

  deleteMaintenance: async (id) => {
    const response = await api.delete(`/maintenance/${id}`);
    return response.data;
  },
};