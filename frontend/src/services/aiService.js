import api from './api';

export const aiService = {
  chat: async (message) => {
    const res = await api.post('/ai/chat', { message });
    return res.data;
  },

  generateStudyPlan: async (planData) => {
    const res = await api.post('/ai/study-plan', planData);
    return res.data;
  },
};
