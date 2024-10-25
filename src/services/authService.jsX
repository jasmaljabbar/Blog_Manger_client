import api from './api';

// Function to login
export const login = async (credentials) => {
    const response = await api.post('/token/', credentials);
    localStorage.setItem('user', JSON.stringify(response.data)); // Store user and tokens
    return response.data;
};

// Function to refresh the access token
export const refreshAccessToken = async () => {
    const tokens = JSON.parse(localStorage.getItem('user'));
    const refresh = tokens.tokens.refresh

    if (!tokens || !refresh) {
        throw new Error('No refresh token available');
    } else {
        console.log('Refresh token:', refresh);
    }

    try {
        const response = await api.post('token/refresh/', {  
            refresh: refresh,
        });

        // Update the token in localStorage if successful
        localStorage.setItem('user', JSON.stringify({
            ...tokens,
            tokens: {
                ...tokens.tokens,
                access: response.data.access,  // Update access token with the new one
            }
        }));

        return response.data.access;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;  // You can handle it or rethrow it
    }
};
    
    
   