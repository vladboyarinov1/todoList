import {setLoadingStatusAC} from '../../../App/app-reducer/app-reducer';
import {AuthApi, FieldErrorType} from '../../../api/todolist-api';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {ResultCode} from '../../../components/TodolistsList/TodoList/Task/tasks-reducer/tasks-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FormValuesType} from '../Auth';

export const loginTC = createAsyncThunk<undefined, FormValuesType, {
    rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] }
}>('auth/login', async (param: FormValuesType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatusAC({status: 'loading'}))
    try {
        let res = await AuthApi.login(param)
        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(setLoadingStatusAC({status: 'succeeded'}))
            return //return {value: true};
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e: any) {
        handleServerNetworkError(e, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [e.errors], fieldsErrors: undefined})
    }

})

export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatusAC({status: 'loading'}))
    try {
        let res = await AuthApi.logout()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setLoadingStatusAC({status: 'succeeded'}))
            return
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (e: any) {
        handleServerNetworkError(e, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }

})
export const asyncActions = {
    loginTC,
    logoutTC
}

export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state) => {
            state.isLoggedIn = true
        });
        builder.addCase(logoutTC.fulfilled, (state) => {
            state.isLoggedIn = false
        });


    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions



