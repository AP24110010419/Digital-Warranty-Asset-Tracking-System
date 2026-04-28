import api from './api.js';

export const warrantyService = {
  getWarranties: async () => {
    const response = await api.get('/warranties');
    return response.data;
  },

  getWarrantyById: async (id) => {
    const response = await api.get(`/warranties/${id}`);
    return response.data;
  },

  getExpiringWarranties: async () => {
    const response = await api.get('/warranties/expiring/list');
    return response.data;
  },

  updateWarrantyStatus: async () => {
    const response = await api.put('/warranties/status/update');
    return response.data;
  },

  markAsNotified: async (id) => {
    const response = await api.put(`/warranties/${id}/notify`);
    return response.data;
  },

  getWarrantyStats: async () => {
    const response = await api.get('/warranties/stats/summary');
    return response.data;
  },
};
