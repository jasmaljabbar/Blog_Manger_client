import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://blogmanger-production.up.railway.app',  // Your Django backend URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true  // Important for handling cookies and authentication
});

export default axiosInstance;
