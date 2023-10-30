import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginParams } from "./Auth";
import { appActions } from "../CommonActions/App";
import { authAction } from "features/Auth/index";
import { handleServerAppError, handleServerNetworkError } from "common/utils";
import { authAPI } from "features/Auth/authAPI";
import { ResultCode } from "common/enums/enums";
import { FieldErrorType } from "common/types/commonTypes";

const { setLoadingStatus } = appActions;

export const login = createAsyncThunk<
    undefined,
    LoginParams,
    {
        rejectValue: { errors: string[]; fieldsErrors?: FieldErrorType[] };
    }
>("auth/login", async (param: LoginParams, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus({ status: "loading" }));
    try {
        let res = await authAPI.login(param);
        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(setLoadingStatus({ status: "succeeded" }));
            return; //return {value: true};
        } else {
            handleServerAppError(res.data, thunkAPI);
            return thunkAPI.rejectWithValue({
                errors: res.data.messages,
                fieldsErrors: res.data.fieldsErrors,
            });
        }
    } catch (e: any) {
        handleServerNetworkError(e, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({
            errors: [e.errors],
            fieldsErrors: undefined,
        });
    }
});

export const logout = createAsyncThunk(
    "auth/logout",
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setLoadingStatus({ status: "loading" }));
        try {
            let res = await authAPI.logout();
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setLoadingStatus({ status: "succeeded" }));
                thunkAPI.dispatch(
                    authAction.setIsLoggedIn({ isLoggedIn: false }),
                );
                return;
            } else {
                return handleServerAppError(res.data, thunkAPI);
            }
        } catch (error: any) {
            return handleServerNetworkError(error, thunkAPI.dispatch);
        }
    },
);
export const asyncActions = {
    login,
    logout,
};

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
            .addCase(login.fulfilled, (state) => {
                state.isLoggedIn = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false;
            });
    },
});
