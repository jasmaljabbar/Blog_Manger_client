import {createSlice} from '@reduxjs/toolkit'
import { loginUser,signUpUser,logout, updateToken, token_valid } from '../actions/userActions'



const userSlice = createSlice({
    name:"user",
    initialState:{
        loading: false,
        user: JSON.parse(localStorage.getItem('user')) || null,
        accessToken:null,
        refreshToken:null,
        isAuthenticated: !!localStorage.getItem('user'),
        userData:null,
        error: null,
    },
    reducers:{},
    extraReducers: (builder) =>{
        builder
        //Logout States
        .addCase(logout.pending, (state)=>{
            state.loading = true;
        })
        .addCase(logout.fulfilled,(state)=>{
            state.loading = false;
            state.error = null;
            state.userData = null;
            state.isAuthenticated = false;
            state.user  = null;
        })
        .addCase(logout.rejected, (state, {payload})=>{
            state.loading = false;
            state.user = null;
            state.userData = null;
            state.error = payload;
        })
        // Login States
        .addCase(loginUser.pending, (state)=>{
            state.loading = true;
        })
        .addCase(loginUser.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.error = null;
            state.user = payload;
            state.accessToken = payload.tokens.access;
            state.refreshToken = payload.tokens.refresh;
            state.isAuthenticated = true;
            localStorage.setItem('userData', JSON.stringify(payload))
            localStorage.setItem('user', JSON.stringify(payload.tokens));

        })
        .addCase(loginUser.rejected, (state, {payload})=>{
            state.loading = false;
            state.user = null;
            state.error = payload;
        })
        // updateToken States
        .addCase(updateToken.pending, (state)=>{
            state.loading = true
        })
        .addCase(updateToken.fulfilled, (state, {payload})=>{
            state.loading = false;
            state.error = null;
            state.user = payload;
            console.log(payload);
            
            localStorage.setItem('user', JSON.stringify(payload));
        })
        .addCase(updateToken.rejected, (state, {payload})=>{
            state.loading = false;
            state.user = null;
            state.error = payload
        })
        .addCase(token_valid.pending,(state)=>{
            state.loading = true;
        })
        .addCase(token_valid.fulfilled,(state)=>{
            state.loading = false;
            state.isAuthenticated = true;
            state.error = null;
        })
        .addCase(token_valid.rejected, (state, {payload})=>{
            state.loading = false;
            state.error = payload;
        })
        // Sign-Up States
        .addCase(signUpUser.pending, (state)=>{
            state.loading = true;
        })
        .addCase(signUpUser.fulfilled, (state, {payload})=>{
            state.loading = false;
            state.accessToken = payload.tokens.access;
            state.refreshToken = payload.tokens.refresh;
            state.isAuthenticated = true;
            state.error = null;
            state.user = payload;
            localStorage.setItem('userData', JSON.stringify(payload))
            localStorage.setItem('user', JSON.stringify(payload.tokens));
        })
        .addCase(signUpUser.rejected, (state, {payload})=>{
            state.loading = false;
            state.user = null;
            state.error = payload;
        })
    } 
    
})


export const userReducer = userSlice.reducer;
