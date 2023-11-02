import { createSlice, isAnyOf, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "../CommonActions/App";
import { initializeApp } from "features/Auth/model/authSlice";
import { AnyAction } from "redux";
import { authAction } from "features/Auth";
import { todolistsActions } from "features/TodolistsList";

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
            })
            .addMatcher(isPending, (state, action) => {
                state.isLinearProgress = true;
            })
            .addMatcher(isRejected, (state, action: AnyAction) => {
                state.isLinearProgress = false;
                debugger;
                if (action.payload) {
                    if (isAnyOf(todolistsActions.addTodolist.rejected)) return;
                    state.error = action.payload.errors[0];
                } else {
                    state.error = action.error.message ?? "Some error occurred";
                }
            })
            .addMatcher(isFulfilled, (state, action) => {
                state.isLinearProgress = false;
            })
            .addMatcher(isPending(authAction.initializeApp, authAction.logout, authAction.login), (state, action) => {
                state.status = "loading";
            })
            .addMatcher(isRejected(authAction.initializeApp, authAction.logout, authAction.login), (state, action) => {
                state.status = "failed";
            })
            .addMatcher(isFulfilled(authAction.initializeApp, authAction.logout, authAction.login), (state, action) => {
                state.status = "succeeded";
            });
    },
});

//types
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
