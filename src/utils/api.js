import axios from 'axios';

// Create axios instance with base URL http://localhost:5000/api
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (email, password) => api.post('/auth/register', { email, password }),
    login: (email, password) => api.post('/auth/login', { email, password })
};

// Document API calls
export const documentAPI = {
    upload: (documentData) => api.post('/documents/upload', documentData),
    getAll: () => api.get('/documents'),
    getMy: () => api.get('/documents/my'),
    toggleStar: (id) => api.put(`/documents/${id}/star`)
};

// Admin API calls
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
    deleteDocument: (id) => api.delete(`/admin/documents/${id}`),
    deleteAllDocuments: () => api.delete('/admin/documents')
};

export default api;
