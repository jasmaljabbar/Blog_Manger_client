import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout, updateToken } from '../redux/actions/userActions';

const axiosInstance = axios.create({
    baseURL: 'https://blogmanger-production.up.railway.app/',
});

const useAxiosInstance = () => {
    const dispatch = useDispatch();

    axiosInstance.interceptors.request.use(
        async (config) => {
            const accessToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).access : null;
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response && error.response.status === 401 && !originalRequest._retry) {

                
                originalRequest._retry = true;
                try {
                    const result = await dispatch(updateToken());
                    if (result.payload) {
                        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${result.payload.accessToken}`;
                        originalRequest.headers['Authorization'] = `Bearer ${result.payload.accessToken}`;
                        console.log(result.payload.accessToken);
                        
                        return axiosInstance(originalRequest);
                    }
                } catch (error) {
                    console.log('.......................................');
                    
                    dispatch(logout());
                    
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxiosInstance;