import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleServerAppError } from "common/utils/handleServerAppError";
import { authAction } from "../Auth";
import { appActions } from "../CommonActions/App";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { authAPI } from "features/Auth/authAPI";

export const initializeApp = createAsyncThunk(
    "application/initializeApp",
    async (param, thunkAPI) => {
        thunkAPI.dispatch(appActions.setLoadingStatus({ status: "loading" }));
        try {
            const res = await authAPI.me();
            if (res.data.resultCode === 0) {
                //значит залогинины
                thunkAPI.dispatch(
                    authAction.setIsLoggedIn({ isLoggedIn: true }),
                );
                return;
            } else {
                handleServerAppError(res.data, thunkAPI);
            }
        } catch (e: any) {
            handleServerNetworkError(e, thunkAPI.dispatch);
        }
    },
);

export const asyncActions = {
    initializeApp,
};

export const slice = createSlice({
    name: "application",
    initialState: {
        error: null as string | null, // errorIsActive
        status: "loading" as RequestStatusType,
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
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
