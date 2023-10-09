import {AuthApi} from '../../api/todolist-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {ResultCode} from '../TodolistsList/tasks-reducer/tasks-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FormValuesType} from './Auth';
import {FieldErrorType} from '../../api/types';
import {appActions} from '../CommonActions/App';

const {setLoadingStatus} = appActions

export const login = createAsyncThunk<undefined, FormValuesType, {
    rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] }
}>('auth/login', async (param: FormValuesType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus({status: 'loading'}))
    try {
        let res = await AuthApi.login(param)
        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(setLoadingStatus({status: 'succeeded'}))
            return //return {value: true};
        } else {
            handleServerAppError(res.data, thunkAPI)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e: any) {
        handleServerNetworkError(e, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [e.errors], fieldsErrors: undefined})
    }

})

export const logout = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus({status: 'loading'}))
    try {
        let res = await AuthApi.logout()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setLoadingStatus({status: 'succeeded'}))
            return
        } else {
            return handleServerAppError(res.data, thunkAPI)
        }
    } catch (error: any) {
        return handleServerNetworkError(error, thunkAPI.dispatch)
    }

})
export const asyncActions = {
    login, logout
}

export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder
            .addCase(login.fulfilled, (state) => {
                state.isLoggedIn = true
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false
            });


    }
})

export const authReducer = slice.reducer
export const {setIsLoggedIn} = slice.actions



