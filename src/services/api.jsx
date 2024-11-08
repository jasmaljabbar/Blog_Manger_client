export const URL = "https://blogmanger-production.up.railway.app";

import axios from 'axios';

const api = axios.create({
    baseURL: 'https://blogmanger-production.up.railway.app/',
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