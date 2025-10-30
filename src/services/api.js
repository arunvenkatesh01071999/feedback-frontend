import api from './apiConfig';

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
};

export const feedbackService = {
  getFeedbacks: (filters) => api.get('/feedbacks', { params: filters }),
  createFeedback: (feedbackData) => api.post('/feedbacks/', feedbackData),
  upvoteFeedback: (id) => api.post(`/feedbacks/${id}/vote`),
  updateFeedback: (id, updateData) => api.put(`/feedbacks/${id}`, updateData),
};