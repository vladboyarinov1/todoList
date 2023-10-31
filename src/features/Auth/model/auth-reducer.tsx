import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "features/CommonActions/App";
import { authAction } from "features/Auth/index";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { authAPI, LoginParams } from "features/Auth/api/authAPI";
import { ResultCode } from "common/enums/enums";

const { setLoadingStatus } = appActions;

export const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            });
    },
});

export const login = createAppAsyncThunk<{ isLoggedIn: true }, LoginParams>(
    `${slice.name}/login`,
    async (param: LoginParams, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;
        dispatch(setLoadingStatus({ status: "loading" }));
        try {
            let res = await authAPI.login(param);
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(setLoadingStatus({ status: "succeeded" }));
                return { isLoggedIn: true };
            } else {
                handleServerAppError(res.data, thunkAPI);
                return rejectWithValue({
                    errors: res.data.messages,
                    fieldsErrors: res.data.fieldsErrors,
                });
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue({
                errors: [e.errors],
                fieldsErrors: undefined,
            });
        }
    },
);

export const logout = createAppAsyncThunk<any, undefined>(`${slice.name}/logout`, async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(setLoadingStatus({ status: "loading" }));
    try {
        let res = await authAPI.logout();
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setLoadingStatus({ status: "succeeded" }));
            dispatch(authAction.setIsLoggedIn({ isLoggedIn: false }));
            return { isLoggedIn: false };
        } else {
            return handleServerAppError(res.data, thunkAPI);
        }
    } catch (error: any) {
        return handleServerNetworkError(error, dispatch);
    }
});

export const initializeApp = createAppAsyncThunk(`${slice.name}/initializeApp`, async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(appActions.setLoadingStatus({ status: "loading" }));
    try {
        const res = await authAPI.me();
        if (res.data.resultCode === ResultCode.OK) {
            //значит залогинины
            dispatch(authAction.setIsLoggedIn({ isLoggedIn: true }));
            return;
        } else {
            // handleServerAppError(res.data, thunkAPI);
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch);
    }
});
export const asyncActions = {
    login,
    logout,
    initializeApp,
};
