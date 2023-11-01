import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "../CommonActions/App";
import { initializeApp } from "features/Auth/model/auth-reducer";

export const slice = createSlice({
    name: "application",
    initialState: {
        error: null as string | null, // errorIsActive
        status: "loading" as RequestStatus,
        isInitialized: false,
        isLinearProgress: false as boolean | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initializeApp.fulfilled, (state) => {
                state.isInitialized = true;
            })
            .addCase(appActions.setLoadingStatus, (state, action) => {
                state.status = action.payload.status;
            })
            .addCase(appActions.setError, (state, action) => {
                state.error = action.payload.error;
            })
            .addCase(appActions.setLinearProgress, (state, action) => {
                state.isLinearProgress = action.payload.value;
            });
    },
});

//types
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
