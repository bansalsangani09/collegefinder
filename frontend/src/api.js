import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  timeout: 10000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth Services
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// College Services
export const getColleges = (params) => api.get('/colleges', { params });
export const getCollege = (id) => api.get(`/colleges/${id}`);
export const compareColleges = (ids) => api.get('/colleges/compare', { params: { ids: ids.join(',') } });
export const addReview = (id, data) => api.post(`/colleges/${id}/reviews`, data);
export const deleteReview = (id, reviewId) => api.delete(`/colleges/${id}/reviews/${reviewId}`);
export const getFilters = (params) => api.get('/colleges/filters', { params });
export const predictColleges = (params) => api.get('/colleges/predict', { params });

// Q&A Services
export const getQuestions = () => api.get('/questions');
export const askQuestion = (data) => api.post('/questions', data);
export const answerQuestion = (id, data) => api.post(`/questions/${id}/answers`, data);
export const updateQuestion = (id, data) => api.put(`/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/questions/${id}`);

// Saved Services
export const getSaved = () => api.get('/saved');
export const saveCollege = (collegeId) => api.post('/saved', { collegeId });
export const unsaveCollege = (collegeId) => api.delete(`/saved/${collegeId}`);
export const getSavedComparisons = () => api.get('/saved/comparisons');
export const saveComparison = (collegeIds, name) => api.post('/saved/comparisons', { collegeIds, name });
export const unsaveComparison = (id) => api.delete(`/saved/comparisons/${id}`);

export default api;
