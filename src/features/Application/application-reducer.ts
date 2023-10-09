import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AuthApi} from '../../api/todolist-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {authAction} from '../Auth';
import {appActions} from '../CommonActions/App';

export const initializeApp = createAsyncThunk('application/initializeApp', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setLoadingStatus({status: 'loading'}))
    try {
        const res = await AuthApi.me()
        if (res.data.resultCode === 0) {
            //значит залогинины
            thunkAPI.dispatch(authAction.setIsLoggedIn({value: true}));
            return;
        } else {
            handleServerAppError(res.data, thunkAPI)
        }
    } catch (e: any) {
        handleServerNetworkError(e, thunkAPI.dispatch)
    }
})

export const asyncActions = {
    initializeApp
}

export const slice = createSlice({
    name: 'application',
    initialState: {
        error: null as string | null,// errorIsActive
        status: 'loading' as RequestStatusType,
        isInitialized: false,
        isLinearProgress: false
    } as InitialStateType,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(initializeApp.fulfilled, (state) => {
                state.isInitialized = true
            })
            .addCase(appActions.setLoadingStatus, (state, action) => {
                state.status = action.payload.status
            })
            .addCase(appActions.setError, (state, action) => {
                state.error = action.payload.error
            })
            .addCase(appActions.setLinearProgress, (state, action) => {
                state.isLinearProgress = action.payload.value
            })
    }
})

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
    isLinearProgress: boolean | null
}



