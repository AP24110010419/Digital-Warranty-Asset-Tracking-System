import api from './api.js';

export const aiService = {
  assist: async (prompt) => {
    const response = await api.post('/ai/assist', { prompt });
    return response.data;
  },
};
