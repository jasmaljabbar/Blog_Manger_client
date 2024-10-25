// authUtils.js
import axiosInstance from './axiosConfig';

export const checkAuthStatus = async () => {
    try {
        const response = await axiosInstance.get('/api/check-auth/');  // Create this endpoint
        return response.data.isAuthenticated;
    } catch (error) {
        return false;
    }
};