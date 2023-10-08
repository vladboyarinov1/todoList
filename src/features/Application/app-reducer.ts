import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthApi} from '../../api/todolist-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {setIsLoggedInAC} from '../Auth/auth-reducer';

export const initializeAppTC = createAsyncThunk('app/initializeApp', async (param, {dispatch}) => {
    dispatch(setLoadingStatusAC({status: 'loading'}))
    try {
        const res = await AuthApi.me()
        if (res.data.resultCode === 0) {
            //значит залогинины
            dispatch(setIsLoggedInAC({value: true}));
            return;
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
})

export const slice = createSlice({
    name: 'app',
    initialState: {
        error: null as string | null,// errorIsActive
        status: 'loading' as RequestStatusType,
        isInitialized: false,
        isLinearProgress: false
    } as InitialStateType,
    reducers: {
        setLoadingStatusAC(state, action: PayloadAction<{
            status: RequestStatusType
        }>) {
            state.status = action.payload.status
        },
        setErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setLinearProgressAC(state: InitialStateType, action: PayloadAction<{ value: boolean }>) {
            state.isLinearProgress = action.payload.value
        },
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.isInitialized = true
        });
    }
})

// const appReducer = slice.reducer
export const {setLoadingStatusAC, setErrorAC, setLinearProgressAC} = slice.actions

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppActionsType =
    | SetLoadingStatusACType
    | ReturnType<typeof setErrorAC>
type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
    isLinearProgress: boolean
}
export type SetLoadingStatusACType = ReturnType<typeof setLoadingStatusAC>
export type SetErrorACType = ReturnType<typeof setErrorAC>


