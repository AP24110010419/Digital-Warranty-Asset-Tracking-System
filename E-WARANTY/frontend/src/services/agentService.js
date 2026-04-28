import api from './api.js';

export const agentService = {
  createAgent: async (data) => {
    const response = await api.post('/auth/agents', data);
    return response.data;
  },

  getAgents: async () => {
    const response = await api.get('/auth/agents');
    return response.data;
  },

  deleteAgent: async (id) => {
    const response = await api.delete(`/auth/agents/${id}`);
    return response.data;
  },
};