export const URL = "http://127.0.0.1:8000";

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/',
});

// Optional: You can set up interceptors here for adding tokens to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).access : null;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;