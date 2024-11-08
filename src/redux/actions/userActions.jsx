import {createAsyncThunk, isRejectedWithValue} from '@reduxjs/toolkit'
import axios from 'axios'
import  {URL} from "../../services/api"
import { config, configMultiPart } from '../../Common/configurations'
import { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import useAxiosInstance from '../../services/axiosInstance';

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

export const token_valid = createAsyncThunk(
    'user/token_valid',
    async (_, { rejectWithValue }) => {
      try {
        // Replace this URL with the actual endpoint to validate the token
        const response = await axios.get('/api/auth/validate_token', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue('Invalid token');
      }
    }
  );

export const updateToken = createAsyncThunk(
    "user/updateToken",
    async (_, { rejectWithValue }) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.refresh) {
                throw new Error("No valid refresh token found.");
            }

            const refreshToken = user.refresh;
            
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            // Sending the refresh token in the request body
            const response = await axios.post(`${URL}/token/refresh/`, { refresh: refreshToken });
           
            
            // Return the response data
            return response.data;
        } catch (error) {
            console.log(refreshToken);
            
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);




