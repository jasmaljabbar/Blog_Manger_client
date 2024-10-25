import {createSlice} from '@reduxjs/toolkit'
import { loginUser,signUpUser,logout, userData } from '../actions/userActions'



const userSlice = createSlice({
    name:"user",
    initialState:{
        loading: false,
        user: JSON.parse(localStorage.getItem('user')) || null,
        userData:null,
        error: null,
    },
    reducers:{},
    extraReducers: (builder) =>{
        builder
        //useDetails
        .addCase(userData.pending,(state)=>{
            state.loading = true;
        })
        .addCase(userData.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.error = null;
            state.userData = payload;
        })
        .addCase(userData.rejected,(state, {payload})=>{
            state.loading = false;
            state.userData = null;
            state.error = payload;
        })

        //Logout States
        .addCase(logout.pending, (state)=>{
            state.loading = true;
        })
        .addCase(logout.fulfilled,(state)=>{
            state.loading = false;
            state.error = null;
            state.userData = null;
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
            localStorage.setItem('userData', JSON.stringify(payload))
            localStorage.setItem('user', JSON.stringify(payload.tokens));

        })
        .addCase(loginUser.rejected, (state, {payload})=>{
            state.loading = false;
            state.user = null;
            state.error = payload;
        })
        // Sign-Up States
        .addCase(signUpUser.pending, (state)=>{
            state.loading = true;
        })
        .addCase(signUpUser.fulfilled, (state, {payload})=>{
            state.loading = false;
            state.error = null;
            state.user = payload;
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
