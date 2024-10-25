import {createAsyncThunk, isRejectedWithValue} from '@reduxjs/toolkit'
import axios from 'axios'
import api, {URL} from "../../services/api"
import { config, configMultiPart } from '../../Common/configurations'
import { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const userActions = createContext();
export default userActions;

// Thunk action to log out a user
export const logout = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user || !user.refresh || !user.access) {
                throw new Error("No valid tokens found.");
            }

            const refreshToken = user.refresh;
            const accessToken = user.access;

            // Axios config with headers, including the access token for authentication
            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,  // Send access token in the Authorization header
                },
            };

            // Send the logout request with the refresh token in the body
            console.log(refreshToken);
            
            const { data } = await axios.post(`${URL}/logout/`, { refresh: refreshToken }, config);

            // Clear local storage after successful logout
            localStorage.removeItem('user');
            localStorage.clear();

            return data;

        } catch (error) {
            localStorage.removeItem('user');
            localStorage.clear();
            console.error("Logout failed:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data);
        }
    }
);

// Thunk action to log in a user
export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (userCredentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${URL}/login/`,
                userCredentials
            );
            // Store the user data including tokens in localStorage
            localStorage.setItem('user', JSON.stringify(response.data));
            
            return response.data;  // Return the complete response data
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Thunk action to sign up a user
export const signUpUser = createAsyncThunk(
    "user/signUpUser",
    async (userCredentials, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                `${URL}/register/`,
                userCredentials
            );
            // Store the user data including tokens in localStorage
            localStorage.setItem('user', JSON.stringify(data));
            
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const userData = createAsyncThunk(
    "user/userData",
    async (_, { rejectWithValue }) => {
        try {
            // Fetch user data
            const { data } = await api.get('/api/user/');

            // Optionally store in localStorage
            localStorage.setItem('userData', JSON.stringify(data));

            // Return the data to be used in Redux state
            return data;
        } catch (error) {
            console.error("Error fetching user data:", error);

            // Return a more informative error
            return rejectWithValue(error.response?.data || 'Error fetching user data');
        }
    }
);

